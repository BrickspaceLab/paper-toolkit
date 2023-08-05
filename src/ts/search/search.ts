import { Params } from "../models.interface";
export const search = {

  // Fetch search suggestions and update alpine variables
  fetchAndUpdateSearch(event: InputEvent, params: Params, resources: any) {
    // Build query parameters string
    const buildParams = () => {
      let paramsArr = [];
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          paramsArr.push(key.toString());
        }
      }
      const paramsString = paramsArr.join();
      return paramsString;
    };

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

    const searchTerm = (event.target as HTMLInputElement).value;

    this.search_loading = true;
    if (searchTerm.length === 0 || !searchTerm.replace(/\s/g, "").length) {
      this.search_loading = false;
      this.search_items = [];
        this.search_items_collections = [];
        this.search_items_pages = [];
        this.search_items_articles = [];
        this.search_items_queries = [];
      return;
    }
    fetch(
      `${window.Shopify.routes.root}search/suggest.json?q=${searchTerm}&resources[type]=${buildResources()}&resources[limit]=6&[options][fields]=${buildParams()}&section_id=predictive-search`
    )
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status.toString());
          // this.close();
          throw error;
        }

        return response.json();
      })
      .then((data) => {
        let collections = data.resources.results.collections;
        let pages = data.resources.results.pages;
        let products = data.resources.results.products;
        let articles = data.resources.results.articles;
        let queries = data.resources.results.queries;
        this.search_items = products ? products : [];
        this.search_items_collections = collections ? collections : [];
        this.search_items_pages = pages ? pages : [];
        this.search_items_articles = articles ? articles : [];
        this.search_items_queries = queries ? queries : [];
        this.search_loading = false;
      })
      .catch((error) => {
        (this.error_title = error.message),
          (this.error_message = error.description),
          (this.show_alert = true);
        // this.close();
        throw error;
      });
  },
  
};