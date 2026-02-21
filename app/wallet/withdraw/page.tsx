'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { walletAPI } from '@/lib/api/extended';
import { Wallet, DollarSign, Building, CreditCard, Info } from 'lucide-react';

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    bank_name: '',
    account_no: '',
    account_title: '',
    iban: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    try {
      const data = await walletAPI.getWallet(user.id);
      setBalance(data.balance);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const amount = parseFloat(formData.amount);

    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amount > parseFloat(balance)) {
      newErrors.amount = 'Insufficient balance';
    } else if (amount < 50) {
      newErrors.amount = 'Minimum withdrawal amount is 50 SAR';
    }

    if (!formData.bank_name) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.account_no) {
      newErrors.account_no = 'Account number is required';
    }

    if (!formData.account_title) {
      newErrors.account_title = 'Account title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;

    if (!user) return;

    try {
      setLoading(true);
      await walletAPI.addWithdrawRequest({
        user_id: user.id,
        amount: formData.amount,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        account_title: formData.account_title,
        iban: formData.iban,
      });

      alert('Withdrawal request submitted successfully!');
      router.push('/wallet');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-screenback">
      <Header title="Withdraw Funds" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Balance Card */}
        <Card className="mb-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold">{balance} SAR</h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mb-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-yellow-800 mb-1">Withdrawal Information</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Minimum withdrawal: 50 SAR</li>
                <li>• Processing time: 1-3 business days</li>
                <li>• Funds will be transferred to your bank account</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Withdrawal Form */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-4">Bank Account Details</h3>

          <div className="space-y-4">
            <Input
              label="Withdrawal Amount *"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              icon={<DollarSign className="w-5 h-5" />}
              error={errors.amount}
            />

            <Input
              label="Bank Name *"
              placeholder="e.g., Al Rajhi Bank"
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              icon={<Building className="w-5 h-5" />}
              error={errors.bank_name}
            />

            <Input
              label="Account Number *"
              placeholder="Enter account number"
              value={formData.account_no}
              onChange={(e) => setFormData({ ...formData, account_no: e.target.value })}
              icon={<CreditCard className="w-5 h-5" />}
              error={errors.account_no}
            />

            <Input
              label="Account Title *"
              placeholder="Name on account"
              value={formData.account_title}
              onChange={(e) => setFormData({ ...formData, account_title: e.target.value })}
              icon={<Building className="w-5 h-5" />}
              error={errors.account_title}
            />

            <Input
              label="IBAN (Optional)"
              placeholder="SA00 0000 0000 0000 0000 0000"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
              icon={<CreditCard className="w-5 h-5" />}
            />
          </div>
        </Card>

        {/* Summary */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-3">Withdrawal Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Amount</span>
              <span className="font-medium">{formData.amount || '0.00'} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Processing Fee</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-primary">You'll Receive</span>
              <span className="font-bold text-button">{formData.amount || '0.00'} SAR</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleWithdraw}
            loading={loading}
            className="w-full"
            disabled={!formData.amount || parseFloat(formData.amount) <= 0}
          >
            Submit Withdrawal Request
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/wallet')}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
