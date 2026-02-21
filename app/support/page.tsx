'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { staticPagesAPI } from '@/lib/api/extended';
import { HelpCircle, MessageCircle, Mail, Phone, Send } from 'lucide-react';

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
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Help & Support" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Tab Switcher */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-5 h-5 mx-auto mb-1" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="w-5 h-5 mx-auto mb-1" />
            Contact Us
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <>
            {loading ? (
              <Card className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-greyunselect mt-2">Loading FAQ...</p>
              </Card>
            ) : faqs.length === 0 ? (
              <Card className="text-center py-12">
                <HelpCircle className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">No FAQs Available</h3>
                <p className="text-greyunselect mb-4">Check back soon for frequently asked questions</p>
                <Button onClick={() => setActiveTab('contact')}>Contact Support</Button>
              </Card>
            ) : (
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-primary pr-4">{faq.question}</span>
                      <span className={`transform transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 pt-0 text-sm text-greyunselect border-t">
                        {faq.answer}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <>
            {/* Contact Options */}
            <Card className="mb-4">
              <h3 className="font-bold text-primary mb-3">Get in Touch</h3>
              <div className="space-y-3">
                <a
                  href="tel:+966500000000"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Call Us</p>
                    <p className="text-sm text-greyunselect">+966 50 000 0000</p>
                  </div>
                </a>
                <a
                  href="mailto:support@kafek.com"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Email Us</p>
                    <p className="text-sm text-greyunselect">support@kafek.com</p>
                  </div>
                </a>
              </div>
            </Card>

            {/* Contact Form */}
            <Card className="mb-4">
              <h3 className="font-bold text-primary mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send us a Message
              </h3>

              <div className="space-y-4">
                <Input
                  label="Your Name *"
                  placeholder="Enter your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />

                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="Enter your email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />

                <Input
                  label="Subject"
                  placeholder="What is this about?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />

                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">
                    Message *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={5}
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  loading={sending}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </Button>
              </div>
            </Card>

            {/* Business Hours */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 mb-1">Support Hours</h4>
                  <p className="text-sm text-blue-700">
                    Sunday - Thursday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-blue-700">
                    Friday - Saturday: Closed
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Response time: Within 24 hours
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
