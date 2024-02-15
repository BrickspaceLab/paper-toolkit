// Global interfaces
export interface AppInterface {
  is_scrolled: boolean;
  prev_scroll_pos: number;
  show_scroll_up: boolean;
  click_audio: string;
  success_audio: string;
  enable_audio: boolean;
  age_popup: boolean;
  filter_popup: boolean;
  localization_popup: boolean;
  audio_popup: boolean;
  cookie_popup: boolean;
  discount_popup: boolean;
  quick_add_popup: boolean;
  quick_edit_popup: boolean;
  quick_edit_handle: string;
  quick_add_handle: string; 
  menu_drawer: boolean;
  menu_nested: boolean;
  hide_header: boolean;
  error_alert: boolean;
  error_message: string;
  price_format_with_currency: string;
  price_format_without_currency: string;
  price_enable_zeros: boolean;
  price_enable_currency: boolean;
  recent_products: any[];
  cart_alert: boolean;
  cart_drawer: boolean;
  cart_loading: boolean;
  cart_behavior_desktop: string;
  cart_behavior_mobile: string;
  cart: object;
  progress_bar_threshold: number;
  search_active: boolean;
  search_loading: boolean;
  search_term: string;
  search_items: any[];
  search_focus_index: string;
  search_focus_url: string;
  search_items_pages: any[];
  search_items_collections: any[];
  search_items_articles: any[];
  search_items_queries: any[];
  pagination_loading: boolean;
  pagination_total_pages: number;
  pagination_current_page: number;
  pagination_section: string;
  filter_min_price: number;
  filter_max_price: number;
  filter_min: number;
  filter_max: number;
  filter_min_thumb: number;
  filter_max_thumb: number;
  show_alert: boolean;
  enable_body_scrolling: boolean;
}

export interface ShopifyInterface {
  shop: string;
  locale: string;
  currency: {
    active: string;
    rate: string;
  };
  country: string;
  theme: {
    name: string;
    id: number;
    theme_store_id: number | null;
    role: string;
    handle: string;
    style: {
      id: string | null;
      handle: string | null;
    };
  };
  cdnHost: string;
  routes: {
    root: string;
  };
  modules: boolean;
  money_format: string;
  PaymentButton: {};
  SignInWithShop: {};
  formatMoney(cents: string | number, currency?: string): string;
}

// Collection interfaces
interface Collection {
  id: number;
  body: string;
  handle: string;
  published_at: string;
  title: string;
  url: string;
  featured_image: FeaturedImage;
}

interface RecentProduct {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: string;
  created_at: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: Variant[];
  images: string[];
  featured_image: string;
  options: {
    name: string;
    position: number;
    values: string[];
  }[];
  url: string;
  media: {
    alt: string;
    id: number;
    position: number;
    preview_image: {
      aspect_ratio: number;
      height: number;
      width: number;
      src: string;
    };
    aspect_ratio: number;
    height: number;
    media_type: string;
    src: string;
    width: number;
  }[];
  requires_selling_plan: boolean;
  selling_plan_groups: {
    id: string;
    name: string;
    options: {
      name: string;
      position: number;
      values: string[];
    }[];
    selling_plans: {
      id: number;
      name: string;
      description: string;
      options: {
        name: string;
        position: number;
        value: string;
      }[];
      recurring_deliveries: boolean;
      price_adjustments: {
        order_count: number | null;
        position: number;
        value_type: string;
        value: number;
      }[];
    }[];
    app_id: string;
  }[];
}

// Product interfaces
export interface Product {
  id: number;
  properties: null;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: {
    aspect_ratio: number;
    alt: string;
    height: number;
    url: string;
    width: number;
  };
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string;
  variant_options: string[];
  options_with_values: {
    name: string;
    value: string;
  }[];
  line_level_discount_allocations: {
    amount: number;
    discount_application: {
        target_selection: string,
        target_type: string,
        title: string,
        total_allocated_amount: number,
        type: string,
        value: number,
        value_type: string
    }
  }[];
  line_level_total_discount: number;
}

interface Variant {
  id: number;
  title: string;
  option1: string;
  option2: string;
  option3: null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: FeaturedImage;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: null | number;
  inventory_management: string;
  barcode: string;
  featured_media: {
    alt: string;
    id: number;
    position: number;
    preview_image: {
      aspect_ratio: number;
      height: number;
      width: number;
      src: string;
    };
  };
  unit_price: number;
  unit_price_measurement: UnitPriceMeasurement;
  requires_selling_plan: boolean;
  selling_plan_allocations: SellingPlanAllocation[];
}

interface FeaturedImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

interface UnitPriceMeasurement {
  measured_type: string;
  quantity_value: string;
  quantity_unit: string;
  reference_value: number;
  reference_unit: string;
}

interface SellingPlanAllocation {
  price_adjustments: {
    position: number;
    price: number;
  }[];
  price: number;
  compare_at_price: number;
  per_delivery_price: number;
  unit_price: number;
  selling_plan_id: number;
  selling_plan_group_id: string;
}

// Cart interfaces
interface Cart {
  items: Product[];
  item_count: number;
  total_price: number;
  original_total_price: number;
  total_discount: number;
  shipping_gap: number;
  shipping_progress: string;
  cart_level_discount_applications: {
    type: string;
    key: string;
    title: string;
    description: null | string;
    value: string;
    created_at: string;
    value_type: string;
    allocation_method: string;
    target_selection: string;
    target_type: string;
    total_allocated_amount: number;
  }[];
}

// Search interfaces
interface SearchQuery {
  styled_text: string;
  text: string;
  url: string;
}

export interface Params {
  author: string;
  body: string;
  product_type: string;
  tag: string;
  title: string;
  variants_barcode: string;
  variants_sku: string;
  variants_title: string;
  vendor: string;
}

// Page and blog interfaces
interface Page {
  id: number;
  body: string;
  handle: string;
  published_at: string;
  title: string;
  url: string;
}

interface Article {
  id: number;
  body: string;
  featured_image: FeaturedImage;
  handle: string;
  image: string;
  summary_html: string;
  tags: string[];
  published_at: string;
  title: string;
  url: string;
}

