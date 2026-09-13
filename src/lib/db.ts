import fs from 'fs';
import path from 'path';
import { 
  User, 
  SellerProfile, 
  Category, 
  Product, 
  Order, 
  ContactUnlock, 
  Review, 
  Report, 
  Notification, 
  AuditLog, 
  MarketplaceSettings 
} from '@/types';

interface DatabaseData {
  users: User[];
  seller_profiles: SellerProfile[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  contact_unlocks: ContactUnlock[];
  reviews: Review[];
  reports: Report[];
  notifications: Notification[];
  audit_logs: AuditLog[];
  settings: MarketplaceSettings;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'thaluwa_database.json');

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_eggs', name_en: 'Eggs (Duck / Local)', name_as: 'কণী (হাঁহ/কুকুৰা)', icon: '🥚', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_fish', name_en: 'River & Wetland Fish', name_as: 'নদী/বিলৰ মাছ', icon: '🐟', image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_vegetables', name_en: 'Fresh Vegetables', name_as: 'শাক-পাচলি', icon: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_milk', name_en: 'Milk & Dairy', name_as: 'গাখীৰ আৰু দুগ্ধজাত', icon: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_rice', name_en: 'Paddy & Joha Rice', name_as: 'ধান আৰু জহা চাউল', icon: '🌾', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_poultry', name_en: 'Country Chicken & Duck', name_as: 'স্থানীয় হাঁহ-কুকুৰা', icon: '🦆', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_bamboo', name_en: 'Bamboo & Cane Crafts', name_as: 'বাঁহ-বেতৰ সামগ্ৰী', icon: '🎋', image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_homemade', name_en: 'Homemade Food & Pitha', name_as: 'ঘৰুৱা খাদ্য আৰু পিঠা', icon: '🍯', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', active: true },
  { id: 'cat_plants', name_en: 'Plants & Assam Nursery', name_as: 'গছপুলি আৰু নাৰ্চাৰী', icon: '🌱', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', active: true },
];

const INITIAL_USERS: User[] = [
  {
    id: 'user_buyer_1',
    role: 'buyer',
    name: 'Anupam Das',
    phone: '+91 98640 12345',
    email: 'anupam@example.com',
    password_hash: 'demo_hash_buyer',
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1285,
    lng: 91.7925,
    is_verified: true,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'user_seller_1',
    role: 'seller',
    name: 'Ramen Borah',
    phone: '+91 94350 98765',
    email: 'ramen@example.com',
    password_hash: 'demo_hash_seller',
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1290,
    lng: 91.7940,
    is_verified: true,
    created_at: '2026-08-02T09:00:00Z',
  },
  {
    id: 'user_seller_2',
    role: 'seller',
    name: 'Bonti Saikia',
    phone: '+91 98540 55432',
    email: 'bonti@example.com',
    password_hash: 'demo_hash_seller2',
    location_name: 'Guwahati - Uzanbazar (Fish Market)',
    lat: 26.1912,
    lng: 91.7618,
    is_verified: true,
    created_at: '2026-08-03T10:00:00Z',
  },
  {
    id: 'user_seller_3',
    role: 'seller',
    name: 'Pranab Kalita',
    phone: '+91 97060 11223',
    email: 'pranab@example.com',
    password_hash: 'demo_hash_seller3',
    location_name: 'Guwahati - Dispur / Super Market',
    lat: 26.1424,
    lng: 91.7898,
    is_verified: true,
    created_at: '2026-08-04T11:00:00Z',
  },
  {
    id: 'user_seller_4',
    role: 'seller',
    name: 'Hemanta Deka',
    phone: '+91 94351 77889',
    email: 'hemanta@example.com',
    password_hash: 'demo_hash_seller4',
    location_name: 'Guwahati - Maligaon / Jalukbari',
    lat: 26.1558,
    lng: 91.6895,
    is_verified: true,
    created_at: '2026-08-05T07:30:00Z',
  },
  {
    id: 'user_mod_1',
    role: 'moderator',
    name: 'Priyanka Baruah',
    phone: '+91 98642 99001',
    email: 'mod@thaluwabazar.com',
    password_hash: 'demo_hash_mod',
    location_name: 'Guwahati - Panbazar / Fancy Bazar',
    lat: 26.1856,
    lng: 91.7454,
    is_verified: true,
    created_at: '2026-07-15T12:00:00Z',
  },
  {
    id: 'user_admin_1',
    role: 'admin',
    name: 'Thaluwa Admin (Superuser)',
    phone: '+91 99540 00000',
    email: 'admin@thaluwabazar.com',
    password_hash: 'demo_hash_admin',
    location_name: 'Guwahati - Dispur / Super Market',
    lat: 26.1424,
    lng: 91.7898,
    is_verified: true,
    created_at: '2026-07-01T00:00:00Z',
  }
];

const INITIAL_SELLER_PROFILES: SellerProfile[] = [
  {
    user_id: 'user_seller_1',
    business_name: 'Borah Organic Agro Farm',
    bio: 'Fresh organic vegetables, indigenous Assam duck eggs, country rooster, and pure aromatic Kola Joha rice harvested from our family farm.',
    service_area: 'Beltola, Six Mile, Dispur, Khanapara (5 km radius)',
    rating_aggregate: 4.9,
    review_count: 28,
    subscription_status: 'active',
    subscription_expires: '2026-12-31T23:59:59Z',
  },
  {
    user_id: 'user_seller_2',
    business_name: 'Brahmaputra Fresh Catch & Fisheries',
    bio: 'Fresh morning catch from Brahmaputra and Uzanbazar river ghats. Cleaned and weighed right before hand-off.',
    service_area: 'Uzanbazar, Silpukhuri, Chandmari, Panbazar',
    rating_aggregate: 4.8,
    review_count: 42,
    subscription_status: 'active',
    subscription_expires: '2026-12-31T23:59:59Z',
  },
  {
    user_id: 'user_seller_3',
    business_name: 'Kalita Traditional Dairy & Bamboo Crafts',
    bio: 'Pure raw Desi cow milk, curd (doi), and authentic handcrafted Assamese Japi, Khorahi, and cane baskets made by rural artisans.',
    service_area: 'Dispur, Ganeshguri, Rukminigaon',
    rating_aggregate: 4.7,
    review_count: 19,
    subscription_status: 'active',
    subscription_expires: '2026-12-31T23:59:59Z',
  },
  {
    user_id: 'user_seller_4',
    business_name: 'Kamakhya Foothills Agri Nursery',
    bio: 'Authentic Assam Kaji Nemu (GI tagged lemon), fiery organic Bhut Jolokia, and healthy fruit saplings.',
    service_area: 'Maligaon, Jalukbari, Pandu, Bharalumukh',
    rating_aggregate: 5.0,
    review_count: 15,
    subscription_status: 'active',
    subscription_expires: '2026-12-31T23:59:59Z',
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    seller_id: 'user_seller_1',
    category_id: 'cat_eggs',
    title_en: 'Fresh Free-Range Assam Duck Eggs (হাঁহৰ কণী)',
    title_as: 'সতেজ থলুৱা হাঁহৰ কণী (১২ টাৰ পেকেট)',
    description_en: 'Freshly collected free-range pond duck eggs. Rich yolk, zero antibiotics, collected this morning from Beltola farm.',
    description_as: 'আজি পুৱাই সংগ্ৰহ কৰা সতেজ থলুৱা হাঁহৰ কণী। পানী-খোৱা হাঁহৰ পুষ্টিকৰ কণী, কোনো ৰাসায়নিক মিশ্ৰণ নাই।',
    price: 130,
    unit: 'dozen (১২ টা)',
    quantity_available: 24,
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1290,
    lng: 91.7940,
    is_fresh: true,
    harvest_time: 'Today 6:30 AM',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-13T06:30:00Z',
  },
  {
    id: 'prod_2',
    seller_id: 'user_seller_2',
    category_id: 'cat_fish',
    title_en: 'Live Brahmaputra Rohu / Rou Fish (সতেজ ৰৌ মাছ)',
    title_as: 'ব্ৰহ্মপুত্ৰৰ সতেজ জীয়া ৰৌ মাছ (প্ৰতি কেজি)',
    description_en: 'Caught early morning from Brahmaputra river. Fresh, sweet water taste, sliced to your preference upon pickup.',
    description_as: 'আজি ৰাতিপুৱা ব্ৰহ্মপুত্ৰৰ পৰা ধৰা মিঠা পানীৰ খাঁটি ৰৌ মাছ। ওজন অনুসৰি কাটি দিয়াৰ সুবিধা।',
    price: 340,
    unit: 'kg',
    quantity_available: 15,
    location_name: 'Guwahati - Uzanbazar (Fish Market)',
    lat: 26.1912,
    lng: 91.7618,
    is_fresh: true,
    harvest_time: 'Today 5:00 AM',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-13T05:45:00Z',
  },
  {
    id: 'prod_3',
    seller_id: 'user_seller_1',
    category_id: 'cat_rice',
    title_en: 'Aromatic Assam Kola Joha Rice (ক’লা জহা চাউল)',
    title_as: 'সুগন্ধি খাঁটি অসমীয়া ক’লা জহা চাউল (৫ কেজি বেগ)',
    description_en: 'Premium aromatic indigenous Joha rice from local paddy fields. Ideal for special feasts, payash, and daily aroma.',
    description_as: 'ঘৰুৱা পথাৰৰ সুগন্ধি ক’লা জহা চাউল। পায়স আৰু বিশেষ ভোজৰ বাবে অতি উত্তম।',
    price: 450,
    unit: '5 kg bag',
    quantity_available: 30,
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1290,
    lng: 91.7940,
    is_fresh: true,
    harvest_time: 'This season harvest',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-12T10:00:00Z',
  },
  {
    id: 'prod_4',
    seller_id: 'user_seller_3',
    category_id: 'cat_milk',
    title_en: 'Pure Desi Cow Milk (খাঁটি গৰুৰ গাখীৰ)',
    title_as: 'প্ৰাকৃতিক খাঁটি দেশী গৰুৰ কেঁচা গাখীৰ (প্ৰতি লিটাৰ)',
    description_en: 'Unadulterated full-cream raw cow milk delivered in glass bottles or milk containers.',
    description_as: 'কোনো পানী বা ভেজাল নথকা পুষ্টিকৰ খাঁটি গাখীৰ। পুৱা আৰু গধূলি সময়মতে যোগান।',
    price: 70,
    unit: 'litre',
    quantity_available: 40,
    location_name: 'Guwahati - Dispur / Super Market',
    lat: 26.1424,
    lng: 91.7898,
    is_fresh: true,
    harvest_time: 'Today 6:00 AM',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-13T06:00:00Z',
  },
  {
    id: 'prod_5',
    seller_id: 'user_seller_4',
    category_id: 'cat_vegetables',
    title_en: 'Fresh Assam Kaji Nemu & Bhut Jolokia (কাজী নেমু আৰু ভোট জলকীয়া)',
    title_as: 'সতেজ সুগন্ধি অসমীয়া কাজী নেমু (১০ টা) + ভোট জলকীয়া',
    description_en: 'Directly plucked juicy Assam Kaji Nemu with intense aroma + fresh homegrown Bhut Jolokia chillies.',
    description_as: 'বাৰীৰ পৰা চিঙা ৰসাল কাজী নেমু আৰু জ্বলা ভোট জলকীয়া। অসমীয়া সাজৰ বাবে অপৰিহাৰ্য।',
    price: 80,
    unit: 'pack (১০ টা নেমু + জলকীয়া)',
    quantity_available: 50,
    location_name: 'Guwahati - Maligaon / Jalukbari',
    lat: 26.1558,
    lng: 91.6895,
    is_fresh: true,
    harvest_time: 'Today 7:00 AM',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-13T07:00:00Z',
  },
  {
    id: 'prod_6',
    seller_id: 'user_seller_3',
    category_id: 'cat_bamboo',
    title_en: 'Handcrafted Assam Japi & Bamboo Khorahi (বাঁহৰ জাপি আৰু খৰাহী)',
    title_as: 'হস্তশিল্পৰ নিপুণ অসমীয়া বাঁহৰ সৰুদৈয়া জাপি আৰু খৰাহী',
    description_en: 'Traditional bamboo weave craft handmade by rural master artisans. Durable and authentic heritage item.',
    description_as: 'গাঁৱৰ নিপুণ শিল্পীয়ে তৈয়াৰ কৰা মজবুত বাঁহৰ ফুলাম জাপি আৰু পাচলি ৰখা খৰাহী।',
    price: 320,
    unit: 'piece',
    quantity_available: 12,
    location_name: 'Guwahati - Dispur / Super Market',
    lat: 26.1424,
    lng: 91.7898,
    is_fresh: false,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-09-10T14:00:00Z',
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    buyer_id: 'user_buyer_1',
    seller_id: 'user_seller_1',
    product_id: 'prod_1',
    unit_price: 130,
    quantity: 2,
    total_price: 260,
    unit: 'dozen (১২ টা)',
    status: 'ACCEPTED',
    delivery_type: 'pickup',
    notes: 'Will pick up at Beltola Bazar counter around 5:30 PM.',
    pickup_location: 'Beltola Tiniali Stall #4',
    created_at: '2026-09-13T09:15:00Z',
    updated_at: '2026-09-13T09:30:00Z',
  },
  {
    id: 'ord_102',
    buyer_id: 'user_buyer_1',
    seller_id: 'user_seller_3',
    product_id: 'prod_4',
    unit_price: 70,
    quantity: 3,
    total_price: 210,
    unit: 'litre',
    status: 'READY_FOR_PICKUP',
    delivery_type: 'pickup',
    notes: 'Please keep morning milk batch separate.',
    pickup_location: 'Dispur Supermarket Shed 2',
    created_at: '2026-09-13T08:00:00Z',
    updated_at: '2026-09-13T08:45:00Z',
  },
  {
    id: 'ord_100',
    buyer_id: 'user_buyer_1',
    seller_id: 'user_seller_1',
    product_id: 'prod_3',
    unit_price: 450,
    quantity: 1,
    total_price: 450,
    unit: '5 kg bag',
    status: 'COMPLETED',
    delivery_type: 'seller_delivery',
    notes: 'Delivered to Beltola Housing Complex',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-11T16:00:00Z',
  }
];

const INITIAL_UNLOCKS: ContactUnlock[] = [
  {
    id: 'unl_1',
    buyer_id: 'user_buyer_1',
    seller_id: 'user_seller_1',
    product_id: 'prod_1',
    fee_amount: 0,
    payment_status: 'free_tier',
    unlocked_at: '2026-09-13T09:10:00Z',
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    order_id: 'ord_100',
    buyer_id: 'user_buyer_1',
    buyer_name: 'Anupam Das',
    seller_id: 'user_seller_1',
    product_id: 'prod_3',
    rating: 5,
    comment: 'Authentic Joha rice with incredible aroma. Directly collected from Ramen-da, highly recommend!',
    created_at: '2026-09-11T17:00:00Z',
  }
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporter_id: 'user_buyer_1',
    reporter_name: 'Anupam Das',
    target_type: 'product',
    target_id: 'prod_sample_test',
    target_title: 'Suspicious chemical pesticide listing',
    reason: 'Prohibited chemical item in organic produce category',
    details: 'Seller attempted to list uncertified industrial spray as bio-fertilizer.',
    status: 'pending',
    created_at: '2026-09-12T16:20:00Z',
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    user_id: 'user_seller_1',
    title_en: 'New Order Received',
    title_as: 'নতুন অৰ্ডাৰ অনুৰোধ',
    message_en: 'Anupam Das placed an order for 2 dozen Assam Duck Eggs.',
    message_as: 'অনুপম দাসে ২ ডজন হাঁহৰ কণীৰ বাবে অৰ্ডাৰ প্ৰদান কৰিছে।',
    type: 'order',
    link: '/seller/dashboard',
    is_read: false,
    created_at: '2026-09-13T09:15:00Z',
  },
  {
    id: 'notif_2',
    user_id: 'user_buyer_1',
    title_en: 'Order Accepted',
    title_as: 'অৰ্ডাৰ গ্ৰহণ কৰা হৈছে',
    message_en: 'Ramen Borah accepted your order for Duck Eggs.',
    message_as: 'ৰমেন বৰাই আপোনাৰ হাঁহৰ কণীৰ অৰ্ডাৰ স্বীকাৰ কৰিছে।',
    type: 'order',
    link: '/buyer/dashboard',
    is_read: false,
    created_at: '2026-09-13T09:30:00Z',
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    actor_id: 'user_admin_1',
    actor_role: 'admin',
    actor_name: 'Thaluwa Admin',
    action: 'SYSTEM_INITIALIZATION',
    target_type: 'SYSTEM',
    target_id: 'PLATFORM',
    result: 'SUCCESS',
    details: 'Thaluwa Bazar high-security DB initialized with OWASP ASVS 5.0.0 posture.',
    ip_address: '127.0.0.1',
    created_at: '2026-09-13T00:00:00Z',
  },
  {
    id: 'aud_2',
    actor_id: 'user_buyer_1',
    actor_role: 'buyer',
    actor_name: 'Anupam Das',
    action: 'CONTACT_UNLOCK',
    target_type: 'SELLER_PHONE',
    target_id: 'user_seller_1',
    result: 'SUCCESS',
    details: 'Unlocked contact for Ramen Borah (Beltola Duck Eggs)',
    ip_address: '103.14.120.45',
    created_at: '2026-09-13T09:10:00Z',
  }
];

