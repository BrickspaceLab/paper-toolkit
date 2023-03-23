export const collections = {

  // Load quick add with section render
  fetchAndRenderQuickAdd: function (product_handle: string, template: string) {
    fetch(
      window.Shopify.routes.root +
        "products/" +
        product_handle +
        "?section_id=quick-add"
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        document.getElementById(
          "js:quickAdd-" + template + "-" + product_handle
        )!.innerHTML = html;
      });
  },

  // Handle filter changes on max price
  handleMaxPriceFilter: function () {
    this.filter_max_price = Math.max(
      this.filter_max_price,
      this.filter_min_price
    );
    this.filter_max_thumb =
      100 -
      ((this.filter_max_price - this.filter_min) /
        (this.filter_max - this.filter_min)) *
        100;
  },

  // Handle filter changes on min price
  handleMinPriceFilter: function () {
    this.filter_min_price = Math.min(
      this.filter_min_price,
      this.filter_max_price
    );
    this.filter_min_thumb =
      ((this.filter_min_price - this.filter_min) /
        (this.filter_max - this.filter_min)) *
      100;
  },

  // Handle filter change
  handleFilterChange: function (id: string) {
    // Show loading indication
    this.collection_loading = true;

    // Reset pagination
    this.pagination_current_page = 1;

    // Get filter data
    let filter = document.getElementById(id);
    let filterData = new FormData(filter as any);

    this.fetchAndRenderCollection(filterData);
  },

  // Handle deleting filters
  handleFilterDelete: function (filterToReset: string) {
    // Show loading indication
    this.collection_loading = true;

    // Get filter data
    let filter = document.getElementById("js:desktopFilter");
    let filterData = new FormData(filter as any);

    // Remove deleted filter
    filterData.delete(filterToReset);
    if (filterToReset.indexOf("price") !== -1) {
      filterData.delete("filter.v.price.gte");
      filterData.delete("filter.v.price.lte");
      this.filter_min_price = this.filter_min;
      this.filter_max_price = this.filter_max;
    }

    this.fetchAndRenderCollection(filterData);
  },

  // Handle deleting all filters
  handleFilterDeleteAll: function () {
    // Show loading indication
    this.collection_loading = true;

    // Reset filterData
    let filterData = new FormData();

    this.fetchAndRenderCollection(filterData);
  },

  // Build urlFilter
  buildUrlFilter: function (filterData: FormData) {
    let urlFilter = "";
    for (var pair of filterData.entries()) {
      if (pair[0].indexOf("price") !== -1) {
        if (pair[0] === "filter.v.price.lte") {
          if (pair[1] < this.filter_max) {
            urlFilter = urlFilter + "&" + pair[0] + "=" + pair[1];
          }
        }
        if (pair[0] === "filter.v.price.gte") {
          if (pair[1] > this.filter_min) {
            urlFilter = urlFilter + "&" + pair[0] + "=" + pair[1];
          }
        }
      } else {
        urlFilter = urlFilter + "&" + pair[0] + "=" + pair[1];
      }
    }
    return urlFilter;
  },

  // Call section render API with data from filter
  fetchAndRenderCollection: function (filterData: FormData) {
    // Go back to top
    var element = document.getElementById("js:top");
    if (element) {
      element.scrollIntoView();
    }

    // Loop through form data and build url
    let filterUrl = this.buildUrlFilter(filterData);

    // Get search term
    let searchUrl = new URL(location.href).searchParams.get("q");
    searchUrl = "&q=" + searchUrl;

    // Update page url
    history.pushState(
      null,
      "",
      window.location.pathname + "?" + filterUrl + searchUrl
    );

    fetch(
      window.location.pathname +
        "?section_id=" +
        this.pagination_section +
        filterUrl +
        searchUrl
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        document.getElementById(
          "shopify-section-" + this.pagination_section + ""
        )!.innerHTML = html;
        setTimeout(() => {
          this.collection_loading = false;
        }, 100);
      });
  },

};