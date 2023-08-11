// Exporting global constants
export const globals = {
  // Audio related properties
  click_audio: window.__initialData.click_audio,
  success_audio: window.__initialData.success_audio,
  enable_audio: window.__initialData.enable_audio,
  audio_popup: window.__initialData.audio_popup,

  // Scroll related properties
  is_scrolled: window.__initialData.is_scrolled,                            // Boolean to toggle the dynamic header when scrolling up or down
  prev_scroll_pos: window.__initialData.prev_scroll_pos,                    // Calculates the scroll direction for the dynamic header
  scroll_up: window.__initialData.scroll_up,                                // Boolean to toggle the the "Back to top" button
  scroll_up_force: window.__initialData.scroll_up_force,                    // Boolean to force the "Back to top" to be hidden
  hide_header: window.__initialData.hide_header,                            // Boolean to hide header when opening other overlays
  reduce_product_zindex: window.__initialData.reduce_product_zindex,                            // Boolean to hide header when opening other overlays

  // Mouse position properties
  mouse_x: window.__initialData.mouse_x,                                    // Mouse position X to position zoomed images
  mouse_y: window.__initialData.mouse_y,                                    // Mouse position Y to position zoomed images
  
  // Menu related properties
  menu_drawer: window.__initialData.menu_drawer,                            // Boolean to toggle the menu drawer
  menu_nested: window.__initialData.menu_nested,                            // Boolean to toggle the nested menu drawer

  // Popup related properties
  age_popup: window.__initialData.age_popup,                                // Boolean to toggle the age popup
  back_in_stock_popup: window.__initialData.back_in_stock_popup,
  filter_popup: window.__initialData.filter_popup,                          // Boolean to toggle the filter popup
  localization_popup: window.__initialData.localization_popup,              // Boolean to toggle the localization popup

  // Alert related properties
  show_alert: window.__initialData.show_alert,                              // Boolean to toggle the alert
  error_title: window.__initialData.error_title,                            // String for alert title
  error_message: window.__initialData.error_message,                        // String for alert message

  // Product related properties
  recent_products: window.__initialData.recent_products,                    // Array of recently viewed products
  incomplete_fields: window.__initialData.incomplete_fields,                // Boolean to check if product options are incomplete
  selectedImageIndex: window.__initialData.selectedImageIndex,              // Index of the selected product image (used for fullscreen slider)
  // Cart related properties
  cart_drawer: window.__initialData.cart_drawer,                            // Boolean to toggle the cart drawer
  cart_loading: window.__initialData.cart_loading,                          // Boolean to toggle the cart loading state
  cart_alert: window.__initialData.cart_alert,                              // Boolean to toggle the cart alert
  cart_delay: window.__initialData.cart_delay,                              // Set the delay for the cart alert to close
  cart_delay_width: window.__initialData.cart_delay_width,                  // Set the width for the cart alert progress bar
  cart_behavior: window.__initialData.cart_behavior,                        // Set to 'drawer' 'alert' or 'redirect'
  cart: window.__initialData.cart,                                          // Object to store the cart data
  progress_bar_threshold: window.__initialData.progress_bar_threshold,      // Set the threshold for the 'free shipping' progress bar

  // Search related properties
  search_loading: window.__initialData.search_loading,                      // Boolean to toggle the search loading state
  search_active: window.__initialData.search_active,                        // Boolean to toggle the search overlay
  search_items: window.__initialData.search_items,                          // Array of product search results
  search_items_pages: window.__initialData.search_items_pages,              // Aray of page search results
  search_items_collections: window.__initialData.search_items_collections,  // Array of collection search results
  search_items_articles: window.__initialData.search_items_articles,        // Array of article search results
  search_items_queries: window.__initialData.search_items_queries,          // Array of query search results

  // Collection and pagination related properties
  collection_loading: window.__initialData.collection_loading,              // Boolean to toggle the collection loading state
  pagination_total_pages: window.__initialData.pagination_total_pages,      // Total number of pages for the current collection
  pagination_current_page: window.__initialData.pagination_current_page,    // Current page number in pagination
  pagination_section: window.__initialData.pagination_section,              // Points to a {{ section.id }} to paginate

  // Filter related properties
  filter_min_price: window.__initialData.filter_min_price,                  // Value of the min price input
  filter_max_price: window.__initialData.filter_max_price,                  // Value of the max price input
  filter_min: window.__initialData.filter_min,                              // Min price for the current collection
  filter_max: window.__initialData.filter_max,                              // Max price for the current collection
  filter_min_thumb: window.__initialData.filter_min_thumb,                  // Sets position of min price thumb
  filter_max_thumb: window.__initialData.filter_max_thumb,                  // Sets position of max price thumb

  // Store related properties
  currency_symbol: window.__initialData.currency_symbol,
  button_loading: window.__initialData.button_loading
};