'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { walletAPI, WalletTransaction } from '@/lib/api/extended';
import { Wallet as WalletIcon, DollarSign, TrendingUp, TrendingDown, Plus, ArrowRight, CreditCard, Building } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [balance, setBalance] = useState('0.00');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [toppingUp, setToppingUp] = useState(false);

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await walletAPI.getWallet(user.id);
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setToppingUp(true);
      
      // In production, this would integrate with Tap payment gateway
      await walletAPI.addWalletAmount({
        user_id: user!.id,
        amount: topUpAmount,
        payment_method: paymentMethod,
      });

      alert('Wallet topped up successfully!');
      setShowTopUp(false);
      setTopUpAmount('');
      loadWallet();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to top up wallet');
    } finally {
      setToppingUp(false);
    }
  };

  const quickAmounts = ['50', '100', '200', '500'];

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="My Wallet" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Wallet Balance Card */}
        <Card className="mb-4 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Current Balance</p>
                <h2 className="text-3xl font-bold">{balance} SAR</h2>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowTopUp(true)}
              className="flex-1 bg-white text-primary hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </Button>
            <Button
              onClick={() => router.push('/wallet/withdraw')}
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white/10"
            >
              Withdraw
            </Button>
          </div>
        </Card>

        {/* Quick Top Up Amounts */}
        {showTopUp && (
          <Card className="mb-4">
            <h3 className="font-bold text-primary mb-3 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Money to Wallet
            </h3>
            
            <div className="space-y-3">
              <Input
                label="Amount (SAR)"
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                icon={<DollarSign className="w-5 h-5" />}
              />

              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Quick Amounts
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        topUpAmount === amount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-primary"
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center">
                      <Building className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="w-4 h-4 text-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <Button
                  onClick={handleTopUp}
                  loading={toppingUp}
                  className="flex-1"
                >
                  Pay {topUpAmount ? `${topUpAmount} SAR` : ''}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTopUp(false);
                    setTopUpAmount('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Transaction History
            </h3>
            <button className="text-sm text-button font-medium hover:underline">
              View All
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <WalletIcon className="w-12 h-12 mx-auto text-greyunselect/30 mb-2" />
              <p className="text-greyunselect">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.transaction_type === 'credit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {tx.transaction_type === 'credit' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        {tx.description || tx.transaction_type.toUpperCase()}
                      </p>
                      <p className="text-xs text-greyunselect">
                        {new Date(tx.date_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.transaction_type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {tx.transaction_type === 'credit' ? '+' : '-'}{tx.amount} SAR
                    </p>
                    <p className="text-xs text-greyunselect capitalize">
                      {tx.payment_method}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">Wallet Benefits</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Fast checkout - No need to enter card details</li>
                <li>✓ Track all your transactions</li>
                <li>✓ Get cashback and rewards</li>
                <li>✓ Withdraw anytime to your bank</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
