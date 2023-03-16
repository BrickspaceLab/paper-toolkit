// setup basic variables
let bsl = {};

// SHOPIFY
// ========
var Shopify = window.Shopify || {};
Shopify.money_format = "${{ amount }}";
Shopify.formatMoney = function (cents, currency) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = currency
    ? `${currency + "{{ amount }}"}`
    : this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

// GLOBAL
// ========
// - expose functions to alpine
window.app = function () {
  return {
    is_scrolled: window.__intialData.is_scrolled,
    prev_scroll_pos: window.__intialData.prev_scroll_pos,
    hide_header: window.__intialData.hide_header,
    menu_drawer: window.__intialData.menu_drawer,
    menu_nested: window.__intialData.menu_nested,
    age_popup: window.__intialData.age_popup,
    filter_popup: window.__intialData.filter_popup,
    localization_popup: window.__intialData.localization_popup,
    scroll_up: window.__intialData.scroll_up,
    scroll_up_force: window.__intialData.scroll_up_force,
    mouse_x: window.__intialData.mouse_x,
    mouse_y: window.__intialData.mouse_y,
    show_alert: window.__intialData.show_alert,
    error_title: window.__intialData.error_title,
    error_message: window.__intialData.error_message,
    animate_index: window.__intialData.animate_index,
    recent_products: window.__intialData.recent_products,
    incomplete_fields: window.__intialData.incomplete_fields,

    cart_drawer: window.__intialData.cart_drawer,
    cart_loading: window.__intialData.cart_loading,
    cart_alert: window.__intialData.cart_alert,
    cart_delay: window.__intialData.cart_delay,
    cart_delay_width: window.__intialData.cart_delay_width,
    cart_behavior: window.__intialData.cart_behavior,
    cart: window.__intialData.cart,
    progress_bar_threshold: window.__intialData.progress_bar_threshold,

    search_loading: window.__intialData.search_loading,
    search_active: window.__intialData.search_active,
    search_items: window.__intialData.search_items,
    search_items_pages: window.__intialData.search_items_pages,
    search_items_collections: window.__intialData.search_items_collections,
    search_items_articles: window.__intialData.search_items_articles,
    search_items_queries: window.__intialData.search_items_queries,

    collection_loading: window.__intialData.collection_loading,
    pagination_total_pages: window.__intialData.pagination_total_pages,
    pagination_current_page: window.__intialData.pagination_current_page,
    pagination_section: window.__intialData.pagination_section,
    filter_min_price: window.__intialData.filter_min_price,
    filter_max_price: window.__intialData.filter_max_price,
    filter_min: window.__intialData.filter_min,
    filter_max: window.__intialData.filter_max,
    filter_min_thumb: window.__intialData.filter_min_thumb,
    filter_max_thumb: window.__intialData.filter_max_thumb,

    // ------------- AGE VERIFICATION
    // - check age (if needed) and record to local storage
    // verifyAge(needsAge, ageLimit, enteredDate) {
    //   // if style is full date, verify that date
    //   if (needsAge) {
    //     // Need to calculate age from the entered date
    //     function parseDate(str) {
    //       var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    //       if (t !== null) {
    //         var d = +t[1],
    //           m = +t[2],
    //           y = +t[3];
    //         var date = new Date(y, m - 1, d);
    //         if (date.getFullYear() === y && date.getMonth() === m - 1) {
    //           return date;
    //         }
    //       }

    //       return null;
    //     }

    //     // if date is incomplete, throw error
    //     const parsedDate = parseDate(enteredDate);
    //     const errorNode = document.querySelector("#ageError");
    //     if (parsedDate === null) {
    //       errorNode.textContent = "Please complete the date form!";
    //     } else {
    //       // Date is good. Now to calculate age from date and compare to age limit
    //       function getAge(dateString) {
    //         var today = new Date();
    //         var birthDate = new Date(dateString);
    //         var age = today.getFullYear() - birthDate.getFullYear();
    //         var m = today.getMonth() - birthDate.getMonth();
    //         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //           age--;
    //         }
    //         return age;
    //       }

    //       const currentAge = getAge(parsedDate);

    //       // if too young
    //       if (currentAge < ageLimit) {
    //         errorNode.textContent = "Sorry, you are too young!";
    //       } else {
    //         localStorage.setItem("agePopupConfirmed", true);
    //         this.age_popup = true;
    //       }
    //     }
    //   } else {
    //     localStorage.setItem("agePopupConfirmed", true);
    //     this.age_popup = true;
    //   }
    // },

    // Check line items values
    checkLineItems(handle) {
      const inputs = document.querySelectorAll(`.custom-input_${handle}`);
      const inputsArr = Array.from(inputs);
      const requiredFields = inputsArr.filter((inp) => inp.required);

      if (requiredFields.some((field) => field.value === "")) {
        this.incomplete_fields = true;
      } else {
        this.incomplete_fields = false;
      }
    },

    // ------------ CART
    // - fetch cart then update alpine variables and trigger cart action
    updateCart(openCart) {
      this.cart_loading = true;
      fetch("/cart.js", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // shopify things
          this.cart.items = data.items;
          this.cart.item_count = data.item_count;
          this.cart.total_price = data.total_price;
          this.cart.original_total_price = data.original_total_price;
          this.cart.total_discount = data.total_discount;
          this.cart.cart_level_discount_applications =
            data.cart_level_discount_applications;
          
          // custom properties
          this.cart.shipping_gap =
            (this.progress_bar_threshold * (Shopify.currency.rate || 1))  - this.cart.total_price;
          this.cart.shipping_progress =
            (this.cart.total_price / (this.progress_bar_threshold * (Shopify.currency.rate || 1))) * 100 + "%";

          // finish loading
          setTimeout(() => {
            this.cart_loading = false;
          }, 300);
          

          // open cart if set
          if (openCart == true) {
            this.cart_delay_width = "0%";
            if (this.cart_behavior == "alert") {
              this.cart_alert = true;
              setTimeout(() => {
                this.cart_delay_width = "100%";
              }, 10);
              setTimeout(() => {
                this.cart_alert = false;
              }, this.cart_delay);
            }
            if (this.cart_behavior == "drawer") {
              this.cart_drawer = true;
            }
            if (this.cart_behavior == "redirect") {
              window.location.href = "/cart";
            }
          }

          // hide upsells
          // HIDDEN UNTIL WE FIGURE OUT WHY THIS BREAKS THE SLIDER
          // document
          //   .querySelectorAll(".upsell")
          //   .forEach(function (el) {
          //     el.classList.remove("hidden");
          //   });
          // this.cart.items.forEach(function (item) {
          //   document
          //     .querySelectorAll(
          //       ".upsell--" + item.product_id
          //     )
          //     .forEach(function (el) {
          //       el.classList.add("hidden");
          //     });
          // });
        })
        .catch((error) => {
          console.error("Error:", error);
          this.cart_loading = false;
        });
    },

    // - call change.js to update cart item then use updateCart()
    changeCartItemQuantity(key, quantity, openCart, refresh) {
      this.cart_loading = true;
      let formData = {
        id: key.toString(),
        quantity: quantity.toString(),
      };

      fetch("/cart/change.js", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.cart.items = data.items.map((item) => {
            return {
              ...item,
            };
          });
          if (refresh) {
            window.location.reload();
          } else {
            this.updateCart(openCart);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.cart_loading = false;
        });
    },

    // - call add.js to add cart item then use updateCart()
    addCartItem(variantID, sellingPlanId, quantity, openCart, properties) {
      this.cart_loading = true;
      let formData;
      let propertiesArr = [];
      let propertiesObj;

      if (properties) {
        for (const property of properties) {
          propertiesArr.push([property.name, property.value]);
        }
        if (propertiesArr.length > 0) {
          propertiesObj = Object.fromEntries(propertiesArr);
        }
      }

      // update formData if sellingPlanId is available
      if (sellingPlanId == 0) {
        formData = {
          items: [
            {
              id: variantID,
              quantity: quantity,
              properties: propertiesObj,
            },
          ],
        };
      } else {
        formData = {
          items: [
            {
              id: variantID,
              quantity: quantity,
              selling_plan: sellingPlanId,
              properties: propertiesObj,
            },
          ],
        };
      }

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          let data = await response.json();

          // good response
          if (response.status === 200) {
            // this.cart.items = data.items.map((item) => {
            //   return {
            //     ...item,
            //   };
            // });
            this.updateCart(openCart);
          }

          // error response
          else {
            (this.error_title = data.message),
              (this.error_message = data.description),
              (this.show_alert = true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.cart_loading = false;
        });
    },

    // - add multiple itmes to cart, used for cart sharing
    addCartItems(items, clear = false) {
      this.cart_loading = true;
      let formData = {
        items: items,
      };

      if (clear) {
        this.cart_loading = true;

        fetch("/cart/clear.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            this.updateCart(true);
          })
          .then(() => {
            fetch("/cart/add.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }).then(async (response) => {
              let data = await response.json();

              if (response.status === 200) {
                // this.cart.items = data.items.map((item) => {
                //   return {
                //     ...item,
                //   };
                // });
                this.updateCart(true);
              } else {
                (this.error_title = data.message),
                  (this.error_message = data.description),
                  (this.show_alert = true);
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            this.cart_loading = false;
          });
      } else {
        fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then(async (response) => {
            let data = await response.json();

            if (response.status === 200) {
              this.cart.items = data.items.map((item) => {
                return {
                  ...item,
                };
              });
              this.updateCart(true);
            } else {
              (this.error_title = data.message),
                (this.error_message = data.description),
                (this.show_alert = true);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            this.cart_loading = false;
          });
      }
    },

    // - add items to cart if cartshare url available
    handleSharedCart: function () {
      if (location.search.indexOf("cartshare") >= 0) {
        let query = location.search.substring(1);
        let qArray = query.split("&");
        let objArr = qArray.map((item) => {
          if (item != "") {
            var properties = item.split(",");
            var obj = {};
            properties.forEach(function (property) {
              var tup = property.split(":");
              obj[tup[0]] = tup[1];
            });
            return obj;
          }
        });
        this.addCartItems(objArr, true);
      }
    },

    // generate url with query string based on cart contents
    generateUrl: function () {
      let queryString = "";

      let serialize = function (obj) {
        var str = [];
        for (var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + ":" + encodeURIComponent(obj[p]));
          }
        return str.join(",") + "&";
      };

      const filteredCart = this.cart.items.map((item) => {
        return (item = {
          cartshare: true,
          id: item.variant_id,
          quantity: item.quantity,
        });
      });

      filteredCart.forEach((item) => {
        queryString = queryString.concat(serialize(item));
      });
      return window.location.origin + "?" + queryString;
    },

    // ------------ SEARCH
    // - get search suggestions and update alpine variables
    fetchAndUpdateSearch(event, params) {
      const buildParams = () => {
        let paramsArr = [];
        for(const[key, value] of Object.entries(params)) {
          if(value) {
            paramsArr.push(key.toString())
          }
        }
        const paramsString = paramsArr.join()
        return paramsString;
      }
      const searchTerm = event.target.value;

      this.search_loading = true;
      if (searchTerm.length === 0 || !searchTerm.replace(/\s/g, "").length) {
        this.search_loading = false;
        this.search_items = [];
        return;
      }

      fetch(
        `/search/suggest.json?q=${searchTerm}&resources[type]=product,collection,article,page,query&resources[limit]=6&[options][fields]=${buildParams()}&section_id=predictive-search`
      )
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
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
          this.search_items = products;
          this.search_items_collections = collections;
          this.search_items_pages = pages;
          this.search_items_articles = articles;
          this.search_items_queries = queries;
          this.search_loading = false;
        })
        .catch((error) => {
          (this.error_title = error.message),
            (this.error_message = error.description),
            (this.show_alert = true),
            this.close();
          throw error;
        });
    },

    // ------------ COLLECTIONS
    // - load quick add with section render
    fetchAndRenderQuickAdd: function (product_handle, template) {
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
          ).innerHTML = html;
        });
    },

    // - handle filter changes on max price
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

    // - handle filter changes on min price
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

    // handle filter change
    handleFilterChange: function (id) {
      // show loading indication
      this.collection_loading = true;

      // reset pagination
      this.pagination_current_page = 1;

      // get filter data
      let filter = document.getElementById(id);
      let filterData = new FormData(filter);

      this.fetchAndRenderCollection(filterData);
    },

    // handle deleting filters
    handleFilterDelete: function (filterToReset) {
      // show loading indication
      this.collection_loading = true;

      // get filter data
      let filter = document.getElementById("js:desktopFilter");
      let filterData = new FormData(filter);

      // remove deleted filter
      filterData.delete(filterToReset);
      if (filterToReset.indexOf("price") !== -1) {
        filterData.delete("filter.v.price.gte");
        filterData.delete("filter.v.price.lte");
        this.filter_min_price = this.filter_min;
        this.filter_max_price = this.filter_max;
      }

      this.fetchAndRenderCollection(filterData);
    },

    // handle deleting filters
    handleFilterDeleteAll: function () {
      // show loading indication
      this.collection_loading = true;

      // reset filterData
      let filterData = new FormData();

      this.fetchAndRenderCollection(filterData);
    },

    // build urlFilter
    buildUrlFilter: function (filterData) {
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

    // call section render api with data from filter
    fetchAndRenderCollection: function (filterData) {
      // go back to top
      var element = document.getElementById("js:top");
      if (element) {element.scrollIntoView();}

      // loop through form data and build url
      let filterUrl = this.buildUrlFilter(filterData);

      // get search term
      let searchUrl = new URL(location.href).searchParams.get("q");
      searchUrl = "&q=" + searchUrl;

      // update page url
      history.pushState(
        null,
        null,
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
          ).innerHTML = html;
          setTimeout(() => {
            this.collection_loading = false;
          }, 100);
        });
    },

    // check if next page is avaible and inject more products
    fetchAndRenderNextPage: function () {
      // check if new page is available
      if (this.pagination_current_page < this.pagination_total_pages) {
        // show loading
        this.collection_loading = true;

        // get filter data
        let filter = document.getElementById("js:desktopFilter");

        // get pagination count
        let pageUrl = "&page=" + (this.pagination_current_page + 1);

        // get search thingy
        let searchUrl = new URL(location.href).searchParams.get("q");
        searchUrl = "&q=" + searchUrl;

        // build fetch url
        let fetchUrl = "";
        if (filter) {
          let filterData = new FormData(filter);
          let filterUrl = this.buildUrlFilter(filterData);

          fetchUrl =
            window.location.pathname +
            "?section_id=" +
            this.pagination_section +
            filterUrl +
            pageUrl +
            searchUrl;
        } else {
          fetchUrl =
            window.location.pathname +
            "?section_id=" +
            this.pagination_section +
            pageUrl +
            searchUrl;
        }

        // load new page with filters and sort
        fetch(fetchUrl)
          .then((response) => response.text())
          .then((responseText) => {
            // extract products and inject into grid
            let html = document.createElement("div");
            html.innerHTML = responseText;
            let htmlCleaned = html.querySelector("#js\\:results").innerHTML;
            document
              .getElementById("js:results")
              .insertAdjacentHTML("beforeend", htmlCleaned);
            setTimeout(() => {
              this.collection_loading = false;
            }, 100);

            // update next page url
            this.pagination_current_page = this.pagination_current_page + 1;
          });
      }

      // if last pgae
      else {
        this.collection_loading = false;
      }
    },

    // ------------ EXTRAS
    // copy value of input to clipboard and focus element
    copyToClipboard: function (id) {
      var copyText = document.getElementById(id);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);
    },
  };
};

