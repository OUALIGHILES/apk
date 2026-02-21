import { apiService } from '../api';

// Types
export interface UserAddress {
  id: string;
  user_id: string;
  address: string;
  lat: string;
  lon: string;
  building_no?: string;
  floor_no?: string;
  appartment_no?: string;
  is_default?: string;
  address_type?: 'home' | 'work' | 'other';
  street?: string;
  area?: string;
  city?: string;
  country?: string;
}

export interface AddressResponse {
  status: string;
  message: string;
  result: UserAddress | UserAddress[];
}

// User Addresses API
export const addressesAPI = {
  // Get all user addresses
  async getAddresses(userId: string): Promise<UserAddress[]> {
    const response = await apiService.get<AddressResponse>('get_user_address', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Add new address
  async addAddress(data: {
    user_id: string;
    address: string;
    lat: string;
    lon: string;
    building_no?: string;
    floor_no?: string;
    appartment_no?: string;
    address_type?: string;
  }): Promise<UserAddress> {
    const response = await apiService.get<AddressResponse>('add_user_address', data);
    return response.result as UserAddress;
  },

  // Update address
  async updateAddress(data: {
    id: string;
    address: string;
    lat: string;
    lon: string;
    building_no?: string;
    floor_no?: string;
    appartment_no?: string;
    address_type?: string;
  }): Promise<UserAddress> {
    const response = await apiService.get<AddressResponse>('update_user_address', data);
    return response.result as UserAddress;
  },

  // Delete address
  async deleteAddress(addressId: string): Promise<boolean> {
    const response = await apiService.get<AddressResponse>('delete_user_address', { id: addressId });
    return response.status === 'success';
  },

  // Set as default
  async setAsDefault(addressId: string): Promise<UserAddress> {
    const response = await apiService.get<AddressResponse>('update_user_address', {
      id: addressId,
      is_default: '1',
    });
    return response.result as UserAddress;
  },
};

// Orders API (extended)
export interface OrderDetails extends Order {
  order_details?: Array<{
    id: string;
    item_name: string;
    item_price: string;
    item_quantity: string;
    total_price: string;
  }>;
  driver_details?: {
    id: string;
    first_name: string;
    last_name: string;
    mobile: string;
    vehicle_type: string;
    vehicle_no: string;
    lat: string;
    lon: string;
  };
  payment_transactions?: Array<{
    id: string;
    amount: string;
    payment_method: string;
    payment_status: string;
    date_time: string;
  }>;
}

export interface Order {
  id: string;
  user_id: string;
  provider_id: string;
  total_amount: string;
  delivery_fee: string;
  payment_method: string;
  order_type: string;
  order_status: string;
  order_date: string;
  delivery_address: string;
  lat: string;
  lon: string;
  store_name?: string;
  provider_logo?: string;
}

export interface OrdersResponse {
  status: string;
  message: string;
  result: Order[] | OrderDetails;
}

export const ordersAPIExtended = {
  // Get order details
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    const response = await apiService.get<OrdersResponse>('get_order_details', { order_id: orderId });
    return response.result as OrderDetails;
  },

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<boolean> {
    const response = await apiService.get<OrdersResponse>('order_cancel_by_user_after_accept', {
      order_id: orderId,
      reason: reason,
    });
    return response.status === 'success';
  },

  // Update order status (for driver/provider)
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const response = await apiService.get<OrdersResponse>('change_order_status', {
      order_id: orderId,
      order_status: status,
    });
    return response.status === 'success';
  },
};

// Notifications API
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  image?: string;
  type: string;
  order_id?: string;
  is_read: string;
  date_time: string;
}

export interface NotificationsResponse {
  status: string;
  message: string;
  result: Notification[];
}

export const notificationsAPI = {
  // Get all notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const response = await apiService.get<NotificationsResponse>('get_notification_list', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Get user notification list
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const response = await apiService.get<NotificationsResponse>('get_user_notification_list', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Mark as read
  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await apiService.get<NotificationsResponse>('update_notification', {
      id: notificationId,
      is_read: '1',
    });
    return response.status === 'success';
  },

  // Mark all as read
  async markAllAsRead(userId: string): Promise<boolean> {
    const response = await apiService.get<NotificationsResponse>('update_all_notification', {
      user_id: userId,
      is_read: '1',
    });
    return response.status === 'success';
  },
};