const INITIAL_SETTINGS: MarketplaceSettings = {
  marketplace_radius_km: 5,
  seller_monthly_subscription_fee: 20,
  contact_unlock_fee: 0, // Configurable MVP default (0 = free tier contact unlock)
  contact_unlock_fee_enabled: false,
  allow_auto_approval: true,
  platform_currency: 'INR (₹)',
};

function ensureDbFile(): DatabaseData {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseData = {
      users: INITIAL_USERS,
      seller_profiles: INITIAL_SELLER_PROFILES,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      contact_unlocks: INITIAL_UNLOCKS,
      reviews: INITIAL_REVIEWS,
      reports: INITIAL_REPORTS,
      notifications: INITIAL_NOTIFICATIONS,
      audit_logs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content) as DatabaseData;
  } catch (err) {
    console.error("Error reading db file, resetting to initial:", err);
    const initialData: DatabaseData = {
      users: INITIAL_USERS,
      seller_profiles: INITIAL_SELLER_PROFILES,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      contact_unlocks: INITIAL_UNLOCKS,
      reviews: INITIAL_REVIEWS,
      reports: INITIAL_REPORTS,
      notifications: INITIAL_NOTIFICATIONS,
      audit_logs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDb(data: DatabaseData): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getUsers(): User[] {
    return ensureDbFile().users;
  },
  getUserById(id: string): User | undefined {
    return ensureDbFile().users.find(u => u.id === id);
  },
  getUserByEmail(email: string): User | undefined {
    return ensureDbFile().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(user: User): User {
    const data = ensureDbFile();
    data.users.push(user);
    saveDb(data);
    return user;
  },

  getSellerProfiles(): SellerProfile[] {
    return ensureDbFile().seller_profiles;
  },
  getSellerProfile(userId: string): SellerProfile | undefined {
    return ensureDbFile().seller_profiles.find(s => s.user_id === userId);
  },
  updateSellerProfile(profile: SellerProfile): SellerProfile {
    const data = ensureDbFile();
    const idx = data.seller_profiles.findIndex(s => s.user_id === profile.user_id);
    if (idx >= 0) {
      data.seller_profiles[idx] = profile;
    } else {
      data.seller_profiles.push(profile);
    }
    saveDb(data);
    return profile;
  },

  getCategories(): Category[] {
    return ensureDbFile().categories;
  },
  getCategoryById(id: string): Category | undefined {
    return ensureDbFile().categories.find(c => c.id === id);
  },

  getProducts(): Product[] {
    const data = ensureDbFile();
    return data.products.map(p => {
      const seller = data.users.find(u => u.id === p.seller_id);
      const profile = data.seller_profiles.find(s => s.user_id === p.seller_id);
      const cat = data.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        seller_name: profile?.business_name || seller?.name || 'Local Seller',
        seller_rating: profile?.rating_aggregate || 4.8,
        seller_verified: seller?.is_verified ?? true,
        category_name_en: cat?.name_en || 'General',
        category_name_as: cat?.name_as || 'সাধাৰণ',
      };
    });
  },
  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },
  createProduct(product: Product): Product {
    const data = ensureDbFile();
    data.products.unshift(product);
    saveDb(data);
    return product;
  },
  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const data = ensureDbFile();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      data.products[idx] = { ...data.products[idx], ...updates };
      saveDb(data);
      return data.products[idx];
    }
    return undefined;
  },
  deleteProduct(id: string): boolean {
    const data = ensureDbFile();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    if (data.products.length !== initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  getOrders(): Order[] {
    const data = ensureDbFile();
    return data.orders.map(o => {
      const buyer = data.users.find(u => u.id === o.buyer_id);
      const seller = data.users.find(u => u.id === o.seller_id);
      const profile = data.seller_profiles.find(s => s.user_id === o.seller_id);
      const prod = data.products.find(p => p.id === o.product_id);
      return {
        ...o,
        buyer_name: buyer?.name || 'Buyer',
        buyer_phone: buyer?.phone || '',
        seller_name: profile?.business_name || seller?.name || 'Seller',
        product_title: prod?.title_en || 'Local Product',
        product_image: prod?.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
      };
    });
  },
  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },
  createOrder(order: Order): Order {
    const data = ensureDbFile();
    data.orders.unshift(order);
    saveDb(data);
    return order;
  },
  updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
    const data = ensureDbFile();
    const idx = data.orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      data.orders[idx].status = status;
      data.orders[idx].updated_at = new Date().toISOString();
      saveDb(data);
      return data.orders[idx];
    }
    return undefined;
  },

  getContactUnlocks(buyerId?: string): ContactUnlock[] {
    const unlocks = ensureDbFile().contact_unlocks;
    if (buyerId) return unlocks.filter(u => u.buyer_id === buyerId);
    return unlocks;
  },
  isContactUnlocked(buyerId: string, sellerId: string): boolean {
    const unlocks = ensureDbFile().contact_unlocks;
    return unlocks.some(u => u.buyer_id === buyerId && u.seller_id === sellerId);
  },
  addContactUnlock(unlock: ContactUnlock): ContactUnlock {
    const data = ensureDbFile();
    data.contact_unlocks.push(unlock);
    saveDb(data);
    return unlock;
  },

  getReviews(productId?: string, sellerId?: string): Review[] {
    const reviews = ensureDbFile().reviews;
    if (productId) return reviews.filter(r => r.product_id === productId);
    if (sellerId) return reviews.filter(r => r.seller_id === sellerId);
    return reviews;
  },
  createReview(review: Review): Review {
    const data = ensureDbFile();
    data.reviews.unshift(review);
    saveDb(data);
    return review;
  },

  getReports(): Report[] {
    return ensureDbFile().reports;
  },
  createReport(report: Report): Report {
    const data = ensureDbFile();
    data.reports.unshift(report);
    saveDb(data);
    return report;
  },
  updateReportStatus(id: string, status: Report['status']): Report | undefined {
    const data = ensureDbFile();
    const rep = data.reports.find(r => r.id === id);
    if (rep) {
      rep.status = status;
      saveDb(data);
      return rep;
    }
    return undefined;
  },

  getNotifications(userId: string): Notification[] {
    return ensureDbFile().notifications.filter(n => n.user_id === userId);
  },
  createNotification(notif: Notification): Notification {
    const data = ensureDbFile();
    data.notifications.unshift(notif);
    saveDb(data);
    return notif;
  },
  markNotificationRead(id: string): void {
    const data = ensureDbFile();
    const n = data.notifications.find(item => item.id === id);
    if (n) {
      n.is_read = true;
      saveDb(data);
    }
  },

  getAuditLogs(): AuditLog[] {
    return ensureDbFile().audit_logs;
  },
  logAuditEvent(event: AuditLog): void {
    const data = ensureDbFile();
    data.audit_logs.unshift(event);
    saveDb(data);
  },

  getSettings(): MarketplaceSettings {
    return ensureDbFile().settings;
  },
  updateSettings(settings: Partial<MarketplaceSettings>): MarketplaceSettings {
    const data = ensureDbFile();
    data.settings = { ...data.settings, ...settings };
    saveDb(data);
    return data.settings;
  },

  resetDemo(): void {
    const initialData: DatabaseData = {
      users: INITIAL_USERS,
      seller_profiles: INITIAL_SELLER_PROFILES,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      contact_unlocks: INITIAL_UNLOCKS,
      reviews: INITIAL_REVIEWS,
      reports: INITIAL_REPORTS,
      notifications: INITIAL_NOTIFICATIONS,
      audit_logs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
    };
    saveDb(initialData);
  }
};
