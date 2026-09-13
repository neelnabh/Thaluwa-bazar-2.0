export type Language = 'as' | 'en';

export const translations = {
  as: {
    app_title: "থলুৱা বজাৰ",
    app_tagline: "আপোনাৰ ওচৰ-চুবুৰীয়াৰ স্থানীয় বজাৰ",
    app_subtitle: "স্থানীয় উৎপাদকৰ পৰা পোনপটীয়াকৈ সতেজ আৰু খাঁটি সামগ্ৰী কিনক (৫ কিঃমিঃৰ ভিতৰত)",
    
    // Navigation
    nav_home: "গৃহ",
    nav_browse: "সামগ্ৰী চাওক",
    nav_sell: "বিক্ৰী কৰক",
    nav_buyer_dashboard: "মোৰ অৰ্ডাৰসমূহ",
    nav_seller_dashboard: "বিক্ৰেতা কেন্দ্ৰ",
    nav_moderation: "নিয়ন্ত্ৰণ পেনেল",
    nav_admin: "প্ৰশাসক কেন্দ্ৰ",
    nav_safety: "সুৰক্ষা আৰু নিয়ম",
    nav_login: "প্ৰৱেশ",
    nav_register: "পঞ্জীয়ন",
    nav_logout: "প্ৰস্থান",

    // Banner & Search
    hero_heading: "আপোনাৰ ওচৰৰ গাঁও আৰু নগৰৰ সতেজ সামগ্ৰী",
    hero_subheading: "হাঁহ-কুকুৰা, সতেজ শাক-পাচলি, নদীৰ মাছ, গাখীৰ, বাঁহ-বেতৰ শিল্প পোনপটীয়াকৈ স্থানীয় কৃষকৰ পৰা।",
    search_placeholder: "সামগ্ৰী বিচাৰক (যেনে: হাঁহৰ কণী, সতেজ ৰৌ মাছ, জহা চাউল...)",
    select_location: "স্থান বাছক",
    search_radius: "দূৰত্ব ব্যাসাৰ্ধ",
    within_radius: "{radius} কিঃমিঃৰ ভিতৰত",
    all_categories: "সকলো শ্ৰেণী",

    // Categories
    cat_eggs: "কণী (হাঁহ/কুকুৰা)",
    cat_milk: "গাখীৰ আৰু দুগ্ধজাত",
    cat_vegetables: "শাক-পাচলি",
    cat_fish: "নদী/বিলৰ মাছ",
    cat_rice: "ধান আৰু চাউল",
    cat_poultry: "স্থানীয় হাঁহ-কুকুৰা",
    cat_agri: "কৃষি সামগ্ৰী",
    cat_homemade: "ঘৰুৱা খাদ্য",
    cat_bamboo: "বাঁহ-বেতৰ সামগ্ৰী",
    cat_plants: "গছপুলি আৰু ফুল",
    cat_others: "অন্যান্য",

    // Filters & Sorting
    filter_title: "ফিল্টাৰ",
    filter_price: "মূল্য পৰিসীমা",
    filter_fresh: "কেৱল আজিৰ সতেজ সামগ্ৰী",
    filter_verified_only: "প্ৰমাণিত বিক্ৰেতা",
    sort_by: "ক্ৰম",
    sort_nearest: "আটাইতকৈ ওচৰৰ",
    sort_price_low: "কম মূল্যৰ পৰা",
    sort_price_high: "বেছি মূল্যৰ পৰা",
    sort_newest: "নতুন সংযোজিত",

    // Product Card & Details
    fresh_badge: "সতেজ / আজিৰ সংগ্ৰহ",
    verified_seller: "প্ৰমাণিত থলুৱা বিক্ৰেতা",
    per_unit: "প্ৰতি",
    available_qty: "মজুত আছে:",
    seller_distance: "আপোনাৰ পৰা",
    view_details: "সবিশেষ চাওক",
    contact_seller: "বিক্ৰেতাৰ সৈতে যোগাযোগ",
    order_now: "এতিয়াই অৰ্ডাৰ কৰক",
    unlock_contact_btn: "ফোন নম্বৰ চাওক (সুৰক্ষিত যোগাযোগ)",
    unlocked_phone: "বিক্ৰেতাৰ নম্বৰ:",
    pickup_available: "পিক-আপ উপলব্ধ",
    seller_delivery_available: "বিক্ৰেতাই ডেলিভাৰী দিব",
    report_listing: "অভিযোগ দাখিল কৰক",

    // Order flow
    order_modal_title: "অৰ্ডাৰ নিশ্চিত কৰক",
    order_quantity: "পৰিমাণ:",
    order_delivery_method: "ডেলিভাৰী পদ্ধতি:",
    pickup_myself: "মই নিজে আনিবলৈ যাম (পিক-আপ)",
    seller_delivers: "বিক্ৰেতাই ডেলিভাৰী দিয়ক",
    order_notes_placeholder: "বিশেষ নিৰ্দেশনা (ঠিকনা বা সময়)...",
    order_submit_btn: "অৰ্ডাৰ প্ৰেৰণ কৰক",
    order_success_msg: "অৰ্ডাৰ সফলতাৰে প্ৰেৰণ কৰা হ'ল! বিক্ৰেতাই সোনকালে যোগাযোগ কৰিব।",

    // Order status badges
    status_REQUESTED: "অনুৰোধ জনোৱা হৈছে",
    status_ACCEPTED: "বিক্ৰেতাই স্বীকাৰ কৰিছে",
    status_READY_FOR_PICKUP: "ল'বলৈ সাজু হৈছে",
    status_COMPLETED: "সম্পূৰ্ণ হ'ল",
    status_REJECTED: "বাতিল/প্ৰত্যাখ্যান",
    status_CANCELLED: "বাতিল কৰা হ'ল",
    status_DISPUTED: "বিবাদ নিষ্পত্তিত আছে",

    // State actions
    action_accept: "অৰ্ডাৰ স্বীকাৰ কৰক",
    action_reject: "প্ৰত্যাখ্যান কৰক",
    action_ready: "ল'বলৈ সাজু হিচাপে চিহ্নিত কৰক",
    action_complete: "সম্পূৰ্ণ হ'ল বুলি চিহ্নিত কৰক",
    action_cancel: "অৰ্ডাৰ বাতিল কৰক",
    action_dispute: "বিবাদ দাখিল কৰক",

    // Seller creation
    add_listing_title: "নতুন সামগ্ৰী বিক্ৰীৰ বাবে দিয়ক",
    listing_name_label: "সামগ্ৰীৰ নাম (অসমীয়া বা ইংৰাজীত):",
    listing_cat_label: "শ্ৰেণী:",
    listing_price_label: "মূল্য (টকা ₹):",
    listing_unit_label: "একক:",
    listing_qty_label: "মজুত পৰিমাণ:",
    listing_location_label: "স্থান / বজাৰ:",
    listing_fresh_checkbox: "আজিৰ সতেজ উৎপাদিত সামগ্ৰী",
    listing_submit_btn: "সামগ্ৰী প্ৰকাশ কৰক",

    // Security & Safety
    privacy_notice: "🔒 থলুৱা বজাৰ সুৰক্ষা: বিক্ৰেতাৰ নম্বৰ স্পাম আৰু চাইবাৰ অপৰাধৰ পৰা ৰক্ষা কৰিবলৈ গোপন ৰখা হয়।",
    asvs_badge: "OWASP ASVS 5.0.0 Level 2 সুৰক্ষা প্ৰণালী",
    demo_role_switcher: "ডে'ম ভূমিকা সলনি কৰক (সরাসৰি পৰীক্ষাৰ বাবে):",
  },
  en: {
    app_title: "Thaluwa Bazar",
    app_tagline: "Your Assam Hyperlocal Marketplace",
    app_subtitle: "Buy fresh and authentic local produce directly from nearby sellers within 5 km",
    
    // Navigation
    nav_home: "Home",
    nav_browse: "Browse",
    nav_sell: "Sell Item",
    nav_buyer_dashboard: "My Orders",
    nav_seller_dashboard: "Seller Hub",
    nav_moderation: "Moderation",
    nav_admin: "Admin Console",
    nav_safety: "Safety & Rules",
    nav_login: "Login",
    nav_register: "Register",
    nav_logout: "Logout",

    // Banner & Search
    hero_heading: "Fresh Hyperlocal Produce From Assam's Villages & Markets",
    hero_subheading: "Duck eggs, river fish, organic greens, Joha rice, milk and bamboo handicrafts straight from local producers.",
    search_placeholder: "Search products (e.g. Duck eggs, Fresh Rohu Fish, Joha Rice...)",
    select_location: "Select Location",
    search_radius: "Radius",
    within_radius: "Within {radius} km",
    all_categories: "All Categories",

    // Categories
    cat_eggs: "Eggs (Duck / Local)",
    cat_milk: "Milk & Dairy",
    cat_vegetables: "Fresh Vegetables",
    cat_fish: "River & Wetland Fish",
    cat_rice: "Paddy & Joha Rice",
    cat_poultry: "Country Chicken & Duck",
    cat_agri: "Agricultural Produce",
    cat_homemade: "Homemade Food & Pitha",
    cat_bamboo: "Bamboo & Cane Crafts",
    cat_plants: "Plants & Nursery",
    cat_others: "Others",

    // Filters & Sorting
    filter_title: "Filters",
    filter_price: "Price Range",
    filter_fresh: "Fresh harvest only",
    filter_verified_only: "Verified Sellers Only",
    sort_by: "Sort By",
    sort_nearest: "Nearest to Me",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    sort_newest: "Recently Listed",

    // Product Card & Details
    fresh_badge: "Fresh Today",
    verified_seller: "Verified Local Seller",
    per_unit: "per",
    available_qty: "In Stock:",
    seller_distance: "Distance:",
    view_details: "View Details",
    contact_seller: "Contact Seller",
    order_now: "Order Now",
    unlock_contact_btn: "Unlock Phone (Protected Contact)",
    unlocked_phone: "Seller Phone:",
    pickup_available: "Self-Pickup Available",
    seller_delivery_available: "Seller Delivery Available",
    report_listing: "Report Listing",

    // Order flow
    order_modal_title: "Confirm Hyperlocal Order",
    order_quantity: "Quantity:",
    order_delivery_method: "Delivery Method:",
    pickup_myself: "Self Pickup (Buyer arranges pickup)",
    seller_delivers: "Seller Arranged Delivery",
    order_notes_placeholder: "Add delivery notes or timing preference...",
    order_submit_btn: "Place Order Request",
    order_success_msg: "Order request sent successfully! The seller has been notified.",

    // Order status badges
    status_REQUESTED: "Requested",
    status_ACCEPTED: "Accepted by Seller",
    status_READY_FOR_PICKUP: "Ready for Pickup",
    status_COMPLETED: "Completed",
    status_REJECTED: "Rejected",
    status_CANCELLED: "Cancelled",
    status_DISPUTED: "Disputed",

    // State actions
    action_accept: "Accept Order",
    action_reject: "Reject Order",
    action_ready: "Mark Ready for Pickup",
    action_complete: "Mark Order Completed",
    action_cancel: "Cancel Order",
    action_dispute: "Open Dispute",

    // Seller creation
    add_listing_title: "Post New Hyperlocal Listing",
    listing_name_label: "Product Name (Assamese or English):",
    listing_cat_label: "Category:",
    listing_price_label: "Price (₹ INR):",
    listing_unit_label: "Unit:",
    listing_qty_label: "Available Quantity:",
    listing_location_label: "Location / Market Area:",
    listing_fresh_checkbox: "Fresh harvest/produce collected today",
    listing_submit_btn: "Publish Listing",

    // Security & Safety
    privacy_notice: "🔒 Thaluwa Bazar Privacy: Seller phone numbers are protected from automated scrapers and abuse.",
    asvs_badge: "OWASP ASVS 5.0.0 Level 2 Compliant",
    demo_role_switcher: "Demo Role Switcher (Instant test mode):",
  }
};
