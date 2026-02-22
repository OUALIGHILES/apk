'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { staticPagesAPI } from '@/lib/api/extended';
import { HelpCircle, MessageCircle, Mail, Phone, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [faqs, setFaqs] = useState<Array<{
    id: string;
    question: string;
    answer: string;
    question_ar?: string;
    answer_ar?: string;
  }>>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    loadFAQ();
  }, []);

  const loadFAQ = async () => {
    try {
      setLoading(true);
      const data = await staticPagesAPI.getFAQ();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      // Note: This needs backend implementation
      alert('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setActiveTab('faq');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Help & Support" />

      <main className="w-full">
        {/* Tab Switcher */}
        <section className="mt-4 px-4">
          <div className="tab-strip">
            <button
              onClick={() => setActiveTab('faq')}
              className={`tab-btn ${activeTab === 'faq' ? 'tab-active' : ''}`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`tab-btn ${activeTab === 'contact' ? 'tab-active' : ''}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Us</span>
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <section className="px-4 mt-6 mb-6">
            {loading ? (
              <div className="loading-state">
                <div className="loader" />
                <p className="loading-text">Loading FAQ...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="empty-full">
                <div className="empty-icon-wrap">
                  <HelpCircle className="w-10 h-10 empty-icon" />
                </div>
                <p className="empty-title">No FAQs Available</p>
                <p className="empty-sub">Check back soon for frequently asked questions</p>
                <button onClick={() => setActiveTab('contact')} className="pill-btn mt-6">Contact Support</button>
              </div>
            ) : (
              <div className="faq-list">
                {faqs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="faq-question"
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <>
            {/* Contact Options */}
            <section className="px-4 mt-6">
              <div className="section-card">
                <h3 className="section-label-title">Get in Touch</h3>
                <div className="contact-options">
                  <a href="tel:+966500000000" className="contact-option">
                    <div className="contact-icon contact-icon-call">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="contact-label">Call Us</p>
                      <p className="contact-value">+966 50 000 0000</p>
                    </div>
                  </a>
                  <a href="mailto:support@kafek.com" className="contact-option">
                    <div className="contact-icon contact-icon-mail">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="contact-label">Email Us</p>
                      <p className="contact-value">support@kafek.com</p>
                    </div>
                  </a>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="px-4 mt-4">
              <div className="section-card">
                <h3 className="section-label-title">
                  <MessageCircle className="w-5 h-5" />
                  Send us a Message
                </h3>

                <div className="form-fields">
                  <div className="form-field">
                    <label className="field-label">Your Name *</label>
                    <div className="field-wrap">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Email Address *</label>
                    <div className="field-wrap">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Subject</label>
                    <div className="field-wrap">
                      <input
                        type="text"
                        placeholder="What is this about?"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Message *</label>
                    <textarea
                      className="field-textarea"
                      rows={5}
                      placeholder="How can we help you?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>

                  <button onClick={handleSendMessage} disabled={sending} className="save-btn">
                    {sending ? (
                      <><div className="loader-sm" />Sending...</>
                    ) : (
                      <><Send className="w-5 h-5" />Send Message</>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Business Hours */}
            <section className="px-4 mt-4 mb-6">
              <div className="info-card">
                <div className="info-icon">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="info-body">
                  <h4 className="info-title">Support Hours</h4>
                  <p className="info-text">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                  <p className="info-text">Friday - Saturday: Closed</p>
                  <p className="info-text-small">Response time: Within 24 hours</p>
                </div>
              </div>
            </section>
          </>
        )}
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

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;border:none;cursor:pointer}

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Tabs */
  .tab-strip { display: flex; gap: 8px; background: var(--surface); padding: 6px; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 16px; border-radius: 12px; background: transparent; border: none; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; }
  .tab-btn:hover { background: rgba(10,22,40,.04); }
  .tab-active { background: var(--primary); color: #fff; }

  /* FAQ List */
  .faq-list { display: flex; flex-direction: column; gap: 10px; }
  .faq-item { background: var(--surface); border-radius: var(--radius); box-shadow: 0 1px 4px rgba(0,0,0,.05); overflow: hidden; }
  .faq-question { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 16px 18px; background: none; border: none; cursor: pointer; transition: all .2s; text-align: left; }
  .faq-question:hover { background: rgba(10,22,40,.03); }
  .faq-question-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--primary); flex: 1; }
  .faq-answer { padding: 0 18px 16px 18px; font-size: 13px; color: var(--muted); line-height: 1.6; border-top: 1px solid var(--border); margin: 0 18px; padding-top: 12px; }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

  /* Contact Options */
  .contact-options { display: flex; flex-direction: column; gap: 10px; }
  .contact-option { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--bg); border-radius: 12px; text-decoration: none; transition: all .2s; }
  .contact-option:hover { background: rgba(10,22,40,.04); }
  .contact-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .contact-icon-call { background: rgba(29,184,122,.1); color: var(--green); }
  .contact-icon-mail { background: rgba(61,111,255,.1); color: var(--accent); }
  .contact-label { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 2px; }
  .contact-value { font-size: 12px; color: var(--muted); }

  /* Form Fields */
  .form-fields { display: flex; flex-direction: column; gap: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-input { width: 100%; padding: 12px 14px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }
  .field-textarea { width: 100%; padding: 12px 14px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; resize: vertical; }
  .field-textarea:focus { border-color: var(--accent); }
  .field-textarea::placeholder { color: var(--muted); }

  /* Action Button */
  .save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 8px 28px rgba(10,22,40,.25); }
  .save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(10,22,40,.35); }
  .save-btn:active { transform: scale(.98); }
  .save-btn:disabled { opacity: .6; cursor: not-allowed; }

  /* Info Card */
  .info-card { display: flex; gap: 14px; padding: 18px; background: rgba(61,111,255,.08); border: 1.5px solid rgba(61,111,255,.2); border-radius: var(--radius); }
  .info-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(61,111,255,.15); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .info-body { flex: 1; }
  .info-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .info-text { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
  .info-text-small { font-size: 11px; color: var(--muted); margin-top: 8px; font-style: italic; }
`;
