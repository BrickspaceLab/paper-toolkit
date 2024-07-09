// Exporting global constants
const app = window.__initialData;
export const globals = {

  // Scroll
  is_scrolled: app.is_scrolled,                                     // {boolean} Used to toggle dynamic header bar
  prev_scroll_pos: app.prev_scroll_pos,                             // {number} Pprevious scroll position of the page.
  show_scroll_up: app.show_scroll_up,                               // {boolean} To show the 'back to top' button
  
  // Audio
  click_audio: app.click_audio,                                     // {string} URL for click sound
  success_audio: app.success_audio,                                 // {string} URL for success sound
  enable_audio: app.enable_audio,                                   // {boolean} To enable or disable audio

  // Popups
  age_popup: app.age_popup,                                         // {boolean} To toggle the age popup
  filter_popup: app.filter_popup,                                   // {boolean} To toggle the filter popup
  localization_popup: app.localization_popup,                       // {boolean} To toggle the localization popup
  audio_popup: app.audio_popup,                                     // {boolean} To toggle audio settings popup
  cookie_popup: app.cookie_popup,                                   // {boolean} To toggle the cookie compliance popup
  discount_popup: app.discount_popup,                               // {boolean} To toggle the discount popup

  // Quick sections
  quick_add_popup: app.quick_add_popup,                               // {boolean} To toggle the quick add popup
  quick_edit_popup: app.quick_edit_popup,                             // {boolean} To toggle the quick edit popup
  quick_edit_handle: app.quick_edit_handle,                           // {string} The product handle of the product being edited
  quick_add_handle: app.quick_add_handle,                             // {string} The product handle of the product being added
  // Menu 
  menu_drawer: app.menu_drawer,                                     // {boolean} To toggle the menu drawer
  menu_nested: app.menu_nested,                                     // {boolean} To check if the menu is nested
  
  // Header
  hide_header: app.hide_header,                                     // {boolean} To hide the header

  // Errors
  error_alert: app.error_alert,                                     // {boolean} To show the alert
  error_message: app.error_message,                                 // {string} Error message

  // Prices
  price_format_with_currency: app.price_format_with_currency,       // {string} Format for price with currency
  price_format_without_currency: app.price_format_without_currency, // {string} Format for price without currency
  price_enable_zeros: app.price_enable_zeros,                       // {Boolean} Set to false to hide '.00'
  price_enable_currency: app.price_enable_currency,                 // {Boolean} Set to false to hide 'CAD
  
  // Product
  recent_products: app.recent_products,                             // {array} of recently viewed products
  
  // Discount properties
  discount_text: app.discount_text,                                 // {string} Text for the discount
  discount_code: app.discount_code,                                 // {string} Code for the discount

  // Cart
  cart_alert: app.cart_alert,                                       // {boolean} To show the cart alert
  cart_drawer: app.cart_drawer,                                     // {boolean} To toggle the cart drawer
  cart_loading: app.cart_loading,                                   // {boolean} To check if the cart is loading
  cart_behavior_desktop: app.cart_behavior_desktop,                 // {string} Behavior of the cart on desktop
  cart_behavior_mobile: app.cart_behavior_mobile,                   // {string} Behavior of the cart on mobile
  cart: app.cart,                                                   // {object} Object to store the cart data
  progress_bar_threshold: app.progress_bar_threshold,               // {number} Set the threshold for the 'free shipping' progress bar
  
  // Search
  search_active: app.search_active,                                 // {boolean} to toggle the search overlay
  search_loading: app.search_loading,                               // {boolean} To check if the search is loading
  search_term: app.search_term,                                     // {string} Term for the search
  search_items: app.search_items,                                   // {array} Array of search items
  search_focus_index: app.search_focus_index,                       // {string} Index of the focused search item
  search_focus_url: app.search_focus_url,                           // {string} URL of the focused search item
  search_items_pages: app.search_items_pages,                       // {array} Array of search items in pages
  search_items_collections: app.search_items_collections,           // {array} Array of search items in collections
  search_items_articles: app.search_items_articles,                 // {array} Array of search items in articles
  search_items_queries: app.search_items_queries,                   // {array} Array of search items in queries

  // Pagination
  pagination_loading: app.pagination_loading,                       // {boolean} To show loading state in pagination
  pagination_total_pages: app.pagination_total_pages,               // {number} Total number of pages for the current collection
  pagination_current_page: app.pagination_current_page,             // {number} Current page number in pagination
  pagination_section: app.pagination_section,                       // {string} Points to a {{ section.id }} to paginate
  
  // Filter
  filter_min_price: app.filter_min_price,                           // {number} Value of the min price input
  filter_max_price: app.filter_max_price,                           // {number} Value of the max price input
  filter_min: app.filter_min,                                       // {number} Min price for the current collection
  filter_max: app.filter_max,                                       // {number} Max price for the current collection
  filter_min_thumb: app.filter_min_thumb,                           // {number} Sets position of min price thumb
  filter_max_thumb: app.filter_max_thumb,                           // {number} Sets position of max price thumb

  // TODO: - Remove, merge and connect. Referce Space
  show_alert: app.show_alert,
  enable_body_scrolling: app.enable_body_scrolling,

};