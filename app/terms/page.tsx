'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
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
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Terms & Conditions" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {loading ? (
          <Card className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Loading...</p>
          </Card>
        ) : content ? (
          <Card>
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary">{content.page_title}</h1>
            </div>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content.page_content }}
            />
          </Card>
        ) : (
          <Card className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Terms & Conditions</h3>
            <p className="text-greyunselect">Content will be available soon</p>
          </Card>
        )}
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
