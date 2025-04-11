import { Product } from "../models.interface";
export const cart = {
  updateCartNote(note: string) {
    this.cart_loading = true;
    fetch(`${window.Shopify.routes.root}cart/update.js`, {
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
          this.cart.items = data.items.map((item: Product) => {
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
  async updateCart(openCart: boolean) {
    // Reset global properties
    this.cart_loading = true;
    this.enable_body_scrolling = true;

    // Get data from shopify
    try {
      const response = await fetch(`${window.Shopify.routes.root}cart.js`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse response data
      const data = await response.json();

      // Shopify properties
      this.cart.items = data.items;
      this.cart.item_count = data.item_count;
      this.cart.total_price = data.total_price;
      this.cart.original_total_price = data.original_total_price;
      this.cart.total_discount = data.total_discount;
      this.cart.cart_level_discount_applications =
        data.cart_level_discount_applications;

      // Progress bar calculation
      let calcTotal;
      if (this.cart.progress_bar_calculation === "total") {
        calcTotal = this.cart.total_price;
      } else {
        calcTotal = this.cart.original_total_price;
      }
      this.cart.progress_bar_remaining =
        this.progress_bar_threshold * (+window.Shopify.currency.rate || 1) -
        calcTotal;
      this.cart.progress_bar_percent =
        (calcTotal /
          (this.progress_bar_threshold *
            (+window.Shopify.currency.rate || 1))) *
          100 +
        "%";

      // Reset cart loading
      setTimeout(() => {
        this.cart_loading = false;
      }, 200);

      // Unhide upsells
      const cartUpsells = document.querySelectorAll(".js-upsell");
      cartUpsells.forEach(function (target) {
        target.style.display = "flex";
      });

      // Hide upsells
      this.cart.items.forEach((item) => {
        const upsellElements = document.querySelectorAll(
          ".js-upsell-" + item.product_id,
        );
        upsellElements.forEach((element) => {
          element.style.display = "none";
        });
      });

      // Open cart if set
      if (openCart) {
        // Hide other overlapping overlays
        this.menu_drawer = false;
        this.age_popup = false;
        this.audio_popup = false;
        this.discount_popup = false;
        this.filter_popup = false;
        this.localization_popup = false;

        // Set cart behavior to alert, drawer or redirect
        let cart_behavior;
        if (window.innerWidth < 768) {
          cart_behavior = this.cart_behavior_mobile;
        } else {
          cart_behavior = this.cart_behavior_desktop;
        }

        // Display different cart elements
        switch (cart_behavior) {
          case "alert":
            if (this.cart_drawer) {
              return;
            } else {
              this.cart_alert = true;
              this.cart.alert_delay = "0%";
              setTimeout(() => {
                this.cart.alert_delay = "100%";
              }, 100);
              setTimeout(() => {
                this.cart.alert_delay = "0%";
                this.cart_alert = false;
              }, 4100);
            }

            break;
          case "drawer":
            this.cart_drawer = true;
            break;
          case "redirect":
            window.location.href = "/cart";
            break;
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      this.cart_loading = false;
    }
  },

  // Call change.js to update cart item then use updateCart()
  async changeCartItemQuantity(
    key: number,
    quantity: number,
    openCart: boolean,
    refresh: boolean,
  ) {
    // Play audio
    this.playAudioIfEnabled(this.click_audio);

    // Show loading state
    this.cart_loading = true;

    // Set data for fetch call
    let formData = {
      id: key.toString(),
      quantity: quantity.toString(),
    };

    // Get data from shopify
    try {
      const response = await fetch(
        `${window.Shopify.routes.root}cart/change.js`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Parse response data
      const data = await response.json();

      // If the response status is 200, the item was added successfully
      if (response.status === 200) {
        // Play success audio if enabled
        this.playAudioIfEnabled(this.success_audio);

        // Update the cart
        this.updateCart(openCart);
      }

      // If the response status is not 200, there was an error adding the item
      else {
        // Set the error message and show the error alert
        this.error_message = data.description;
        this.show_alert = true;
        this.cart_loading = false;
        return;
      }

      // Update cart items
      this.cart.items = data.items.map((item: Product) => ({ ...item }));

      // Refresh and update cart
      if (refresh) {
        window.location.reload();
      } else {
        this.playAudioIfEnabled(this.success_audio);
        this.updateCart(openCart);
      }
    } catch (error: any) {
      console.error("Error:", error);
      this.cart_loading = false;
    }
  },

  // Load quick add with section render
  async fetchAndRenderQuickEdit(
    product_handle: string,
    template: string,
    variantId: number,
    quantity: number,
  ) {
    // Update global edit variables
    this.edit_variant = variantId;
    this.edit_quantity = quantity;

    // Update which edit popup is shown
    this.quick_edit_handle = product_handle;

    // Get data from Shopify
    try {
      const response = await fetch(
        `${window.Shopify.routes.root}products/${product_handle}?section_id=quick-edit&variant=${variantId}`
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // catpure data from fetch
      const responseHtml = await response.text();

      // disable body scrolling when quick add is visible
      this.enable_body_scrolling = false;

      // Get quick add container and inject new
      const quickAddContainer = document.getElementById(
        `js-quickEdit-${template}-${product_handle}`,
      );
      if (quickAddContainer) {
        this.quick_edit_popup = true;
        quickAddContainer.innerHTML = responseHtml;
      } else {
        console.error(
          `Element 'js-quickEdit-${template}-${product_handle}' not found.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  },

  // Load quick add with section render
  async fetchAndRenderQuickAdd(product_handle: string, template: string) {
    // Update which edit popup is shown
    this.quick_add_handle = product_handle;

    // Get data from Shopify
    try {
      const response = await fetch(
        `${window.Shopify.routes.root}products/${product_handle}?section_id=quick-add`,
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // catpure data from fetch
      const responseHtml = await response.text();

      // disable body scrolling when quick add is visible
      this.enable_body_scrolling = false;

      // Get quick add container and inject new
      const quickAddContainer = document.getElementById(
        `js-quickAdd-${template}-${product_handle}`,
      );
      if (quickAddContainer) {
        this.quick_add_popup = true;
        quickAddContainer.innerHTML = responseHtml;
      } else {
        console.error(
          `Element 'js-quickAdd-${template}-${product_handle}' not found.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  },

  // Call add.js to add cart item then use updateCart()
  async editCartItem(
    oldQuantity: number,
    oldVariantId: number,
    newVariantId: number,
    sellingPlanId: number,
  ) {
    this.cart_loading = true;
    this.enable_body_scrolling = true;
    this.playAudioIfEnabled(this.click_audio);

    // Item to remove
    let oldFormData = {
      id: oldVariantId.toString(),
      quantity: "0",
    };

    // Item to add
    let newFormData =
      sellingPlanId == 0
        ? {
            id: newVariantId.toString(),
            quantity: oldQuantity.toString(),
          }
        : {
            id: newVariantId.toString(),
            quantity: oldQuantity.toString(),
            selling_plan: sellingPlanId.toString(),
          };

    try {
      // Remove item
      const oldResponse = await fetch(
        `${window.Shopify.routes.root}cart/change.js`,
        {
          method: "POST",
          body: JSON.stringify(oldFormData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!oldResponse.ok) {
        throw new Error(`HTTP error! status: ${oldResponse.status}`);
      }

      // Add item
      const addResponse = await fetch(
        `${window.Shopify.routes.root}cart/add.js`,
        {
          method: "POST",
          body: JSON.stringify(newFormData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!addResponse.ok) {
        throw new Error(`HTTP error! status: ${addResponse.status}`);
      }

      const data = await addResponse.json();

      // Good response
      if (addResponse.status === 200) {
        this.playAudioIfEnabled(this.success_audio);
        this.updateCart(false);
      }

      // Error response
      else {
        this.error_message = data.description;
        this.show_alert = true;
      }
    } catch (error) {
      console.error("Error:", error);
      this.cart_loading = false;
    }
  },

  // Add multiple items to cart, used for cart sharing
  async addCartItems(items: CartItem[]) {
    this.cart_loading = true;
    this.playAudioIfEnabled(this.click_audio);

    // Loop through each item and add it to the cart
    for (const item of items) {
      await this.addCartItem(item.variantId, 0, item.quantity, false, false);
    }

    this.cart_loading = false;
    this.updateCart(true);
    this.playAudioIfEnabled(this.success_audio);
  },

  // Call add.js to add cart item then use updateCart()
  async addCartItem(
    variantID: number,
    sellingPlanId: number,
    quantity: number,
    openCart: boolean,
  ) {
    this.playAudioIfEnabled(this.click_audio);
    let formData;

    // Update formData if sellingPlanId is available
    if (sellingPlanId == 0) {
      formData = {
        items: [
          {
            id: variantID,
            quantity: quantity,
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
          },
        ],
      };
    }

    return fetch(`${window.Shopify.routes.root}cart/add.js`, {
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
          this.playAudioIfEnabled(this.success_audio);
          this.updateCart(openCart);
        }

        // Error response
        else {
          (this.error_message = data.description), (this.show_alert = true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.cart_loading = false;
      });
  },

  // Add cart item by submitting form
  submitCartForm(form: HTMLFormElement) {
    this.cart_loading = true;
    this.enable_body_scrolling = true;
    this.playAudioIfEnabled(this.click_audio);
    let formData = new FormData(form);

    // Add properties to formData
    let propertiesObj = Array.from(formData.entries())
      .filter(([key]) => key.includes("properties"))
      .reduce((obj, [key, value]) => {
        let name = key.replace("properties[", "").replace("]", "");
        obj[name] = value;
        return obj;
      }, {});
    if (Object.keys(propertiesObj).length > 0) {
      for (const [key, value] of Object.entries(propertiesObj)) {
        formData.append(`properties[${key}]`, value);
      }
    }

    // Remove selling_plan if it is set to 0
    for (let pair of formData.entries()) {
      if (pair[0] === "selling_plan" && pair[1] === "0") {
        formData.delete(pair[0]);
      }
    }

    // Make a POST request to add item to cart
    fetch(`${window.Shopify.routes.root}cart/add.js`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        let data = await response.json();

        // If the response status is 200, the item was added successfully
        if (response.status === 200) {
          // Play success audio if enabled
          this.playAudioIfEnabled(this.success_audio);

          // Update the cart
          this.updateCart(true);
        }

        // If the response status is not 200, there was an error adding the item
        else {
          // Set the error message and show the error alert
          this.error_message = data.description;
          this.show_alert = true;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.cart_loading = false;
      });
  },

  // Display discount alert if  URL parameters contain '/discount'
  // e.g. - .com/discount/13KS94BNGCS8?dt=Save+20percent+storewide
  handleSharedDiscount() {
    const discountCode = this.getCookie("discount_code");
    const urlParams = new URLSearchParams(window.location.search);
    const discountText = urlParams.get("dt");
    if (discountText) {
      this.discount_code = discountCode;
      this.discount_text = discountText;
      this.discount_popup = true;
    }
  },

  // Add items to cart if cartshare url available
  handleSharedCart() {
    // Check if URL contains cartshare
    if (location.search.includes("cartshare")) {
      const query = location.search.substring(1);
      const queryArray = query.split("&");

      // Use map to transform the array
      const itemsArray = queryArray
        .map((item) => {
          // Create object with all items to add
          if (item) {
            const properties = item.split(",");
            const obj: { [key: string]: string } = {};
            for (const property of properties) {
              const tup = property.split(":");
              obj[tup[0]] = tup[1];
            }
            return obj;
          }

          // Return null if item is falsy to avoid undefined elements in the array
          return null;
        })
        .filter(Boolean); // Use filter(Boolean) to remove null elements from the array

      const itemsObject = itemsArray.map((obj) => ({
        variantId: Number(obj.id),
        quantity: Number(obj.q) || 1,
      }));

      // Add items and open cart
      this.addCartItems(itemsObject);
    }
  },

  // Generate url with query string based on cart contents
  generateUrl(): string {
    // Define an interface for the cart item
    interface ICartItem {
      cartshare: boolean;
      id: number;
      q: number;
    }

    // Define a type that allows string indexing on the ICartItem interface
    type StringIndexable<T> = T & { [key: string]: string | number | boolean };

    // This function serializes an object into a string
    const serialize = (obj: StringIndexable<ICartItem>): string => {
      return Object.entries(obj)
        .reduce(
          (str, [key, value]) =>
            str.concat(
              `${encodeURIComponent(key)}:${encodeURIComponent(value.toString())},`,
            ),
          "",
        )
        .slice(0, -1);
    };

    // Filter the cart items and map them to the ICartItem interface
    const filteredCart = this.cart.items.map((item: Product) => {
      return {
        cartshare: true,
        id: item.variant_id,
        q: item.quantity,
      };
    });

    // Create a query string from the filtered cart items
    const queryString = filteredCart.map(serialize).join("&");

    // Return the generated URL
    return `${window.location.origin}?${queryString}`;
  },
};
