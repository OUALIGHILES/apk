'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { staticPagesAPI } from '@/lib/api/extended';
import { FileText, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const [content, setContent] = useState<{
    page_title: string;
    page_content: string;
    page_title_ar?: string;
    page_content_ar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const data = await staticPagesAPI.getStaticPage('terms');
      setContent(data);
    } catch (error) {
      console.error('Error loading terms:', error);
      // Fallback content
      setContent({
        page_title: 'Terms & Conditions',
        page_content: `
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Kafek, you accept and agree to be bound by these Terms and Conditions.</p>

          <h2>2. Use of Service</h2>
          <p>You agree to use Kafek only for lawful purposes and in accordance with these terms.</p>

          <h2>3. User Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2>4. Orders and Payments</h2>
          <p>All orders are subject to availability and acceptance. Prices are subject to change.</p>

          <h2>5. Delivery</h2>
          <p>We strive to deliver orders on time but cannot guarantee exact delivery times.</p>

          <h2>6. Cancellations and Refunds</h2>
          <p>Cancellations must be made before order confirmation. Refunds are processed according to our refund policy.</p>

          <h2>7. Intellectual Property</h2>
          <p>All content on Kafek is owned by us and protected by copyright laws.</p>

          <h2>8. Limitation of Liability</h2>
          <p>Kafek is not liable for indirect, incidental, or consequential damages.</p>

          <h2>9. Modifications to Service</h2>
          <p>We reserve the right to modify or discontinue the service at any time.</p>

          <h2>10. Governing Law</h2>
          <p>These terms are governed by the laws of Saudi Arabia.</p>

          <h2>11. Contact Information</h2>
          <p>For questions about these terms, contact us at legal@kafek.com</p>
        `,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Terms & Conditions" />

      <main className="w-full">
        <section className="px-4 mt-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Loading...</p>
            </div>
          ) : content ? (
            <div className="content-card">
              <div className="content-header">
                <div className="content-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <h1 className="content-title">{content.page_title}</h1>
              </div>

              <div
                className="content-body"
                dangerouslySetInnerHTML={{ __html: content.page_content }}
              />
            </div>
          ) : (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <FileText className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">Terms & Conditions</p>
              <p className="empty-sub">Content will be available soon</p>
            </div>
          )}
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
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Content Card */
  .content-card { background: var(--surface); border-radius: var(--radius); padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .content-header { display: flex; align-items: center; gap: 14px; padding-bottom: 18px; border-bottom: 1.5px solid var(--border); margin-bottom: 20px; }
  .content-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(10,22,40,.06); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
  .content-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: var(--primary); }
  .content-body { font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; color: var(--muted); }
  .content-body h2 { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: var(--primary); margin: 24px 0 12px 0; }
  .content-body h2:first-child { margin-top: 0; }
  .content-body p { margin-bottom: 12px; }
  .content-body ul { margin: 12px 0 12px 20px; }
  .content-body li { margin-bottom: 8px; position: relative; }
  .content-body a { color: var(--accent); text-decoration: underline; }
  .content-body a:hover { color: var(--primary); }
`;
