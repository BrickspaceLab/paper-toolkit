export const products = {
  // Update page when variant selection changes
  handleProductFormChange(
    initialVariant: string | null,
    sectionId: string,
    productHandle: string,
    optionPosition: string | null,
    optionValueId: string | null,
    sellingPlanGroupId: number = 0,
    sellingPlanId: number = 0,
    enableDefault: boolean = true,
  ) {
    
    // Get the selected options map from the DOM
    const optionsMap = Array.from(
      document
        .querySelector(`.options-${sectionId}`)
        ?.querySelectorAll('[data-option-value-id].js-activeVariant') || []
    ).reduce((map: Map<string, string>, el: Element) => {
      const htmlEl = el as HTMLElement;
      const position = htmlEl.dataset.optionPosition || '';
      const valueId = htmlEl.dataset.optionValueId || '';
      if (position && valueId) {
        map.set(position, valueId);
      }
      return map;
    }, new Map<string, string>());

    this.options_map = optionsMap;

    if(!enableDefault && !this.quick_add_initial_load) {
      if(sectionId === 'quick-add') {
        this.quick_add_initial_load = true;
      }
      return;
    }
    // If there is an initial variant, we can use it to update the options
    else if(initialVariant) {
      this.current_variant = initialVariant;
      // Refesh the options with section rendering API
      this.fetchAndUpdateOptions(sectionId, productHandle, undefined, undefined, this.current_variant, enableDefault, sellingPlanGroupId, sellingPlanId);
    } else {
      // If there is no initial variant, we need to fetch the options and fetch the variant
      this.fetchAndUpdateOptions(sectionId, productHandle, optionPosition, optionValueId, undefined, enableDefault, sellingPlanGroupId, sellingPlanId);
    }
  },

  fetchAndUpdateOptions(
    sectionId: string,
    productHandle: string,
    optionPosition?: string | null,
    optionValueId?: string | null,
    initialVariant?: string | null,
    enableDefault: boolean = true,
    sellingPlanGroupId: number = 0,
    sellingPlanId: number = 0,
  ) {
    // If optionPosition and optionValueId are provided, update the options map
    if (optionPosition && optionValueId) {
      this.options_map.set(optionPosition, optionValueId);
    }

    let params = '';
    
    // If initialVariant is provided, use variant id param
    if (initialVariant) {
      const variant = JSON.parse(decodeURIComponent(initialVariant));
      params = `&variant=${variant.id}`;
    } 
    // Otherwise, use option_values from options_map
    else if (this.options_map.size) {
      params = `&option_values=${Array.from(this.options_map.values()).join(',')}`;
    }
    
    this.product_loading = true;
    // Call the section rendering api
    fetch(
      `${window.Shopify.routes.root}products/${productHandle}?section_id=${sectionId}${params}`,
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const optionsElement = document.querySelector(`.options-${sectionId}`);
        const variantJson = html.querySelector(`.options-${sectionId} script[type="application/json"]`);

        // Update current_variant from the new HTML
        this.current_variant = variantJson?.textContent || '';

        // Parse the variant and process it immediately
        let selectedVariant = null;
        if (this.current_variant && this.current_variant.trim() !== '') {
          try {
            selectedVariant = JSON.parse(this.current_variant);
          } catch (error) {
            console.warn('Failed to parse current_variant JSON:', this.current_variant, error);
            selectedVariant = null;
          }
        }
 
        if (selectedVariant !== null) {          
          if (enableDefault || (sectionId === 'quick-add' && this.quick_add_initial_load)) {
            // Set option variables base on selectedVariant BEFORE inserting new HTML
            this.setVariantOptions(selectedVariant);
          }

          // Update display values based on selectedVariant
          this.setDefaultsFromSelectedVariant(
            selectedVariant,
            sellingPlanGroupId,
            sellingPlanId,
          );

          // Update all_options_selected if all options are selected
          this.setallOptionsSelected();

          // Update order of product gallery based on new selections
          this.reorderProductGallery();

          // Refresh pickup availability block
          this.fetchAndRefreshPickup(selectedVariant.id, sectionId);

          // Add variant id to URL parameters
          this.updateUrlParameters();

        } else {
          // Handle unavailable variant

          // Set all_options_selected to true
          this.all_options_selected = true;

          // Set current_variant_exists to false
          this.current_variant_exists = false;
        }

        const newOptionsElement = html.querySelector(`.options-${sectionId}`);
        if (newOptionsElement && optionsElement?.parentNode) {
          // Insert new HTML after options are already set
          optionsElement.parentNode.insertBefore(newOptionsElement, optionsElement);
        }
        // Always remove the old options element to prevent stale data
        if (optionsElement?.parentNode) {
          optionsElement.remove();
        }
        this.product_loading = false;
      });
  },

  // Update options to match the selected variant
  setVariantOptions(selectedVariant: any) {
    let optionsSize = selectedVariant.options.length;
    switch (optionsSize) {
      case 1:
        this.option1 = this.encodeToBase64(selectedVariant.options[0]);
        break;
      case 2:
        this.option1 = this.encodeToBase64(selectedVariant.options[0]);
        this.option2 = this.encodeToBase64(selectedVariant.options[1]);
        break;
      case 3:
        this.option1 = this.encodeToBase64(selectedVariant.options[0]);
        this.option2 = this.encodeToBase64(selectedVariant.options[1]);
        this.option3 = this.encodeToBase64(selectedVariant.options[2]);
        break;
      case 4:
        this.option1 = this.encodeToBase64(selectedVariant.options[0]);
        this.option2 = this.encodeToBase64(selectedVariant.options[1]);
        this.option3 = this.encodeToBase64(selectedVariant.options[2]);
        this.option4 = this.encodeToBase64(selectedVariant.options[3]);
        break;
    }
  },

  // If using combined listing this loads and sets title, description and images switching between products
  async handleCombinedListing(productURL: string, sectionId: string) {
    // load product section with Section Render API
    try {
      const response = await fetch(`${productURL}?section_id=${sectionId}`);

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Catpure data from fetch
      const responseHtml = await response.text();
      const html = new DOMParser().parseFromString(responseHtml, "text/html");
      const variantJson = html.querySelector(`.options-${sectionId} script[type="application/json"]`);

      // inject new html
      const oldSection = document.querySelector(`.js-product-${sectionId}`);
      if (oldSection) {
        const newSection = html.querySelector(`.js-product-${sectionId}`);
        oldSection.parentNode!.insertBefore(newSection!, oldSection);
        oldSection.remove();
      }

      // Update browser URL to match the fetched product URL (without section parameters) only if not quick-add
      if(sectionId !== 'quick-add') {
        history.replaceState(null, "", productURL);
      }

    } catch (error) {
      console.error(error);
    }
  },

  // Update values based on selected variant
  setDefaultsFromSelectedVariant(
    selectedVariant: any,
    sellingPlanGroupId: number,
    sellingPlanId: number,
  ) {
    // Get product form container
    let formContainer = this.$refs.formContainer;

    // If variant exists
    if (selectedVariant) {
      // Update basics
      this.current_variant_available = selectedVariant.available;
      this.current_variant_exists = true;
      this.current_variant_id = selectedVariant.id;
      this.current_variant_price = selectedVariant.price;
      this.current_variant_compare_price = selectedVariant.compare_at_price;
      this.current_variant_sku = selectedVariant.sku;
      this.current_variant_title = selectedVariant.title;

      // If a matching variant is found, update current_variant_inventory_quantity
      if (selectedVariant) {
        this.current_variant_inventory_quantity =
          selectedVariant.inventory_quantity;
        this.current_variant_inventory_policy =
          selectedVariant.inventory_policy;
        this.current_variant_inventory_management =
          selectedVariant.inventory_management;
      }

      // Set featured image id if available
      this.current_variant_featured_image_id = selectedVariant.featured_image
        ? selectedVariant.featured_image.id
        : null;
      this.current_variant_featured_media_id = selectedVariant.featured_media
        ? selectedVariant.featured_media.id
        : null;

      // Update unit price
      if (selectedVariant.unit_price) {
        this.current_variant_unit_price = selectedVariant.unit_price;
        this.current_variant_unit_label =
          selectedVariant.unit_price_measurement.reference_unit;
      }

      // Set selling plan to true if allocations are available
      this.current_variant_has_selling_plan =
        Array.isArray(selectedVariant.selling_plan_allocations) &&
        selectedVariant.selling_plan_allocations.length > 0;
      if (
        this.current_variant_has_selling_plan &&
        this.enable_selling_plan_widget
      ) {
        // Update if variant requires plan
        this.current_variant_requires_selling_plan =
          selectedVariant.requires_selling_plan;

        // Set array of available groups
        this.current_variant_selling_group_ids =
          selectedVariant.selling_plan_allocations.map(
            (allocation) => allocation.selling_plan_group_id,
          );
        this.current_variant_selling_group_ids.push("0");

        // Update current_variant_selling_group_id if it is not within current_variant_selling_group_ids
        // this.current_variant_selling_group_id = this.current_variant_selling_group_ids.includes(this.current_variant_selling_group_id) ? this.current_variant_selling_group_id : this.current_variant_selling_group_ids[0];

        this.current_variant_selling_group_id = sellingPlanGroupId;
        if (sellingPlanId) {
          this.current_variant_selling_plan_id = sellingPlanId;
        }

        // Check if allocation exists with matching group and plan
        let matchingAllocation = selectedVariant.selling_plan_allocations.find(
          (allocation) =>
            allocation.selling_plan_group_id ===
              this.current_variant_selling_group_id &&
            allocation.selling_plan_id ===
              parseInt(this.current_variant_selling_plan_id),
        );

        // Set values to first plan if matching allocation not found
        if (!matchingAllocation) {
          const firstAllocationInGroup =
            selectedVariant.selling_plan_allocations.find(
              (allocation) =>
                allocation.selling_plan_group_id ===
                this.current_variant_selling_group_id,
            );
          if (firstAllocationInGroup) {
            matchingAllocation = firstAllocationInGroup;
            this.current_variant_selling_plan_id =
              firstAllocationInGroup.selling_plan_id;
          }
        }

        // Update prices to matchingAllocation
        if (matchingAllocation && sellingPlanGroupId !== 0) {
          this.defaultSellingPlanPrice = matchingAllocation.per_delivery_price;
          this.current_variant_price = matchingAllocation.per_delivery_price;
          this.current_variant_compare_price =
            matchingAllocation.compare_at_price;
          this.current_variant_unit_price = matchingAllocation.unit_price;
        }

        // Update defaults and summary from selling plan data
        if (this.current_variant_selling_plan_id !== 0) {
          // Update plan basics
          let sellingPlanInput = formContainer.querySelector(
            ".js-" + this.current_variant_selling_plan_id,
          );

          // INFO: Using third-party widget won't update price display on page
          if (sellingPlanInput) {
            let sellingPlanData = JSON.parse(
              sellingPlanInput.getAttribute("data-selling-plan"),
            );
            this.current_variant_selling_plan_name =
              sellingPlanData.name.trim() + ".";
            this.current_variant_selling_plan_description =
              sellingPlanData.description.trim();

            // Update plan savings from price adjustment array
            let savingSummary = "";
            let savingHighlight = "";
            sellingPlanData.price_adjustments.forEach(
              (price_adjustment, index, array) => {
                let savingValue = price_adjustment.value;
                if (savingValue <= 0) return;
                let savingsPercentLabel = "";
                let savingsCount = price_adjustment.order_count || "ongoing";
                let punctuation = index === array.length - 1 ? ". " : "";
                let sentenceStart = "Save ";
                switch (price_adjustment.value_type) {
                  case "percentage":
                    savingsPercentLabel = "%";
                    break;
                  case "price":
                    savingValue = Shopify.formatMoney(
                      sellingPlanData.compare_at_price - savingValue,
                    );
                    sentenceStart = "";
                    savingHighlight = `Save ${savingValue}${savingsPercentLabel}`;
                    break;
                  case "fixed_amount":
                    savingValue = Shopify.formatMoney(savingValue);
                    break;
                }

                savingSummary += `${sentenceStart}${savingValue}${savingsPercentLabel} for ${savingsCount} orders${punctuation}`;
                if (index === 0) {
                  savingHighlight = `Save ${savingValue}${savingsPercentLabel}`;
                }
              },
            );

            this.current_variant_selling_plan_savings_description =
              savingSummary;
            this.current_variant_selling_plan_savings_summary = savingHighlight;
          }
        }

        // If no group selected reset plan selection
        if (this.current_variant_selling_group_id == "0") {
          this.current_variant_selling_plan_id = 0;
        }
      }
    }

    // If variant does not exist
    else {
      this.current_variant_exists = false;
    }
  },

  // Update all_options_selected if all options are selected
  setallOptionsSelected() {
    let optionsSize = this.product.options.length;
    this.all_options_selected =
      (optionsSize === 1 && this.option1) ||
      (optionsSize === 2 && this.option1 && this.option2) ||
      (optionsSize === 3 && this.option1 && this.option2 && this.option3) ||
      (optionsSize === 4 && this.option1 && this.option2 && this.option3 && this.option4);
    if (this.current_variant_has_only_default_variant === true) {
      this.all_options_selected = true;
    }
  },

  // Update order of product gallery images
  reorderProductGallery() {
    let formContainer = this.$refs.formContainer;

    // Check if enable_variant_images is enabled - this checks if store is using "Only show media associated with the selected variant"
    // If so we scroll to start of slider
    if (this.enable_variant_images) {
      setTimeout(() => {
        this.galleryScrollToStart(0);
      }, 100);
    }

    // If store is not using enable_variant_images
    // Scroll to first featured image
    else {
      const featuredImage = formContainer.querySelectorAll(
        ".js-" + this.current_variant_featured_media_id,
      );
      const featuredImageGrid = formContainer.querySelectorAll(
        ".js-" + this.current_variant_featured_media_id + "-grid",
      );

      if (featuredImage.length > 0) {
        // Slide to image
        const slideIndex = featuredImage[0].getAttribute("data-slide");
        if (slideIndex) {
          this.galleryScrollToIndex(parseInt(slideIndex));
        }

        // Reorder grid
        if (featuredImageGrid.length > 0) {
          const parentElement = featuredImageGrid[0].parentNode;
          if (parentElement) {
            parentElement.insertBefore(
              featuredImageGrid[0],
              parentElement.firstChild,
            );
          }
        }
      }
    }
  },

  // Add variant id to URL parameters
  // URL will only update if on a product page and all options are selected
  updateUrlParameters() {
    if (
      window.location.pathname.includes("/products/") &&
      this.all_options_selected
    ) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("variant", this.current_variant_id);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(null, "", newRelativePathQuery);
    }
  },

  // Refresh pickup availability block
  fetchAndRefreshPickup(variantId?: string, sectionId?: string) {
    const formContainer = this.$refs.formContainer;
    const pickupDiv = formContainer.querySelector(".js-pickup");

    // Check if pickup block exists before fetching
    if (!pickupDiv) return;

    const pickupContainer = pickupDiv.querySelector(".js-pickup-container");

    // Fetch new pickup section for the specific variant
    const baseUrl = window.location.pathname;
    const params = variantId ? `?variant=${variantId}&section_id=${sectionId}` : `${window.location.search ? window.location.search + '&' : '?'}section_id=${sectionId}`;
    
    fetch(baseUrl + params)
      .then(async (response) => {
        const data = await response.text();
        if (response.status === 200) {
          const html = document.createElement("div");
          html.innerHTML = data;
          const newPickupDiv = html.querySelector(".js-pickup");
          
          // Replace only the inner content of pickup container to preserve classes and styles
          if (newPickupDiv) {
            const newPickupContainer = newPickupDiv.querySelector(".js-pickup-container");
            if (newPickupContainer && pickupContainer) {
              // Both exist: update inner content to preserve classes/styles
              pickupContainer.innerHTML = newPickupContainer.innerHTML;
            } else {
              // Either showing pickup for first time or hiding it: replace entire content
              pickupDiv.innerHTML = newPickupDiv.innerHTML;
            }
          }
        } else {
          console.error("Error:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },

  // Scroll to next gallery item
  galleryScrollNext() {
    // Unzoom the gallery
    this.galleryResetZoom();

    // Set the next index
    this.gallery_next = this.gallery_index + 1;
    if (this.gallery_next > this.gallery_size) {
      this.gallery_next = 0;
    }

    // Go to new slide
    this.galleryScrollToIndex(this.gallery_next);
  },

  // Scroll to previous gallery item
  galleryScrollBack() {
    // Unzoom the gallery
    this.galleryResetZoom();

    // Set the next index
    this.gallery_next = this.gallery_index - 1;
    if (this.gallery_next < 0) {
      this.gallery_next = this.gallery_size;
    }

    // Go to new slide
    this.galleryScrollToIndex(this.gallery_next);
  },

  // Scroll to a specific gallery item
  galleryScrollToIndex(index: number) {
    // Unzoom the gallery
    this.galleryResetZoom();

    // Get product form container
    let formContainer = this.$refs.formContainer;

    // Get sliders
    let slider = formContainer.querySelector(".js-slider");
    let thumbnailSlider = formContainer.querySelector(".js-thumbnailSlider");
    let zoomSlider = formContainer.querySelector(".js-zoomSlider");

    // Go to slide
    let currentSlide = slider.querySelector('[data-slide="' + index + '"]');

    if (currentSlide) {
      let currentSlidePosition = currentSlide.offsetLeft;
      slider.scrollTo({
        top: 0,
        left: currentSlidePosition,
        behavior: "smooth",
      });
    }

    // Go to slide on thumbnail
    if (thumbnailSlider) {
      let currentThumb = thumbnailSlider.querySelector(
        '[data-slide="' + index + '"]',
      );
      if (currentThumb) {
        let currentThumbPosition = currentThumb.offsetTop;
        thumbnailSlider.scrollTo({
          top: currentThumbPosition - 200,
          left: 0,
          behavior: "smooth",
        });
      }
    }

    // Go to slide on fullscreen gallery
    setTimeout(() => {
      if (zoomSlider) {
        let currentSlideZoom = zoomSlider.querySelector(
          '[data-slide="' + index + '"]',
        );
        let currentSlideZoomPosition = currentSlideZoom.offsetTop;
        if (currentSlideZoom) {
          zoomSlider.scrollTo({
            top: currentSlideZoomPosition,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    }, 100);

    // Update index
    setTimeout(() => {
      this.gallery_index = index;
    }, 200);
  },

  // Scroll to start of gallery slider
  galleryScrollToStart() {
    // Unzoom the gallery
    this.galleryResetZoom();

    // Get product form container
    let formContainer = this.$refs.formContainer;

    // Get sliders
    let slider = formContainer.querySelector(".js-slider");
    let thumbnailSlider = formContainer.querySelector(".js-thumbnailSlider");

    // Go to slide
    slider.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Go to slide on thumbnail
    if (thumbnailSlider) {
      thumbnailSlider.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }

    // Update index
    this.gallery_index = 0;
  },

  // Unzoom all images
  galleryResetZoom() {
    for (let i = 0; i < this.gallery_size; i++) {
      this["gallery_zoom_" + i] = false;
    }
  },

  // Zoom in on gallery image
  galleryZoomIn() {
    this["gallery_zoom_" + this.gallery_index] = true;
  },

  // Zoom out of gallery image
  galleryZoomOut() {
    this["gallery_zoom_" + this.gallery_index] = false;
  },
};
