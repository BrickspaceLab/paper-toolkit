export const collections = {

  // Call section render API with data from filter
  async fetchAndRenderCollection (
    filterData: FormData
  ) {

    // Go back to top
    const element = document.getElementById("js-top"); 
    if (element) {
      // Scroll to element with offset for header height
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - this.header_group_height,
        behavior: 'smooth'
      });
    }

    // Loop through form data and build url
    const filterUrl = this.buildUrlFilter(filterData);

    // Get search term
    let searchUrl = new URL(location.href).searchParams.get("q");
    searchUrl = searchUrl ? `&q=${searchUrl}` : '';

    // Update page url
    history.pushState(
      null,
      "",
      `${window.location.pathname}?${filterUrl}${searchUrl}`
    );

    // Listen to popstate event
    window.addEventListener('popstate', () => {
      this.fetchAndRenderCollection(filterData);
    });
    
    // Get data from Shopify
    try {
      const response = await fetch(
        `${window.location.pathname}?section_id=${this.pagination_section}${filterUrl}${searchUrl}`
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse response data
      const data = await response.text();

      // Replace section with new content
      const sectionElement = document.getElementById(`shopify-section-${this.pagination_section}`);
      if (sectionElement) {
        sectionElement.innerHTML = data;
      }
      
      // Reset loading
      this.pagination_loading = false;
      this.filter_popup = false;
    } 
    
    catch (error) {
      console.error("Error:", error);
      this.pagination_loading = false;
    }
  },

  // Check if next page is avaible and inject more products
  async fetchAndRenderPage (direction: "next" | "previous") {
    // Prevent browser from scrolling down
    history.scrollRestoration = "manual";

    // Show loading
    this.pagination_loading = true;

    // Update URL to show updated page number
    if (direction === "next") {
      let url = new URL(window.location.href);
      url.searchParams.set("page", this.pagination_current_page + 1);
      window.history.pushState({}, "", url.toString());
    }

    // Get filter data
    const filter = document.getElementById("js-desktopFilter") as HTMLFormElement;

    // Get pagination count
    const pageUrl = `&page=${direction === "next" ? this.pagination_current_page + 1 : this.pagination_current_page - 1}`;

    // Get search parameter
    const searchUrl = new URL(location.href).searchParams.get("q") ? `&q=${new URL(location.href).searchParams.get("q")}` : '';

    // Build fetch url
    let fetchUrl = `${window.location.pathname}?section_id=${this.pagination_section}${pageUrl}${searchUrl}`;

    // If filter exists, add filter data to fetch url
    if (filter) {
      const filterData = new FormData(filter);
      const filterUrl = this.buildUrlFilter(filterData);
      fetchUrl += filterUrl;
    }
    
    // Check if new page is available
    if (this.pagination_current_page < this.pagination_total_pages ||
      direction === "previous") {

      // Get data from Shopify
      try {
        const response = await fetch(fetchUrl);
        const data = await response.text();

        // Create a new HTML element and set its innerHTML to the fetched data
        const tempElement = document.createElement("div");
        tempElement.innerHTML = data;

        // Find the results within the fetched data
        const fetchedElement = tempElement.querySelector("#js-results");

        // If results are found, append its innerHTML to the existing element on the page
        if (fetchedElement) {
          const resultsElement = document.getElementById("js-results");
          if (resultsElement) {
            if (direction === "next") {
              resultsElement.insertAdjacentHTML(
                "beforeend",
                fetchedElement.innerHTML,
              );
            } else {
              resultsElement.insertAdjacentHTML(
                "afterbegin",
                fetchedElement.innerHTML,
              );
            }
          }
        }

        // Update next page url
         // Update next page url
         if (direction === "next") {
          this.pagination_current_page += 1;
          this.pagination_pages_loaded += 1;
        } else {
          this.pagination_current_page -= 1;
        }
        
        // Reset loading
        // this.loadImages();
        this.pagination_loading = false;
      } 

      catch (error) {
        console.error("Error:", error);
        this.pagination_loading = false;
      }
    } 
    
    // If last page, stop loading
    else {
      this.pagination_loading = false;
    }
  },

   // Handle filter changes on price
  handlePriceFilterChange (
    filterType: string
  ) {
    // Use destructuring to make the code cleaner and easier to read
    const { filter_min_price, filter_max_price, filter_min, filter_max } = this;

    // Calculate the price range
    const priceRange = filter_max - filter_min;

    // Check the filter type and update the appropriate values
    if (filterType === 'max') {
      this.filter_max_price = Math.max(filter_max_price, filter_min_price);
      this.filter_max_thumb = 100 - ((this.filter_max_price - filter_min) / priceRange) * 100;
    } 
    else if (filterType === 'min') {
      this.filter_min_price = Math.min(filter_min_price, filter_max_price);
      this.filter_min_thumb = ((this.filter_min_price - filter_min) / priceRange) * 100;
    } else {
      console.error('Invalid filter type. Expected "min" or "max".');
    }
  },

  // Handle filter change
  handleFilterChange(id: string): void {
    // Show loading indication
    this.pagination_loading = true;
  
    // Reset pagination
    this.pagination_current_page = 1;
  
    // Get filter data
    const filter = document.getElementById(id) as HTMLFormElement | null;
    
    if (filter) {
      const filterData = new FormData(filter);
  
      this.fetchAndRenderCollection(filterData);
    } else {
      console.error("Filter element not found.");
    }
  },
  
  // Handle deleting filters
  handleFilterDelete(filterToReset: string): void {
    // Show loading indication
    this.pagination_loading = true;
  
    // Get filter data
    const filter = document.getElementById("js-desktopFilter") as HTMLFormElement | null;
    
    if (filter) {
      const filterData = new FormData(filter);
  
      // Remove deleted filter
      filterData.delete(filterToReset);
      if (filterToReset.indexOf("price") !== -1) {
        filterData.delete("filter.v.price.gte");
        filterData.delete("filter.v.price.lte");
        this.filter_min_price = this.filter_min;
        this.filter_max_price = this.filter_max;
      }
  
      this.fetchAndRenderCollection(filterData);
    } else {
      console.error("Filter element 'js-desktopFilter' not found.");
    }
  },
  
  // Handle deleting all filters
  handleFilterDeleteAll: function () {
    // Show loading indication
    this.pagination_loading = true;

    // Reset filterData
    let filterData = new FormData();
    this.filter_min_price = this.filter_min;
    this.filter_max_price = this.filter_max;
    this.fetchAndRenderCollection(filterData);
  },

  // Build urlFilter
  buildUrlFilter (
    filterData: FormData
  ) {
    
    // Reset filter URL 
    let urlFilter = "";

    // Loop through filterData form
    for (let pair of filterData.entries()) {
      const [key, value] = pair;

      // If filtering with price range
      if (key.includes("price")) { 
        if (key === "filter.v.price.lte" && value < this.filter_max) {
          urlFilter += `&${key}=${value}`;
        }
        if (key === "filter.v.price.gte" && value > this.filter_min) {
          urlFilter += `&${key}=${value}`;
        }
      }

      // All other filters
      else {
        urlFilter += `&${key}=${encodeURIComponent(value)}`;
      }
    }

    // Return url
    return urlFilter;
  }
};