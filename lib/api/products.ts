import { apiService } from '../api';

// Types
export interface Product {
  id: string;
  provider_id: string;
  cat_id: string;
  cat_name: string;
  item_name: string;
  item_name_ar: string;
  item_name_ur: string;
  item_price: string;
  offer_item_price: string;
  item_description: string;
  short_description: string;
  short_description_ar: string;
  short_description_ur: string;
  item_quantity: string;
  colour: string;
  brand: string;
  unit_measurement: string;
  weight: string;
  type: string;
  product_size: string;
  item_type: string;
  description: string;
  available_status: string;
  date_time: string;
  remove_status: string;
  avg_rating: number;
  total_rating_count: string;
  product_images?: ProductImage[];
  product_additional?: ProductAdditional[];
  product_size_price?: ProductSizePrice[];
  provider_details?: {
    id: string;
    store_name: string;
    provider_logo: string;
  };
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_order: number;
}

export interface ProductAdditional {
  id: string;
  product_id: string;
  additional_name: string;
  additional_price: string;
}

export interface ProductSizePrice {
  id: string;
  product_id: string;
  size_name: string;
  size_price: string;
}

export interface Category {
  id: string;
  category_name: string;
  category_name_ar: string;
  category_name_ur: string;
  image: string;
  status: string;
  category_added: string;
  date_time: string;
}

export interface Provider {
  id: string;
  store_name: string;
  provider_name: string;
  provider_email: string;
  provider_mobile: string;
  provider_logo: string;
  store_logo: string;
  store_cover_image: string;
  about_store: string;
  description: string;
  lat: string;
  lon: string;
  address: string;
  cat_id: string;
  cat_name: string;
  avg_rating: number;
  total_rating_count: string;
  radius: string;
  delivery_option: string;
  open_time: string;
  close_time: string;
  store_ope_closs_status: string;
  status: string;
  facebook_url: string;
  instagram_url: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  result: T;
}

// Products APIs
export const productsAPI = {
  // Get Product List with filters
  async getProductList(params: {
    cat_id?: string;
    provider_id?: string;
    lat?: string;
    lon?: string;
    diet_type_vegan?: string;
    day_name?: string;
    start_time?: string;
    end_time?: string;
    user_id?: string;
  }) {
    return apiService.get<ApiResponse<Product[]>>('get_product_list_by_filter', params);
  },

  // Get Product Details
  async getProductDetails(params: {
    user_id?: string;
    product_id: string;
    lat?: string;
    lon?: string;
  }) {
    return apiService.get<ApiResponse<Product>>('get_product_details', params);
  },

  // Get All Store List
  async getAllStoreList(params: {
    user_id?: string;
    token?: string;
    cat_id?: string;
    lat?: string;
    lon?: string;
    diet_type_vegan?: string;
    day_name?: string;
    start_time?: string;
    end_time?: string;
  }) {
    return apiService.get<ApiResponse<Provider[]>>('get_all_store_list', params);
  },

  // Get Provider Details
  async getProviderDetails(params: {
    provider_id?: string;
    user_id?: string;
  }) {
    return apiService.get<ApiResponse<Provider>>('get_provider_details', params);
  },

  // Like/Unlike Product
  async likeUnlikeProduct(user_id: string, product_id: string) {
    return apiService.get<ApiResponse<any>>('like_unlike_product', { user_id, product_id });
  },

  // Fav/Unfav Provider
  async favUnfavProvider(user_id: string, provider_id: string) {
    return apiService.get<ApiResponse<any>>('fav_unfav_provider', { user_id, provider_id });
  },

  // Get My Favorite Products
  async getMyFavoriteProducts(user_id: string) {
    return apiService.get<ApiResponse<Product[]>>('get_my_fav_product', { user_id });
  },

  // Get My Favorite Providers
  async getMyFavoriteProviders(user_id: string) {
    return apiService.get<ApiResponse<Provider[]>>('get_my_fav_provider', { user_id });
  },
};

// Categories APIs
export const categoriesAPI = {
  // Get all categories would be part of product list or a separate endpoint
  async getCategories() {
    // This might need to be adjusted based on actual API
    return apiService.get<ApiResponse<Category[]>>('get_product_list_by_filter', {});
  },
};

export default productsAPI;
