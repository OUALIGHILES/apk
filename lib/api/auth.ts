import { apiService } from '../api';

// Types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  store_name: string;
  mobile: string;
  mobile_with_code: string;
  email: string;
  password?: string;
  country_id: string;
  country_name: string;
  state_id: string;
  state_name: string;
  city_id: string;
  city_name: string;
  image: string;
  type: 'USER' | 'PROVIDER' | 'DRIVER';
  social_id: string;
  lat: string;
  lon: string;
  address: string;
  address_id: string;
  gender: 'Male' | 'Female';
  wallet: string;
  register_id: string;
  ios_register_id: string;
  status: string;
  approve_status: string;
  available_status: string;
  code: string;
  date_time: string;
  store_logo: string;
  store_cover_image: string;
  about_store: string;
  token: string;
  avg_rating: number;
  total_rating_count: string;
  cat_id: string;
  cat_name: string;
  referral_code: string;
  provider_name: string;
  provider_email: string;
  provider_mobile: string;
  provider_lat: string;
  provider_lon: string;
  facebook_url: string;
  instagram_url: string;
  description: string;
  delivery_option: string;
  provider_logo: string;
  radius: string;
  open_time: string;
  close_time: string;
  store_ope_closs_status: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  result: T;
}

// Authentication APIs
export const authAPI = {
  // Login
  async login(email: string, password: string, type: string = 'USER') {
    return apiService.get<ApiResponse<User>>('login', { email, password, type });
  },

  // Signup
  async signup(userData: Partial<User> & { password: string }) {
    return apiService.get<ApiResponse<User>>('signup', {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      mobile: userData.mobile,
      mobile_with_code: userData.mobile_with_code || '',
      password: userData.password,
      register_id: userData.register_id || '',
      ios_register_id: userData.ios_register_id || '',
      type: userData.type || 'USER',
      address: userData.address || '',
      lat: userData.lat || '24.7136',
      lon: userData.lon || '46.6753',
      gender: userData.gender || 'Male',
    });
  },

  // Social Login
  async socialLogin(data: {
    social_id: string;
    first_name: string;
    last_name: string;
    email: string;
    image?: string;
    register_id: string;
    lat: string;
    lon: string;
    type?: string;
  }) {
    return apiService.get<ApiResponse<User>>('social_login', data);
  },

  // Forgot Password
  async forgotPassword(mobile: string, mobile_with_code: string, type: string = 'USER') {
    return apiService.get<ApiResponse<any>>('forgot_password', { mobile, mobile_with_code, type });
  },

  // Send OTP
  async sendOtp(mobile: string, code: string) {
    return apiService.get<ApiResponse<any>>('send_otp', { mobile, code });
  },

  // Verify OTP for password change
  async verifyOtpForPassword(mobile: string, code: string) {
    return apiService.get<ApiResponse<any>>('send_otp_for_change_password', { mobile, code });
  },

  // Change Password
  async changePassword(user_id: string, password: string, old_password?: string) {
    return apiService.get<ApiResponse<any>>('change_password', { user_id, password, old_password });
  },
};

// User Profile APIs
export const userAPI = {
  // Get Profile
  async getProfile(user_id: string) {
    return apiService.get<ApiResponse<User>>('get_profile', { user_id });
  },

  // Update Profile
  async updateProfile(formData: FormData) {
    return apiService.post<ApiResponse<User>>('update_profile', formData as any);
  },

  // Delete Account
  async deleteAccount(user_id: string) {
    return apiService.get<ApiResponse<any>>('delete_account', { user_id });
  },

  // Get User Addresses
  async getUserAddresses(user_id: string) {
    return apiService.post<ApiResponse<Address[]>>('get_user_address', { user_id });
  },

  // Add User Address
  async addUserAddress(data: {
    user_id: string;
    addresstype: string;
    address: string;
    lat: string;
    lon: string;
    timezone?: string;
  }) {
    return apiService.get<ApiResponse<Address>>('add_user_address', data);
  },

  // Update User Address
  async updateUserAddress(data: {
    address_id: string;
    addresstype?: string;
    address?: string;
    lat?: string;
    lon?: string;
  }) {
    return apiService.get<ApiResponse<Address>>('update_user_address', data);
  },

  // Delete User Address
  async deleteUserAddress(address_id: string) {
    return apiService.get<ApiResponse<any>>('delete_user_address', { address_id });
  },

  // Get Notifications
  async getNotifications(user_id: string) {
    return apiService.get<ApiResponse<Notification[]>>('get_notification_list', { user_id });
  },

  // Get User Notifications
  async getUserNotifications(user_id: string) {
    return apiService.get<ApiResponse<Notification[]>>('get_user_notification_list', { user_id });
  },
};

// Address Type
export interface Address {
  id: string;
  user_id: string;
  addresstype: string;
  address: string;
  lat: string;
  lon: string;
  status: string;
  date_time: string;
}

// Notification Type
export interface Notification {
  id: string;
  notification_type: string;
  request_id: string;
  user_id: string;
  other_user_id: string;
  title: string;
  title_ar: string;
  title_ur: string;
  message: string;
  message_ar: string;
  message_ur: string;
  user_name: string;
  date_time: string;
  type: string;
  user_type: string;
  is_read: boolean;
}

export default authAPI;
