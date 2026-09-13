export type UserRole = 'buyer' | 'seller' | 'moderator' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string; // Private! Never exposed in public endpoints
  email: string; // Private!
  password_hash: string;
  location_name: string;
  lat: number;
  lng: number;
  is_verified: boolean;
  avatar?: string;
  created_at: string;
}

export type PublicSellerProfile = {
  user_id: string;
  business_name: string;
  bio?: string;
  service_area: string;
  rating_aggregate: number;
  review_count: number;
  is_verified: boolean;
  location_name: string;
  lat: number;
  lng: number;
  distance_km?: number;
};

export interface SellerProfile {
  user_id: string;
  business_name: string;
  bio: string;
  service_area: string;
  rating_aggregate: number;
  review_count: number;
  subscription_status: 'active' | 'free_trial' | 'expired' | 'none';
  subscription_expires: string;
  bank_account_last4?: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_as: string;
  icon: string;
  image: string;
  active: boolean;
  item_count?: number;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  title_en: string;
  title_as: string;
  description_en: string;
  description_as: string;
  price: number;
  unit: string; // kg, bunch, piece, litre, dozen, basket
  quantity_available: number;
  location_name: string;
  lat: number;
  lng: number;
  is_fresh: boolean;
  harvest_time?: string;
  status: 'active' | 'out_of_stock' | 'unlisted' | 'flagged';
  images: string[];
  created_at: string;
  
  // Public-safe joined info
  seller_name?: string;
  seller_rating?: number;
  seller_verified?: boolean;
  seller_phone?: string; // ONLY returned if unlocked!
  distance_km?: number;
  category_name_en?: string;
  category_name_as?: string;
}

export type OrderStatus = 
  | 'REQUESTED' 
  | 'ACCEPTED' 
  | 'READY_FOR_PICKUP' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name?: string;
  buyer_phone?: string;
  seller_id: string;
  seller_name?: string;
  product_id: string;
  product_title?: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  unit: string;
  status: OrderStatus;
  delivery_type: 'pickup' | 'seller_delivery';
  notes?: string;
  pickup_location?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactUnlock {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  fee_amount: number;
  payment_status: 'paid' | 'waived' | 'free_tier';
  unlocked_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  product_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  target_type: 'product' | 'seller' | 'buyer' | 'message';
  target_id: string;
  target_title?: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title_en: string;
  title_as: string;
  message_en: string;
  message_as: string;
  type: 'order' | 'system' | 'security' | 'unlock';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: UserRole;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  result: 'SUCCESS' | 'DENIED' | 'ERROR';
  details?: string;
  ip_address: string;
  created_at: string;
}

export interface MarketplaceSettings {
  marketplace_radius_km: number;
  seller_monthly_subscription_fee: number;
  contact_unlock_fee: number;
  contact_unlock_fee_enabled: boolean;
  allow_auto_approval: boolean;
  platform_currency: string;
}
