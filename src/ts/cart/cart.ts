import { Product } from "../models.interface";
export const cart = {
  
  // Update cart with fetched data
  updateCart(openCart: boolean) {
    this.cart_loading = true;

    fetch("/cart.js", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Shopify properties
        this.cart.items = data.items;
        this.cart.item_count = data.item_count;
        this.cart.total_price = data.total_price;
        this.cart.original_total_price = data.original_total_price;
        this.cart.total_discount = data.total_discount;
        this.cart.cart_level_discount_applications =
          data.cart_level_discount_applications;

        // Custom properties
        this.cart.shipping_gap =
          this.progress_bar_threshold * (+window.Shopify.currency.rate || 1) -
          this.cart.total_price;
        this.cart.shipping_progress =
          (this.cart.total_price /
            (this.progress_bar_threshold * (+window.Shopify.currency.rate || 1))) *
            100 +
          "%";

        // Finish loading
        setTimeout(() => {
          this.cart_loading = false;
        }, 300);

        // Open cart if set
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
      })
      .catch((error) => {
        console.error("Error:", error);
        this.cart_loading = false;
      });
  },

  // Call change.js to update cart item then use updateCart()
  changeCartItemQuantity(
    key: number,
    quantity: number,
    openCart: boolean,
    refresh: boolean
  ) {
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
        this.cart.items = data.items.map((item: Product) => {
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

  // Call add.js to add cart item then use updateCart()
  addCartItem(
    variantID: number,
    sellingPlanId: number,
    quantity: number,
    openCart: boolean,
    properties: HTMLCollectionOf<HTMLInputElement>
  ) {
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

    // Update formData if sellingPlanId is available
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

        // Good response
        if (response.status === 200) {
          this.updateCart(openCart);
        }

        // Error response
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

  // Add multiple items to cart, used for cart sharing
  addCartItems(items: Product[], clear = false) {
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
            this.cart.items = data.items.map((item: Product) => {
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

  // Add items to cart if cartshare url available
  handleSharedCart() {
    if (location.search.indexOf("cartshare") >= 0) {
      let query = location.search.substring(1);
      let qArray = query.split("&");
      let objArr = qArray.map((item) => {
        if (item != "") {
          var properties = item.split(",");
          var obj: { [key: string]: string } = {};
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

  // Generate url with query string based on cart contents

  
  generateUrl(): string {
    interface ICartItem {
      cartshare: boolean;
      id: number;
      quantity: number;
    }
    
    type StringIndexable<T> = T & { [key: string]: string | number | boolean };
    let queryString = '';
  
    const serialize = function (obj: StringIndexable<ICartItem>): string {
      const str = [];
      for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(`${encodeURIComponent(p)}:${encodeURIComponent(obj[p].toString())}`);
        }
      }
      return str.join(',') + '&';
    };
  
    const filteredCart = this.cart.items.map((item: Product) => {
      return ({
        cartshare: true,
        id: item.variant_id,
        quantity: item.quantity,
      });
    });
  
    filteredCart.forEach((item: StringIndexable<ICartItem>) => {
      queryString = queryString.concat(serialize(item));
    });
    return window.location.origin + '?' + queryString;
  },
  

};