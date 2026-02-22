'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuthStore } from '@/store/authStore';
import { walletAPI, WalletTransaction } from '@/lib/api/extended';
import { Wallet as WalletIcon, DollarSign, TrendingUp, TrendingDown, Plus, CreditCard, Building, ChevronRight } from 'lucide-react';

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
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="My Wallet" />

      <main className="w-full">
        {/* Wallet Balance Card */}
        <section className="px-4 mt-4">
          <div className="wallet-card">
            <div className="wallet-header">
              <div className="wallet-icon-wrap">
                <WalletIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="wallet-label">Current Balance</p>
                <h2 className="wallet-amount">{balance} SAR</h2>
              </div>
            </div>
            <div className="wallet-actions">
              <button onClick={() => setShowTopUp(true)} className="wallet-action-btn">
                <Plus className="w-4 h-4" />
                <span>Top Up</span>
              </button>
              <button onClick={() => router.push('/wallet/withdraw')} className="wallet-action-btn-outline">
                Withdraw
              </button>
            </div>
          </div>
        </section>

        {/* Quick Top Up Amounts */}
        {showTopUp && (
          <section className="px-4 mt-4">
            <div className="section-card">
              <h3 className="section-label-title">
                <Plus className="w-5 h-5" />
                Add Money to Wallet
              </h3>

              <div className="form-fields">
                <div className="form-field">
                  <label className="field-label">Amount (SAR)</label>
                  <div className="field-wrap">
                    <DollarSign className="field-icon" />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Quick Amounts</label>
                  <div className="quick-amounts">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount)}
                        className={`quick-btn ${topUpAmount === amount ? 'quick-active' : ''}`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Payment Method</label>
                  <div className="payment-options">
                    <label
                      className={`payment-option ${paymentMethod === 'card' ? 'payment-active' : ''}`}
                    >
                      <div className="payment-left">
                        <CreditCard className="w-5 h-5" />
                        <span className="payment-label-text">Credit/Debit Card</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="payment-radio"
                      />
                    </label>

                    <label
                      className={`payment-option ${paymentMethod === 'bank' ? 'payment-active' : ''}`}
                    >
                      <div className="payment-left">
                        <Building className="w-5 h-5" />
                        <span className="payment-label-text">Bank Transfer</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="payment-radio"
                      />
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={handleTopUp} disabled={toppingUp} className="save-btn-sm">
                    {toppingUp ? (
                      <><div className="loader-sm" />Processing...</>
                    ) : (
                      <>Pay {topUpAmount ? `${topUpAmount} SAR` : ''}</>
                    )}
                  </button>
                  <button onClick={() => { setShowTopUp(false); setTopUpAmount(''); }} className="cancel-btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Transaction History */}
        <section className="px-4 mt-4 mb-6">
          <div className="section-card">
            <div className="section-header">
              <div>
                <h3 className="section-label-title">
                  <TrendingUp className="w-5 h-5" />
                  Transaction History
                </h3>
              </div>
              <button className="view-all-btn">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loader" />
                <p className="loading-text">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-wrap-sm">
                  <WalletIcon className="w-10 h-10 empty-icon" />
                </div>
                <p className="empty-title-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="transactions-list">
                {transactions.map((tx) => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-left">
                      <div className={`transaction-icon ${tx.transaction_type === 'credit' ? 'transaction-credit' : 'transaction-debit'}`}>
                        {tx.transaction_type === 'credit' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="transaction-title">
                          {tx.description || tx.transaction_type.toUpperCase()}
                        </p>
                        <p className="transaction-date">
                          {new Date(tx.date_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="transaction-right">
                      <p className={`transaction-amount ${tx.transaction_type === 'credit' ? 'amount-credit' : 'amount-debit'}`}>
                        {tx.transaction_type === 'credit' ? '+' : '-'}{tx.amount} SAR
                      </p>
                      <p className="transaction-method">{tx.payment_method}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info Card */}
        <section className="px-4 mt-4 mb-6">
          <div className="info-card">
            <div className="info-icon">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="info-body">
              <h4 className="info-title">Wallet Benefits</h4>
              <ul className="info-list">
                <li>Fast checkout - No need to enter card details</li>
                <li>Track all your transactions</li>
                <li>Get cashback and rewards</li>
                <li>Withdraw anytime to your bank</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation activeTab="profile" />
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
  .loader { width: 40px; height: 40px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  .loader-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Wallet Card */
  .wallet-card { background: linear-gradient(135deg, var(--primary) 0%, #1a3a6b 100%); border-radius: var(--radius); padding: 20px; color: #fff; box-shadow: 0 8px 24px rgba(10,22,40,.25); }
  .wallet-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .wallet-icon-wrap { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .wallet-label { font-size: 13px; opacity: .85; margin-bottom: 4px; font-family: 'DM Sans', sans-serif; }
  .wallet-amount { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; }
  .wallet-actions { display: flex; gap: 10px; }
  .wallet-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; background: #fff; color: var(--primary); border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .wallet-action-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }
  .wallet-action-btn-outline { flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.4); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .wallet-action-btn-outline:hover { background: rgba(255,255,255,.1); }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .view-all-btn { display: flex; align-items: center; gap: 2px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700; color: var(--accent); background: none; border: none; cursor: pointer; padding-bottom: 2px; }
  .view-all-btn:hover { text-decoration: underline; }

  /* Form Fields */
  .form-fields { display: flex; flex-direction: column; gap: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); pointer-events: none; }
  .field-input { width: 100%; padding: 12px 14px 12px 44px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }

  /* Quick Amounts */
  .quick-amounts { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  .quick-btn { padding: 12px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; }
  .quick-btn:hover { border-color: rgba(61,111,255,.4); }
  .quick-active { background: rgba(61,111,255,.08); border-color: var(--accent); color: var(--accent); }

  /* Payment Options */
  .payment-options { display: flex; flex-direction: column; gap: 8px; }
  .payment-option { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; transition: all .2s; }
  .payment-option:hover { border-color: rgba(61,111,255,.35); }
  .payment-active { border-color: var(--accent); background: rgba(61,111,255,.05); }
  .payment-left { display: flex; align-items: center; gap: 12px; }
  .payment-label-text { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); }
  .payment-radio { width: 18px; height: 18px; accent-color: var(--accent); }

  /* Form Actions */
  .form-actions { display: flex; gap: 10px; padding-top: 8px; }
  .save-btn-sm { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .save-btn-sm:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,22,40,.15); }
  .save-btn-sm:disabled { opacity: .6; cursor: not-allowed; }
  .cancel-btn-sm { flex: 1; padding: 12px; background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
  .cancel-btn-sm:hover { background: var(--bg); }

  /* Loading & Empty States */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }
  .empty-state { display: flex; flex-direction: column; align-items: center; padding: 24px; }
  .empty-icon-wrap-sm { width: 64px; height: 64px; border-radius: 16px; background: rgba(10,22,40,.06); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .empty-icon { color: var(--muted); }
  .empty-title-sm { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); }

  /* Transactions List */
  .transactions-list { display: flex; flex-direction: column; gap: 10px; }
  .transaction-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--bg); border-radius: 12px; transition: all .2s; }
  .transaction-item:hover { background: rgba(10,22,40,.04); }
  .transaction-left { display: flex; align-items: center; gap: 12px; }
  .transaction-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .transaction-credit { background: rgba(29,184,122,.1); color: var(--green); }
  .transaction-debit { background: rgba(255,92,58,.1); color: var(--accent2); }
  .transaction-title { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); }
  .transaction-date { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .transaction-right { text-align: right; }
  .transaction-amount { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; }
  .amount-credit { color: var(--green); }
  .amount-debit { color: var(--accent2); }
  .transaction-method { font-size: 11px; color: var(--muted); text-transform: capitalize; margin-top: 2px; }

  /* Info Card */
  .info-card { display: flex; gap: 14px; padding: 18px; background: rgba(61,111,255,.08); border: 1.5px solid rgba(61,111,255,.2); border-radius: var(--radius); }
  .info-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(61,111,255,.15); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .info-body { flex: 1; }
  .info-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .info-list { list-style: none; padding: 0; margin: 0; }
  .info-list li { font-size: 12px; color: var(--muted); margin-bottom: 4px; padding-left: 12px; position: relative; }
  .info-list li::before { content: '✓'; position: absolute; left: 0; color: var(--accent); font-weight: bold; }
`;
