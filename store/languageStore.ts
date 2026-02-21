import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar' | 'ur';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<string, string>>;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Logout',
    'email': 'Email',
    'password': 'Password',
    'forgot_password': 'Forgot Password?',
    'or': 'OR',
    'continue_with_google': 'Continue with Google',
    'continue_with_facebook': 'Continue with Facebook',
    'dont_have_account': "Don't have an account?",
    'already_have_account': 'Already have an account?',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'mobile': 'Mobile Number',
    'confirm_password': 'Confirm Password',
    'sign_up_now': 'Sign Up Now',
    
    // Home
    'home': 'Home',
    'categories': 'Categories',
    'stores': 'Stores',
    'products': 'Products',
    'search': 'Search',
    'view_all': 'View All',
    
    // Cart
    'cart': 'Cart',
    'add_to_cart': 'Add to Cart',
    'your_cart': 'Your Cart',
    'total': 'Total',
    'checkout': 'Checkout',
    'empty_cart': 'Your cart is empty',
    
    // Orders
    'orders': 'Orders',
    'my_orders': 'My Orders',
    'current_orders': 'Current Orders',
    'past_orders': 'Past Orders',
    'order_details': 'Order Details',
    'order_id': 'Order ID',
    'order_status': 'Status',
    'order_date': 'Order Date',
    'order_time': 'Order Time',
    'delivery_address': 'Delivery Address',
    'payment_method': 'Payment Method',
    'place_order': 'Place Order',
    
    // Profile
    'profile': 'Profile',
    'my_profile': 'My Profile',
    'edit_profile': 'Edit Profile',
    'settings': 'Settings',
    'language': 'Language',
    'notifications': 'Notifications',
    'addresses': 'Addresses',
    'add_address': 'Add Address',
    'wallet': 'Wallet',
    'balance': 'Balance',
    
    // Products
    'product_details': 'Product Details',
    'price': 'Price',
    'quantity': 'Quantity',
    'size': 'Size',
    'extras': 'Extras',
    'description': 'Description',
    'available': 'Available',
    'unavailable': 'Unavailable',
    
    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'back': 'Back',
    'next': 'Next',
    'submit': 'Submit',
    'close': 'Close',
    'yes': 'Yes',
    'no': 'No',
  },
  ar: {
    // Auth
    'login': 'تسجيل الدخول',
    'signup': 'إنشاء حساب',
    'logout': 'تسجيل الخروج',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'forgot_password': 'نسيت كلمة المرور؟',
    'or': 'أو',
    'continue_with_google': 'المتابعة باستخدام Google',
    'continue_with_facebook': 'المتابعة باستخدام Facebook',
    'dont_have_account': 'ليس لديك حساب؟',
    'already_have_account': 'لديك حساب بالفعل؟',
    'first_name': 'الاسم الأول',
    'last_name': 'اسم العائلة',
    'mobile': 'رقم الجوال',
    'confirm_password': 'تأكيد كلمة المرور',
    'sign_up_now': 'سجل الآن',
    
    // Home
    'home': 'الرئيسية',
    'categories': 'التصنيفات',
    'stores': 'المتاجر',
    'products': 'المنتجات',
    'search': 'بحث',
    'view_all': 'عرض الكل',
    
    // Cart
    'cart': 'السلة',
    'add_to_cart': 'أضف إلى السلة',
    'your_cart': 'سلة التسوق',
    'total': 'المجموع',
    'checkout': 'الدفع',
    'empty_cart': 'سلتك فارغة',
    
    // Orders
    'orders': 'الطلبات',
    'my_orders': 'طلباتي',
    'current_orders': 'الطلبات الحالية',
    'past_orders': 'الطلبات السابقة',
    'order_details': 'تفاصيل الطلب',
    'order_id': 'رقم الطلب',
    'order_status': 'حالة الطلب',
    'order_date': 'تاريخ الطلب',
    'order_time': 'وقت الطلب',
    'delivery_address': 'عنوان التوصيل',
    'payment_method': 'طريقة الدفع',
    'place_order': 'تأكيد الطلب',
    
    // Profile
    'profile': 'الملف الشخصي',
    'my_profile': 'ملفي الشخصي',
    'edit_profile': 'تعديل الملف الشخصي',
    'settings': 'الإعدادات',
    'language': 'اللغة',
    'notifications': 'الإشعارات',
    'addresses': 'العناوين',
    'add_address': 'إضافة عنوان',
    'wallet': 'المحفظة',
    'balance': 'الرصيد',
    
    // Products
    'product_details': 'تفاصيل المنتج',
    'price': 'السعر',
    'quantity': 'الكمية',
    'size': 'الحجم',
    'extras': 'إضافات',
    'description': 'الوصف',
    'available': 'متاح',
    'unavailable': 'غير متاح',
    
    // Common
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'success': 'نجاح',
    'cancel': 'إلغاء',
    'confirm': 'تأكيد',
    'save': 'حفظ',
    'delete': 'حذف',
    'edit': 'تعديل',
    'back': 'رجوع',
    'next': 'التالي',
    'submit': 'إرسال',
    'close': 'إغلاق',
    'yes': 'نعم',
    'no': 'لا',
  },
  ur: {
    // Auth
    'login': 'لاگ ان کریں',
    'signup': 'سائن اپ کریں',
    'logout': 'لاگ آؤٹ',
    'email': 'ای میل',
    'password': 'پاس ورڈ',
    'forgot_password': 'پاس ورڈ بھول گئے؟',
    'or': 'یا',
    'continue_with_google': 'گوگل کے ساتھ جاری رکھیں',
    'continue_with_facebook': 'فیس بک کے ساتھ جاری رکھیں',
    'dont_have_account': 'اکاؤنٹ نہیں ہے؟',
    'already_have_account': 'پہلے سے اکاؤنٹ ہے؟',
    'first_name': 'پہلا نام',
    'last_name': 'آخری نام',
    'mobile': 'موبائل نمبر',
    'confirm_password': 'پاس ورڈ کی تصدیق کریں',
    'sign_up_now': 'ابھی سائن اپ کریں',
    
    // Home
    'home': 'ہوم',
    'categories': 'زمرہ جات',
    'stores': 'دکانیں',
    'products': 'مصنوعات',
    'search': 'تلاش کریں',
    'view_all': 'سب دیکھیں',
    
    // Cart
    'cart': 'ٹوکری',
    'add_to_cart': 'ٹوکری میں شامل کریں',
    'your_cart': 'آپ کی ٹوکری',
    'total': 'کل',
    'checkout': 'چیک آؤٹ',
    'empty_cart': 'آپ کی ٹوکری خالی ہے',
    
    // Orders
    'orders': 'آرڈرز',
    'my_orders': 'میرے آرڈرز',
    'current_orders': 'موجودہ آرڈرز',
    'past_orders': 'گزشتہ آرڈرز',
    'order_details': 'آرڈر کی تفصیلات',
    'order_id': 'آرڈر آئی ڈی',
    'order_status': 'حیثیت',
    'order_date': 'آرڈر کی تاریخ',
    'order_time': 'آرڈر کا وقت',
    'delivery_address': 'ڈیلیوری کا پتہ',
    'payment_method': 'ادائیگی کا طریقہ',
    'place_order': 'آرڈر کریں',
    
    // Profile
    'profile': 'پروفائل',
    'my_profile': 'میری پروفائل',
    'edit_profile': 'پروفائل میں ترمیم کریں',
    'settings': 'ترتیبات',
    'language': 'زبان',
    'notifications': 'اطلاعات',
    'addresses': 'پتے',
    'add_address': 'پتہ شامل کریں',
    'wallet': 'والیٹ',
    'balance': 'بیلنس',
    
    // Products
    'product_details': 'مصنوع کی تفصیلات',
    'price': 'قیمت',
    'quantity': 'مقدار',
    'size': 'سائز',
    'extras': 'اضافی',
    'description': 'تفصیل',
    'available': 'دستیاب',
    'unavailable': 'غیر دستیاب',
    
    // Common
    'loading': 'لوڈ ہو رہا ہے...',
    'error': 'غلطی',
    'success': 'کامیابی',
    'cancel': 'منسوخ کریں',
    'confirm': 'تصدیق کریں',
    'save': 'محفوظ کریں',
    'delete': 'حذف کریں',
    'edit': 'ترمیم',
    'back': 'واپس',
    'next': 'اگلا',
    'submit': 'جمع کرائیں',
    'close': 'بند کریں',
    'yes': 'ہاں',
    'no': 'نہیں',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => {
        // Update document direction for RTL support
        if (typeof window !== 'undefined') {
          if (language === 'ar' || language === 'ur') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = language;
          } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = language;
          }
        }
        
        set({ 
          language,
          translations: translations[language] || translations.en
        });
      },
      translations: translations.en,
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

// Helper function to get translation
export const t = (key: string, language?: Language): string => {
  const lang = language || useLanguageStore.getState().language;
  return translations[lang]?.[key] || translations.en[key] || key;
};

export default useLanguageStore;
