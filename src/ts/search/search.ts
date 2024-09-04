import { Params } from "../models.interface";
export const search = {

  // Fetch search suggestions and update alpine variables
  async fetchAndUpdateSearch (
    event: InputEvent, 
    params: Params,
    resources: any
  ) {

    // Reset search focus variables
    this.search_focus_index = '';
    this.search_focus_url = '';

    // Function to build query parameters string
    const buildParams = () => {
      const paramKeys = [
        'author',
        'body',
        'product_type',
        'tag',
        'title',
        'vendor',
      ];

      const variantKeys = [
        'barcode',
        'sku',
        'title'
      ];

      const flattenedParams = paramKeys
        .filter(key => params[key])
        .concat(
          variantKeys
            .filter(key => params.variants && params.variants[key])
            .map(key => `variants.${key}`)
        );

      return flattenedParams.join(',');
    };

    // Function to build resource string
    const buildResources= () => {
      let resourceArr = [];
      for (const [key, value] of Object.entries(resources)) {
        if (value) {
          resourceArr.push(key.toString());
        }
      }
      const resourcesString = resourceArr.join();
      return resourcesString;
    };

    // Extract search term and trim white spaces
    this.search_term = event.target.value.trim();
    this.search_loading = true;

    // If search term is empty or only contains whitespaces, reset search items and stop execution
    if (!this.search_term) {
      this.search_loading = false;
      this.search_items = [];
      this.search_items_collections = [];
      this.search_items_pages = [];
      this.search_items_articles = [];
      this.search_items_queries = [];
      return;
    }

    // Fetch request URL
    const requestUrl = `${window.Shopify.routes.root}search/suggest.json?q=${this.search_term}&resources[type]=${buildResources()}&resources[limit]=6&resources[options][fields]=${buildParams()}`;

    // Get data from shopify
    try {
      const response = await fetch(requestUrl);

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      // Parse response data
      const data = await response.json();


      // Assign data to relevant variables
      const { products, collections, pages, articles, queries } = data.resources.results;
      this.search_items = products ? products : [];
      this.search_items_collections = collections ? collections : [];
      this.search_items_pages = pages ? pages : [];
      this.search_items_articles = articles ? articles : [];
      this.search_items_queries = queries ? queries : [];
      this.search_loading = false;
    } 
    
    // If an error occurred, set the error message and show an alert
    catch (error: any) {
      this.error_message = error.description;
      this.error_alert = true;
    } 

    // Stop loading regardless of whether an error occurred
    finally {
      this.search_loading = false;
      this.search_focus_index = '';
      this.search_focus_url = '';
    }

  },

  // Get total search results
  getSearchItems () {
      const totalResults = [
        ...this.search_items_queries,
         ...this.search_items_pages,
         ...this.search_items_articles,
         ...this.search_items_collections,
         ...this.search_items
      ];
      return totalResults;
  },
  
  // Update selected search index when using arrow keys
  updateSelectedSearch (
      increment: number
    ) {
      const searchItems = this.getSearchItems();
      if (this.search_focus_index === "") {
        this.search_focus_index = 0;
      } else {
        this.search_focus_index = (this.search_focus_index + increment + searchItems.length) % searchItems.length;
      }
      this.search_focus_url = searchItems[this.search_focus_index].url;
  },
  
  // Go to selected search item when using arrow keys
  goToSelectedItem (
      formElement: HTMLFormElement
    ) {
      if (this.search_focus_url === '') {
        formElement.submit();
      }
      else {
        window.location.href = this.search_focus_url;
      }
  }
  
};