// ========
// - utility functions
bsl.utiltiy = {
  // check if element is in viewport
  // isInViewport: function (elem) {
  //   var bounding = elem.getBoundingClientRect();
  //   return (
  //     bounding.top >= 0 &&
  //     bounding.left >= 0 &&
  //     bounding.bottom <=
  //       (window.innerHeight ||
  //         document.documentElement.clientHeight) &&
  //     bounding.right <=
  //       (window.innerWidth ||
  //         document.documentElement.clientWidth)
  //   );
  // },
  // setCookie: function (name, value, days) {
  //   var expires = "";
  //   if (days) {
  //     var date = new Date();
  //     date.setTime(
  //       date.getTime() + days * 24 * 60 * 60 * 1000
  //     );
  //     expires = "; expires=" + date.toUTCString();
  //   }
  //   document.cookie =
  //     name + "=" + (value || "") + expires + "; path=/";
  // },
  // getCookie: function (name) {
  //   var nameEQ = name + "=";
  //   var ca = document.cookie.split(";");
  //   for (var i = 0; i < ca.length; i++) {
  //     var c = ca[i];
  //     while (c.charAt(0) == " ")
  //       c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) == 0)
  //       return c.substring(nameEQ.length, c.length);
  //   }
  //   return null;
  // },
  // eraseCookie: function (name) {
  //   document.cookie =
  //     name +
  //     "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  // },
  // replaceUrl: function (name, value) {
  //   var str = location.search;
  //   if (
  //     new RegExp("[&?]" + name + "([=&].+)?$").test(str)
  //   ) {
  //     str = str.replace(
  //       new RegExp("(?:[&?])" + name + "[^&]*", "g"),
  //       ""
  //     );
  //   }
  //   str += "&";
  //   str += name + "=" + value;
  //   str = "?" + str.slice(1);
  //   location.assign(
  //     location.origin +
  //       location.pathname +
  //       str +
  //       location.hash
  //   );
  // },
};

