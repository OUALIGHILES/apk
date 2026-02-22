import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for mock orders (persists during server runtime)
let mockOrders: any[] = [];

// Mock data for testing when backend is down
const mockProducts = {
  status: 'success',
  message: 'Products retrieved successfully',
  result: [
    {
      id: '1',
      provider_id: '1',
      cat_id: '1',
      cat_name: 'Restaurant',
      item_name: 'Chicken Burger',
      item_name_ar: 'برجر دجاج',
      item_price: '25.00',
      offer_item_price: '20.00',
      item_description: 'Delicious chicken burger with cheese',
      short_description: 'Tasty burger',
      item_quantity: '100',
      available_status: 'available',
      avg_rating: 4,
      total_rating_count: '50',
      product_images: [
        {
          id: '1',
          product_id: '1',
          image_url: 'https://kaffak.company/kaffak/uploads/images/burger.jpg',
          image_order: 1,
        },
      ],
      provider_details: {
        id: '1',
        store_name: 'Test Restaurant',
        provider_logo: 'logo.jpg',
      },
    },
    {
      id: '2',
      provider_id: '1',
      cat_id: '1',
      cat_name: 'Restaurant',
      item_name: 'Pizza Margherita',
      item_price: '35.00',
      offer_item_price: '30.00',
      item_description: 'Classic pizza with tomato and mozzarella',
      short_description: 'Classic pizza',
      item_quantity: '50',
      available_status: 'available',
      avg_rating: 5,
      total_rating_count: '30',
      product_images: [
        {
          id: '2',
          product_id: '2',
          image_url: 'https://kaffak.company/kaffak/uploads/images/pizza.jpg',
          image_order: 1,
        },
      ],
      provider_details: {
        id: '1',
        store_name: 'Test Restaurant',
        provider_logo: 'logo.jpg',
      },
    },
  ],
};

const mockStores = {
  status: 'success',
  message: 'Stores retrieved successfully',
  result: [
    {
      id: '1',
      store_name: 'Test Restaurant',
      provider_name: 'Test Provider',
      provider_logo: 'logo.jpg',
      store_cover_image: 'cover.jpg',
      about_store: 'Best restaurant in town',
      description: 'We serve the best food',
      lat: '24.7136',
      lon: '46.6753',
      cat_id: '1',
      cat_name: 'Restaurant',
      avg_rating: 4,
      total_rating_count: '100',
      radius: '5',
      delivery_option: 'both',
      open_time: '09:00',
      close_time: '23:00',
      store_ope_closs_status: 'open',
      status: 'active',
    },
  ],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Get endpoint from query params (when called via axios with params)
  let endpoint = searchParams.get('endpoint') || '';
  
  // Also check if endpoint is in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameParts = pathname.split('/');
  const lastPart = pathnameParts[pathnameParts.length - 1];
  
  // If pathname has endpoint (like /api/mock/get_product_list_by_filter)
  if (lastPart && lastPart !== 'mock') {
    endpoint = lastPart;
  }
  
  // Remove trailing slashes
  endpoint = endpoint.replace(/\/$/, '');
  
  console.log('🟡 Mock API - Endpoint:', endpoint || 'default');
  
  // Return mock data based on endpoint
  switch (endpoint) {
    case 'get_product_list_by_filter':
      return NextResponse.json(mockProducts);
    
    case 'get_all_store_list':
      return NextResponse.json(mockStores);
    
    case 'get_product_details':
      return NextResponse.json({
        status: 'success',
        message: 'Product details retrieved',
        result: mockProducts.result[0],
      });
    
    case 'login':
      return NextResponse.json({
        status: 'success',
        message: 'Login successful (mock)',
        result: {
          id: '1',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@test.com',
          mobile: '0501234567',
          type: 'USER',
          token: 'mock_token_12345',
          wallet: '100.00',
        },
      });
    
    case 'signup':
      return NextResponse.json({
        status: 'success',
        message: 'Signup successful (mock)',
        result: {
          id: '2',
          first_name: searchParams.get('first_name') || 'New',
          last_name: searchParams.get('last_name') || 'User',
          email: searchParams.get('email') || 'new@test.com',
          mobile: searchParams.get('mobile') || '0501234568',
          type: 'USER',
          token: 'mock_token_67890',
          wallet: '0.00',
        },
      });
    
    case 'get_cart':
    case 'get_notification_list':
    case 'get_profile':
      return NextResponse.json({
        status: 'success',
        message: 'Mock data retrieved',
        result: [],
      });

    case 'place_order':
      // Mock placing an order - generate a random order ID
      const orderId = 'ORD-' + Math.floor(Math.random() * 100000);
      const userId = searchParams.get('user_id') || '1';
      const providerId = searchParams.get('provider_id') || '1';
      const totalAmount = searchParams.get('total_amount') || '0';
      const paymentMethod = searchParams.get('payment_method') || 'cash';
      const orderType = searchParams.get('order_type') || 'delivery';
      const lat = searchParams.get('lat') || '24.7136';
      const lon = searchParams.get('lon') || '46.6753';
      
      const mockOrder = {
        id: Date.now().toString(),
        user_id: userId,
        provider_id: providerId,
        total_amount: totalAmount,
        delivery_fee: searchParams.get('delivery_fee') || '10',
        payment_method: paymentMethod,
        order_type: orderType,
        order_status: 'pending',
        order_date: new Date().toISOString(),
        delivery_address: 'Mock Address, Riyadh',
        lat: lat,
        lon: lon,
        store_name: 'Test Restaurant',
        provider_logo: 'logo.jpg',
        // Extended details for order details page
        order_details: [{
          id: '1',
          item_name: 'Mock Product',
          item_price: totalAmount,
          item_quantity: '1',
          total_price: totalAmount,
        }],
        driver_details: null,
        payment_transactions: [],
      };

      // Store the order in memory
      mockOrders.push(mockOrder);

      return NextResponse.json({
        status: 'success',
        message: 'Order placed successfully',
        result: mockOrder,
      });

    case 'get_user_order_by_status':
      // Return orders based on user_id and type (Current/Past)
      const orderUserId = searchParams.get('user_id') || '1';
      const orderTypeFilter = searchParams.get('type') || 'Current';
      
      const userOrders = mockOrders.filter(o => o.user_id === orderUserId);
      const filteredOrders = orderTypeFilter === 'Current' 
        ? userOrders.filter(o => ['pending', 'accepted', 'preparing', 'on_way'].includes(o.order_status))
        : userOrders.filter(o => ['completed', 'delivered', 'cancelled', 'rejected'].includes(o.order_status));
      
      // Format orders for the orders list page (include both status and order_status for compatibility)
      const formattedOrders = filteredOrders.map(o => ({
        ...o,
        order_id: o.id,
        date: new Date(o.order_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date(o.order_date).toTimeString().split(' ')[0].slice(0, 5),
        status: o.order_status,  // Alias for orders page
        address: o.delivery_address,
      }));
      
      return NextResponse.json({
        status: 'success',
        message: 'Orders retrieved successfully',
        result: formattedOrders,
      });
    
    default:
      // For any other endpoint, return empty success
      return NextResponse.json({
        status: 'success',
        message: 'Mock API - Endpoint: ' + (endpoint || 'unknown'),
        result: [],
      });
  }
}

export async function POST(request: NextRequest) {
  // For POST requests, also return mock data
  console.log('🟡 Mock API - POST request');
  return NextResponse.json({
    status: 'success',
    message: 'Mock POST successful',
    result: {},
  });
}
