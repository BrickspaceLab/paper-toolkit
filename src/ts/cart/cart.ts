import { Product } from "../models.interface";
export const cart = {
  
  // Update cart with note input
    updateCartNote(note: string) {
      this.cart_loading = true;
      fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: note }),
      })
        .then(async (response) => {
          let data = await response.json();

          // good response
          if (response.status === 200) {
            this.cart.items = data.items.map((item:Product) => {
              return {
                ...item,
              };
            });
            this.updateCart(false);
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
          this.cart.note = data.note;
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
          this.button_loading = false;
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

  // Edit cart item
  editCartItem(
    oldKey: number,
    newKey: number,
    sellingPlanId: number,
    quantity: number,
    openCart: boolean
  ) { 
    if(this.enable_audio) {
      this.playSound(this.click_audio);
    }

    this.cart_loading = true;


    // Remove old item
    let formData = {
      id: oldKey.toString(),
      quantity: "0",
    };  
    fetch("/cart/change.js", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        let formData;
        if(sellingPlanId == 0) {
          formData = {
            id: newKey.toString(),
            quantity: quantity.toString()
          };
        } else {
          formData = {
            id: newKey.toString(),
            quantity: quantity.toString(),
            selling_plan: sellingPlanId.toString(),
          };
        }
        // Add new item
        
        fetch("/cart/add.js", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          let data = await response.json();
  
          // Good response
          if (response.status === 200) {
            if(this.enable_audio){
              this.playSound(this.success_audio);
              }
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
      })

  },

  // Call change.js to update cart item then use updateCart()
  changeCartItemQuantity(
    key: number,
    quantity: number,
    openCart: boolean,
    refresh: boolean
  ) {
    if(this.enable_audio) {
      this.playSound(this.click_audio);
    }

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
        if(data.status === 422 ) {
          this.error_title = data.message,
          this.error_message = data.description,
          this.show_alert = true;
          this.cart_loading = false;
        }
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

  addCartItem(form: any, bundle = false) {
    if(this.enable_audio) {
      this.playSound(this.click_audio);
    }
    this.button_loading = true;
    this.cart_loading = true;
    let formData = new FormData(form);

    // if product is a bundle
    let productArray = [];
    if(bundle) {
      // create array of product ids
      for (var pair of formData.entries()) {
        if(pair[0].includes('bundle_option')) {
          productArray.push({id:pair[1], quantity: 1})
        }
      }
    }

    // check if selling plan is available
    let sellingPlanId = formData.get("selling_plan") as number | string;
    // get all custom properties from the formData
    let propertiesArr = [];
    let propertiesObj;
    for (const pair of formData.entries()) {
      if(pair[0].includes("properties")) {
        let name = pair[0].replace("properties[", "").replace("]", "");
        propertiesArr.push([name, pair[1]]);
      }
    }
    if (propertiesArr.length > 0) {
      propertiesObj = Object.fromEntries(propertiesArr);
    }
    // gift card recipient
    let recipientCheckbox =  document.querySelector(`#recipient-checkbox`) as HTMLInputElement;
    let recipientObj;
    if(recipientCheckbox && recipientCheckbox.checked) {
    let recipientName =  document.querySelector(`#recipient-name`) as HTMLInputElement;
    let recipientEmail =  document.querySelector(`#recipient-email`) as HTMLInputElement;
    let recipientMessage =  document.querySelector(`#recipient-message`) as HTMLInputElement;

    // throw error if name or email are empty
    if(!recipientName.value || !recipientEmail.value) {
      this.error_title = "Error",
      this.error_message = "Please fill out name and email of gift card recepient",
      this.show_alert = true;
      this.cart_loading = false;
      return;
    }

    recipientObj = {
      "Recipient email": recipientEmail.value,
      "Recipient name": recipientName.value,
      "Message": recipientMessage.value,
      "__shopify_send_gift_card_to_recipient": "on",
    }
  }
    let reqBody;
      if(bundle) {
        reqBody = {
          items: [...productArray]}
      } else if(sellingPlanId == 0) {
        reqBody = {items: [
          {
            id: formData.get("id"),
            quantity: formData.get("quantity"),
            properties: {
              ...propertiesObj,
              ...recipientObj
            },
          },
        ]}
      } else {
        reqBody = {items: [
          {
            id: formData.get("id"),
            quantity: formData.get("quantity"),
            selling_plan: sellingPlanId,
            properties: {
              ...propertiesObj,
              ...recipientObj
            },
          },
        ]}
      }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then(async (response) => {
        let data = await response.json();

        // Good response
        if (response.status === 200) {
          if(this.enable_audio){
            this.playSound(this.success_audio);
            }
          this.updateCart(true);
        }

        // Error response
        else {
          (this.error_title = data.message),
            (this.error_message = data.description),
            (this.show_alert = true);
            this.cart_loading = false;
            this.button_loading = false;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.cart_loading = false;
      });
  },

  // Call add.js to add cart item then use updateCart()
  addWithId(
    variantID: number,
    sellingPlanId: number,
    quantity: number,
    openCart: boolean,
    giftCardRecipient: boolean,
    productHandle: string
    ) {
    if(this.enable_audio) {
      this.playSound(this.click_audio);
    }

    this.cart_loading = true;
    let formData;
    let propertiesArr = [];
    let propertiesObj;

    let properties =  document.getElementsByClassName(`custom-input_${productHandle}`) as  HTMLCollectionOf<HTMLInputElement>;

    if (properties) {
      for (const property of properties) {
        propertiesArr.push([property.name, property.value]);
      }
      if (propertiesArr.length > 0) {
        propertiesObj = Object.fromEntries(propertiesArr);
      }
    }

    // gift card recipient
      let recipientCheckbox =  document.querySelector(`#recipient-checkbox`) as HTMLInputElement;
      let recipientObj;
      if(giftCardRecipient && recipientCheckbox.checked) {
      let recipientName =  document.querySelector(`#recipient-name`) as HTMLInputElement;
      let recipientEmail =  document.querySelector(`#recipient-email`) as HTMLInputElement;
      let recipientMessage =  document.querySelector(`#recipient-message`) as HTMLInputElement;

      // throw error if name or email are empty
      if(!recipientName.value || !recipientEmail.value) {
        this.error_title = "Error",
        this.error_message = "Please fill out name and email of gift card recepient",
        this.show_alert = true;
        this.cart_loading = false;
        return;
      }

      recipientObj = {
        "Recipient email": recipientEmail.value,
        "Recipient name": recipientName.value,
        "Message": recipientMessage.value,
        "__shopify_send_gift_card_to_recipient": "on",
      }

    }

    // Update formData if sellingPlanId is available
    if (sellingPlanId == 0) {
      formData = {
        items: [
          {
            id: variantID,
            quantity: quantity,
            properties: {
              ...propertiesObj,
              ...recipientObj
            },
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
          if(this.enable_audio){
            this.playSound(this.success_audio);
            }
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