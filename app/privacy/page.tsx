'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import { staticPagesAPI } from '@/lib/api/extended';
import { Shield, FileText, Scale } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [content, setContent] = useState<{
    page_title: string;
    page_content: string;
    page_title_ar?: string;
    page_content_ar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const data = await staticPagesAPI.getStaticPage('privacy');
      setContent(data);
    } catch (error) {
      console.error('Error loading privacy policy:', error);
      // Fallback content
      setContent({
        page_title: 'Privacy Policy',
        page_content: `
          <h2>1. Introduction</h2>
          <p>Welcome to Kafek. We respect your privacy and are committed to protecting your personal data.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Address and location data</li>
            <li>Payment information</li>
            <li>Order history</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your orders</li>
            <li>Communicate with you</li>
            <li>Improve our services</li>
            <li>Send promotional communications</li>
          </ul>
          
          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your data with:</p>
          <ul>
            <li>Service providers</li>
            <li>Payment processors</li>
            <li>Delivery partners</li>
          </ul>
          
          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information.</p>
          
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Object to processing</li>
          </ul>
          
          <h2>7. Contact Us</h2>
          <p>For any privacy-related questions, please contact us at privacy@kafek.com</p>
        `,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Privacy Policy" />

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
                <Shield className="w-6 h-6 text-primary" />
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
            <Shield className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Privacy Policy</h3>
            <p className="text-greyunselect">Content will be available soon</p>
          </Card>
        )}
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
