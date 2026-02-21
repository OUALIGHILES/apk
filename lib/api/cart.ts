import { apiService } from '../api';

// Types
export interface Cart {
  id: string;
  user_id: string;
  cat_id: string;
  provider_id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  quantity: string;
  size_id: string;
  size_name: string;
  size_price: string;
  extra_item_id: string;
  extra_item_name: string;
  extra_item_price: string;
  extra_item_qty: string;
  total_amount: string;
  total_extra_item_price: string;
  before_discount_amount: string;
  after_discount_amount: string;
  discount_amount: string;
  offer_id: string;
  status: string;
  offer_apply_status: string;
  date_time: string;
  unit_measurement: string;
  weight: string;
  type: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size_id?: string;
  size_name?: string;
  size_price?: number;
  extra_items?: CartExtra[];
  total_amount: number;
}

export interface CartExtra {
  extra_item_id: string;
  extra_item_name: string;
  extra_item_price: number;
  extra_item_qty: number;
}

export interface Order {
  id: string;
  order_id: string;
  order_type: 'delivery' | 'pickup' | 'service';
  user_id: string;
  provider_id: string;
  product_id: string;
  cart_id: string;
  cat_id: string;
  size_id: string;
  vehicle_id: string;
  address_id: string;
  address: string;
  lat: string;
  lon: string;
  total_amount: string;
  before_discount_amount: string;
  total_discount_amount: string;
  delivery_fee: string;
  delivery_date: string;
  delivery_time: string;
  date_time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  delivery_status: 'pending' | 'preparing' | 'on_way' | 'delivered';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: 'cash' | 'card' | 'wallet' | 'tap_payment';
  driver_id: string;
  accept_driver_id: string;
  remove_status: string;
  order_pin: string;
  offer_id: string;
  offer_code: string;
  price_type: 'fixed' | 'per_hour' | 'per_day' | 'per_month';
  rating_review_status: string;
  rating_review: string;
  date: string;
  time: string;
  cart_details?: CartDetail[];
  provider_details?: {
    id: string;
    store_name: string;
    provider_mobile: string;
  };
  product_details?: OrderProduct[];
}

export interface CartDetail {
  id: string;
  product_id: string;
  product_name: string;
  quantity: string;
  price: string;
  total_price: string;
}

export interface OrderProduct {
  id: string;
  product_name: string;
  quantity: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  result: T;
}

// Cart APIs
export const cartAPI = {
  // Get Cart
  async getCart(user_id: string, provider_id?: string, item_type?: string) {
    return apiService.get<ApiResponse<Cart[]>>('get_cart', { user_id, provider_id, item_type });
  },

  // Add to Cart
  async addToCart(params: {
    user_id: string;
    product_id: string;
    total_amount: string;
    quantity: string;
    size_id?: string;
    extra_item_id?: string;
  }) {
    return apiService.get<ApiResponse<Cart>>('add_to_cart_product', params);
  },

  // Update Cart
  async updateCart(params: {
    cart_id: string;
    type: 'increment' | 'decrement';
    quantity: string;
  }) {
    return apiService.get<ApiResponse<Cart>>('update_cart', params);
  },

  // Delete Cart Item
  async deleteCartItem(cart_id: string) {
    return apiService.get<ApiResponse<any>>('delete_cart_item', { cart_id });
  },
};

// Order APIs
export const ordersAPI = {
  // Place Order (Product)
  async placeOrder(params: {
    user_id: string;
    provider_id: string;
    product_id?: string;
    cart_id?: string;
    address_id: string;
    total_amount: string;
    delivery_fee: string;
    payment_method: string;
    order_type: 'delivery' | 'pickup';
    lat: string;
    lon: string;
    vehicle_id?: string;
    price_type?: string;
  }) {
    return apiService.get<ApiResponse<Order>>('place_order', params);
  },

  // Place Order (Service)
  async placeOrderService(params: {
    user_id: string;
    provider_id: string;
    address_id: string;
    total_amount: string;
    payment_method: string;
    lat: string;
    lon: string;
    vehicle_id?: string;
    price_type?: string;
    user_note?: string;
  }) {
    return apiService.get<ApiResponse<Order>>('place_order_for_service', params);
  },

  // Get User Orders by Status
  async getUserOrders(user_id: string, type: 'Current' | 'Past') {
    return apiService.get<ApiResponse<Order[]>>('get_user_order_by_status', { user_id, type });
  },

  // Get Order Details
  async getOrderDetails(user_id: string, order_id: string) {
    return apiService.get<ApiResponse<Order>>('get_order_details', { user_id, order_id });
  },

  // Change Order Status
  async changeOrderStatus(order_id: string, status: string, self_delivery_status?: string) {
    return apiService.get<ApiResponse<any>>('change_order_status', { order_id, status, self_delivery_status });
  },

  // Cancel Order
  async cancelOrder(order_request_id: string, cancel_reason: string) {
    return apiService.get<ApiResponse<any>>('order_cancel_by_user_after_accept', { order_request_id, cancel_reason });
  },

  // Update Payment Status
  async updatePaymentStatus(order_id: string, payment_status: string) {
    return apiService.get<ApiResponse<any>>('update_payment_status_user_side', { order_id, payment_status });
  },
};

export default cartAPI;