// ATOMS
// ========
// - use bsl.animation to replace and update classes when in view
bsl.animation = {
  init: function () {
    // Setup IntersectionObserver to add classes on scroll
    // credit: https://onesheep.org/insights/animate-on-scroll-with-tailwind-css
    // credit: https://devdojo.com/tnylea/animating-tailwind-transitions-on-page-load
    // observerCallback for IntersectionObserver
    const observerCallback = function (entries) {
      entries.forEach((entry) => {
        let element = document.getElementById(entry.target.dataset.id);

        // Add the fadeIn class:
        if (entry.isIntersecting) {
          let replaceClasses = JSON.parse(
            entry.target.dataset.replace.replace(/'/g, '"')
          );
          let delay = entry.target.dataset.delay;

          let callback = entry.target.dataset.callback;
          var x = eval(callback);
          if (typeof x == "function") {
            x();
          }

          Object.keys(replaceClasses).forEach(function (key) {
            setTimeout(function () {
              if (element) {
                element.classList.remove(key);
                element.classList.add(replaceClasses[key]);
              } else {
                entry.target.classList.remove(key);
                entry.target.classList.add(replaceClasses[key]);
              }
            }, delay);
          });
        }
      });
    };
    const animationElements = document.querySelectorAll(".js\\:animation");
    const animationObserver = new IntersectionObserver(observerCallback);
    animationElements.forEach(function (target) {
      animationObserver.observe(target);
    });
  },
};

// INITILIZE ATOMS
// ========
bsl.animation.init();