// Wallet API
export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: string;
  transaction_type: 'credit' | 'debit';
  payment_method: string;
  order_id?: string;
  description: string;
  date_time: string;
}

export interface WalletResponse {
  status: string;
  message: string;
  result: {
    balance?: string;
    transactions?: WalletTransaction[];
  };
}

export const walletAPI = {
  // Get wallet balance and transactions
  async getWallet(userId: string): Promise<{ balance: string; transactions: WalletTransaction[] }> {
    const response = await apiService.get<WalletResponse>('get_transaction', { user_id: userId });
    return {
      balance: response.result.balance || '0.00',
      transactions: response.result.transactions || [],
    };
  },

  // Add wallet amount (top-up)
  async addWalletAmount(data: {
    user_id: string;
    amount: string;
    payment_method: string;
  }): Promise<boolean> {
    const response = await apiService.get<WalletResponse>('add_wallet_amount', data);
    return response.status === 'success';
  },

  // Get withdrawal requests
  async getWithdrawRequests(userId: string): Promise<any[]> {
    const response = await apiService.get<WalletResponse>('get_withdraw_request', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Add withdrawal request
  async addWithdrawRequest(data: {
    user_id: string;
    amount: string;
    bank_name: string;
    account_no: string;
    account_title: string;
    iban?: string;
  }): Promise<boolean> {
    const response = await apiService.get<WalletResponse>('add_withdraw_request', data);
    return response.status === 'success';
  },
};

// Reviews API
export interface Review {
  id: string;
  user_id: string;
  order_id: string;
  provider_id: string;
  rating: string;
  review: string;
  user_name?: string;
  user_image?: string;
  date_time: string;
}

export interface ReviewsResponse {
  status: string;
  message: string;
  result: Review[];
}

export const reviewsAPI = {
  // Add rating/review
  async addReview(data: {
    user_id: string;
    order_id: string;
    provider_id: string;
    rating: string;
    review: string;
  }): Promise<boolean> {
    const response = await apiService.get<ReviewsResponse>('add_rating_review_by_order', data);
    return response.status === 'success';
  },

  // Get user reviews
  async getUserReviews(userId: string): Promise<Review[]> {
    const response = await apiService.get<ReviewsResponse>('get_user_review_rating', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Get provider reviews
  async getProviderReviews(providerId: string): Promise<Review[]> {
    const response = await apiService.get<ReviewsResponse>('get_provider_review_rating', { provider_id: providerId });
    return Array.isArray(response.result) ? response.result : [];
  },
};

// Chat API
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  is_read: string;
  date_time: string;
  sender_name?: string;
  sender_image?: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  provider_id?: string;
  admin_id?: string;
  last_message: string;
  last_message_time: string;
  unread_count: string;
  user_name?: string;
  user_image?: string;
}

export interface ChatResponse {
  status: string;
  message: string;
  result: ChatMessage[] | ChatConversation[];
}

export const chatAPI = {
  // Get conversation list
  async getConversations(userId: string): Promise<ChatConversation[]> {
    const response = await apiService.get<ChatResponse>('get_conversation_list', { user_id: userId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Get conversation details
  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await apiService.get<ChatResponse>('get_conversation_detail', { 
      conversation_id: conversationId 
    });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Send message
  async sendMessage(data: {
    sender_id: string;
    receiver_id: string;
    message: string;
    message_type?: string;
  }): Promise<boolean> {
    const response = await apiService.get<ChatResponse>('send_feedback', data);
    return response.status === 'success';
  },
};

// Categories API (extended)
export interface SubCategory {
  id: string;
  cat_id: string;
  category_name: string;
  category_name_ar?: string;
  category_name_ur?: string;
  category_image: string;
  category_order: string;
}

export interface CategoryExtended {
  id: string;
  category_name: string;
  category_name_ar?: string;
  category_name_ur?: string;
  category_image: string;
  category_order: string;
  subcategories?: SubCategory[];
}

export interface CategoriesResponse {
  status: string;
  message: string;
  result: CategoryExtended[];
}

export const categoriesAPIExtended = {
  // Get all categories
  async getAllCategories(): Promise<CategoryExtended[]> {
    const response = await apiService.get<CategoriesResponse>('get_category');
    return Array.isArray(response.result) ? response.result : [];
  },

  // Get subcategories
  async getSubCategories(categoryId: string): Promise<SubCategory[]> {
    const response = await apiService.get<CategoriesResponse>('get_sub_category_list', { cat_id: categoryId });
    return Array.isArray(response.result) ? response.result : [];
  },
};

// Offers API
export interface Offer {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_order_amount: string;
  max_discount_amount?: string;
  offer_code?: string;
  valid_from: string;
  valid_until: string;
  provider_id?: string;
  store_name?: string;
  image?: string;
}

export interface OffersResponse {
  status: string;
  message: string;
  result: Offer[];
}

export const offersAPI = {
  // Get all offers
  async getOffers(): Promise<Offer[]> {
    const response = await apiService.get<OffersResponse>('get_offer');
    return Array.isArray(response.result) ? response.result : [];
  },

  // Get store-specific offers
  async getStoreOffers(providerId: string): Promise<Offer[]> {
    const response = await apiService.get<OffersResponse>('get_this_saloon_offer', { provider_id: providerId });
    return Array.isArray(response.result) ? response.result : [];
  },

  // Apply offer code
  async applyOfferCode(code: string, providerId: string, totalAmount: string): Promise<{
    success: boolean;
    discount: string;
    message: string;
  }> {
    const response = await apiService.get<OffersResponse>('apply_offer', {
      offer_code: code,
      provider_id: providerId,
      total_amount: totalAmount,
    });
    return {
      success: response.status === 'success',
      discount: response.result?.discount || '0',
      message: response.message,
    };
  },
};

// Static Pages API (Privacy, Terms, About, FAQ)
export interface StaticPage {
  id: string;
  page_type: string;
  page_title: string;
  page_content: string;
  page_title_ar?: string;
  page_content_ar?: string;
  page_title_ur?: string;
  page_content_ur?: string;
}

export interface StaticPageResponse {
  status: string;
  message: string;
  result: StaticPage;
}

export const staticPagesAPI = {
  // Get static page (Privacy, Terms, About)
  async getStaticPage(pageType: string): Promise<StaticPage> {
    const response = await apiService.get<StaticPageResponse>('get_user_page', { page_type: pageType });
    return response.result;
  },

  // Get FAQ
  async getFAQ(): Promise<Array<{
    id: string;
    question: string;
    answer: string;
    question_ar?: string;
    answer_ar?: string;
    question_ur?: string;
    answer_ur?: string;
  }>> {
    const response = await apiService.get<StaticPageResponse>('get_faq');
    return Array.isArray(response.result) ? response.result : [];
  },
};

// Payment API
export const paymentAPI = {
  // Verify payment tab
  async verifyPayment(data: {
    user_id: string;
    amount: string;
    payment_method: string;
    order_id?: string;
  }): Promise<{
    success: boolean;
    transaction_id: string;
    redirect_url?: string;
  }> {
    const response = await apiService.get<any>('verifyPaymentTab', data);
    return {
      success: response.status === 'success',
      transaction_id: response.result?.transaction_id,
      redirect_url: response.result?.redirect_url,
    };
  },

  // Add payment
  async addPayment(data: {
    user_id: string;
    amount: string;
    payment_method: string;
    transaction_id: string;
    order_id?: string;
  }): Promise<boolean> {
    const response = await apiService.get<any>('addPayment', data);
    return response.status === 'success';
  },
};

// Profile API (extended)
export const profileAPIExtended = {
  // Update profile with image
  async updateProfile(data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    gender?: string;
    image?: File;
  }): Promise<boolean> {
    // Note: This needs multipart/form-data for image upload
    // For now, using GET with other fields
    const response = await apiService.get<any>('update_profile', data);
    return response.status === 'success';
  },

  // Delete account
  async deleteAccount(userId: string, reason: string): Promise<boolean> {
    const response = await apiService.get<any>('delete_account', {
      user_id: userId,
      reason: reason,
    });
    return response.status === 'success';
  },
};
