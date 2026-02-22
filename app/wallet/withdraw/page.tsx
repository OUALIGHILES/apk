'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { walletAPI } from '@/lib/api/extended';
import { Wallet, DollarSign, Building, CreditCard, Info, AlertCircle, ChevronLeft } from 'lucide-react';

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
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Withdraw Funds" />

      <main className="w-full">
        {/* Balance Card */}
        <section className="px-4 mt-4">
          <div className="balance-card">
            <div>
              <p className="balance-label">Available Balance</p>
              <h2 className="balance-amount">{balance} SAR</h2>
            </div>
            <div className="balance-icon-wrap">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Info Card */}
        <section className="px-4 mt-4">
          <div className="info-card info-warning">
            <div className="info-icon-warning">
              <Info className="w-5 h-5" />
            </div>
            <div className="info-body">
              <h4 className="info-title">Withdrawal Information</h4>
              <ul className="info-list">
                <li>Minimum withdrawal: 50 SAR</li>
                <li>Processing time: 1-3 business days</li>
                <li>Funds will be transferred to your bank account</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Withdrawal Form */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">Bank Account Details</h3>

            <div className="form-fields">
              <div className="form-field">
                <label className="field-label">Withdrawal Amount *</label>
                <div className="field-wrap">
                  <DollarSign className="field-icon" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`field-input ${errors.amount ? 'field-error' : ''}`}
                  />
                </div>
                {errors.amount && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">Bank Name *</label>
                <div className="field-wrap">
                  <Building className="field-icon" />
                  <input
                    type="text"
                    placeholder="e.g., Al Rajhi Bank"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    className={`field-input ${errors.bank_name ? 'field-error' : ''}`}
                  />
                </div>
                {errors.bank_name && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.bank_name}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">Account Number *</label>
                <div className="field-wrap">
                  <CreditCard className="field-icon" />
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={formData.account_no}
                    onChange={(e) => setFormData({ ...formData, account_no: e.target.value })}
                    className={`field-input ${errors.account_no ? 'field-error' : ''}`}
                  />
                </div>
                {errors.account_no && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.account_no}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">Account Title *</label>
                <div className="field-wrap">
                  <Building className="field-icon" />
                  <input
                    type="text"
                    placeholder="Name on account"
                    value={formData.account_title}
                    onChange={(e) => setFormData({ ...formData, account_title: e.target.value })}
                    className={`field-input ${errors.account_title ? 'field-error' : ''}`}
                  />
                </div>
                {errors.account_title && (
                  <p className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.account_title}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">IBAN (Optional)</label>
                <div className="field-wrap">
                  <CreditCard className="field-icon" />
                  <input
                    type="text"
                    placeholder="SA00 0000 0000 0000 0000 0000"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="field-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="px-4 mt-4">
          <div className="section-card">
            <h3 className="section-label-title">Withdrawal Summary</h3>
            <div className="summary-list">
              <div className="summary-row">
                <span className="summary-label">Amount</span>
                <span className="summary-value">{formData.amount || '0.00'} SAR</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Processing Fee</span>
                <span className="summary-value-free">FREE</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span className="summary-label-total">You'll Receive</span>
                <span className="summary-value-total">{formData.amount || '0.00'} SAR</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-4 mt-4">
          <button onClick={handleWithdraw} disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0} className="save-btn">
            {loading ? (
              <><div className="loader-sm" />Processing...</>
            ) : (
              <>Submit Withdrawal Request</>
            )}
          </button>
          <button onClick={() => router.push('/wallet')} className="cancel-btn">
            <ChevronLeft className="w-5 h-5" />Cancel
          </button>
        </section>
      </main>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }
  .loader-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Balance Card */
  .balance-card { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: linear-gradient(135deg, var(--green) 0%, #0A8A58 100%); border-radius: var(--radius); color: #fff; box-shadow: 0 8px 24px rgba(29,184,122,.25); }
  .balance-label { font-size: 13px; opacity: .9; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
  .balance-amount { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; }
  .balance-icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,.2); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }

  /* Info Card */
  .info-card { display: flex; gap: 14px; padding: 18px; background: rgba(61,111,255,.08); border: 1.5px solid rgba(61,111,255,.2); border-radius: var(--radius); }
  .info-warning { background: rgba(234,179,8,.08); border-color: rgba(234,179,8,.2); }
  .info-icon-warning { width: 44px; height: 44px; border-radius: 12px; background: rgba(234,179,8,.15); display: flex; align-items: center; justify-content: center; color: #a16207; flex-shrink: 0; }
  .info-body { flex: 1; }
  .info-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .info-list { list-style: none; padding: 0; margin: 0; }
  .info-list li { font-size: 12px; color: var(--muted); margin-bottom: 4px; padding-left: 12px; position: relative; }
  .info-list li::before { content: '•'; position: absolute; left: 0; color: var(--accent); font-weight: bold; }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

  /* Form Fields */
  .form-fields { display: flex; flex-direction: column; gap: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); pointer-events: none; }
  .field-input { width: 100%; padding: 12px 14px 12px 44px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }
  .field-error { border-color: var(--accent2) !important; }
  .field-error-text { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--accent2); margin-top: 6px; font-weight: 500; }

  /* Summary List */
  .summary-list { display: flex; flex-direction: column; gap: 10px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; }
  .summary-label { font-size: 13px; color: var(--muted); }
  .summary-value { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--primary); }
  .summary-value-free { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--green); }
  .summary-divider { height: 1px; background: var(--border); margin: 4px 0; }
  .summary-total { padding-top: 12px; }
  .summary-label-total { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); }
  .summary-value-total { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }

  /* Action Buttons */
  .save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 8px 28px rgba(10,22,40,.25); }
  .save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(10,22,40,.35); }
  .save-btn:active { transform: scale(.98); }
  .save-btn:disabled { opacity: .6; cursor: not-allowed; }
  .cancel-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 14px; background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; margin-top: 10px; }
  .cancel-btn:hover { background: var(--bg); }
`;
