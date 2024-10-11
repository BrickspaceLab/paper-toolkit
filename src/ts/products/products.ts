export const products = {
  
  // Update page when variant selection changes
  handleProductFormChange (
    preselectedVariantId: number
  ) {

    // Set variant based on what's passed to this function
    this.setOptionsFromPreselectedVariantId(preselectedVariantId);
    
    // Find and set selectedVariant
    let selectedVariant = this.setSelectedVariant();

    // Set options as unavailable
    this.setUnavailableOptions();

    // Update display values based on selectedVariant
    this.setDefaultsFromSelectedVariant(selectedVariant);

    // Update all_options_selected if all options are selected
    this.setallOptionsSelected();

    // Update order of product gallery based on new selections
    this.reorderProductGallery();

    // Refresh pickup availability block
    this.fetchAndRefreshPickup();

    // Add variant id to URL parameters
    this.updateUrlParameters();
    
    // Update calculated price with quantity
    this.calculated_price = this.quantity * this.current_variant_price;
    
  },

  // If using combined listing this loads and sets title, description and images switching between products
  async handleCombinedListing (
    productURL: string,
    sectionId: string
  ) { 

    // load product section with Section Render API
    try {
      const response = await fetch(
        `${productURL}?section_id=${sectionId}`
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Catpure data from fetch
      const responseHtml = await response.text();
      const html = new DOMParser().parseFromString(responseHtml, 'text/html');

      // inject new html
      const oldSection = document.querySelector('.js-product')
      if(oldSection) {
        const newSection = html.querySelector('.js-product');
        oldSection.parentNode!.insertBefore(newSection!, oldSection);
        oldSection.remove();
      }
    } 

    catch (error) {
      console.error(error);
    }

  },

  // Find options that are not available based on selected options
  setUnavailableOptions() {

    // Generate all possible combinations of options
    const generateOptionCombinations = () => {
      const options = this.product.options.map((option, index) => {
        return [...new Set(this.product.variants.map(variant => this.encodeToBase64(variant[`option${index + 1}`])))];
      });

      const combinations = options.reduce((acc, option) => {
        return acc.flatMap(combination => {
          return option.map(optionValue => {
            return { ...combination, [`option${options.indexOf(option) + 1}`]: optionValue };
          });
        });
      }, [{}]);

      return combinations;
    };

    // Find matching variants excluding the option being considered
    // This will return an array of variants that are not available
    const findMatchingVariants = (excludeOptionIndex: number) => {
      return this.product.variants.filter(variant => {

        // Check if the variant is sold out
        if (variant.available) {
          return false;
        }

        // If there is only one option, return all unavailable variants
        if (this.product.options.length === 1) {
          return true;
        }

        // Loop through and find matching variants excluding the option being considered
        else {
          for (let i = 1; i <= this.product.options.length; i++) {
            if (i === excludeOptionIndex) continue;
            const optionKey = `option${i}`;
            if (this.encodeToBase64(variant[optionKey]) !== this[`option${i}`]) {
              return false;
            }
          }
        }

        return true;

      });
    };

    // Generate all possible combinations of options
    const allCombinations = generateOptionCombinations();

    // Find non-existent variants
    const nonExistentVariants = allCombinations.filter(combination => {
      return !this.product.variants.some(variant => {
        return Object.keys(combination).every(optionKey => {
          return this.encodeToBase64(variant[optionKey]) === combination[optionKey];
        });
      });
    });

    // Loop through options
    for (let i = 1; i <= this.product.options.length; i++) {
      const matchingVariants = findMatchingVariants(i);

      // Initialize a set to hold unique sold-out options for each option
      const unavailableOptionsSet = new Set<string>();

      // For each matching variant, add its options to the unavailableOptionsSet
      matchingVariants.forEach(variant => {
        const optionKey = `option${i}`;
        unavailableOptionsSet.add(this.encodeToBase64(variant[optionKey]));
      });

      // Find unavailable options based on selected options and non-existent variants
      nonExistentVariants.forEach(variant => {
        const isMatch = Object.keys(variant).every(optionKey => {
          
          const optionIndex = parseInt(optionKey.replace('option', ''));
          return optionIndex === i || variant[optionKey] === this[`option${optionIndex}`];
        });

        if (isMatch) {
          unavailableOptionsSet.add(variant[`option${i}`]);
        }
      });

      // Convert the set to an array and assign it to the corresponding global variable
      this[`unavailable_options${i}`] = Array.from(unavailableOptionsSet);
    }

  },

  // Set selectedVariant based on selected options
  // This will find the selectedVariant based on selected options
  setSelectedVariant () {

    let optionsSize = this.product.options.length;
    let selectedVariant;

    switch (optionsSize) {
      case 1:
        selectedVariant = this.product.variants.find(variant => 
          (this.encodeToBase64(variant.option1) === this.option1)
        );
        break;
      case 2:
        selectedVariant = this.product.variants.find(variant => 
          (this.encodeToBase64(variant.option1) === this.option1) &&
          (this.encodeToBase64(variant.option2) === this.option2)
        );
        break;
      case 3:
        selectedVariant = this.product.variants.find(variant => 
          (this.encodeToBase64(variant.option1) === this.option1) &&
          (this.encodeToBase64(variant.option2) === this.option2) &&
          (this.encodeToBase64(variant.option3) === this.option3)
        );
        break;
    }

    return selectedVariant;

  },

  // Check if preselectedVariantId exists and set options
  setOptionsFromPreselectedVariantId (
    preselectedVariantId: number
  ) {

    let optionsSize = this.product.options.length;

    // Find the matching variant in this.product.variants
    // If a matching variant is found, update options to match the selected variant
    if (preselectedVariantId) {
      this.current_variant_id = preselectedVariantId;
      const selectedVariant = this.product.variants.find((variant: { id: number }) => 
        variant.id === preselectedVariantId
      );
      if (selectedVariant) {
        switch (optionsSize) {
          case 1:
            this.option1 = this.encodeToBase64(selectedVariant.option1);
            break;
          case 2:
            this.option1 = this.encodeToBase64(selectedVariant.option1);
            this.option2 = this.encodeToBase64(selectedVariant.option2);
            break;
          case 3:
            this.option1 = this.encodeToBase64(selectedVariant.option1);
            this.option2 = this.encodeToBase64(selectedVariant.option2);
            this.option3 = this.encodeToBase64(selectedVariant.option3);
            break;
        }
      }
    }

  },

  // Update values based on selected variant
  setDefaultsFromSelectedVariant (
    selectedVariant: number
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

      // Find the matching variant in this.variants
      const customSelectedVariant = this.variants[this.current_variant_id];

      // If a matching variant is found, update current_variant_inventory_quantity
      if (customSelectedVariant && customSelectedVariant.length > 0) {
        this.current_variant_inventory_quantity = customSelectedVariant[0].inventory_quantity;
        this.current_variant_inventory_policy = customSelectedVariant[0].inventory_policy;
        this.current_variant_inventory_management = customSelectedVariant[0].inventory_management;
      }

      // Set featured image id if available
      this.current_variant_featured_image_id = selectedVariant.featured_image ? selectedVariant.featured_image.id : null;
      
      // Set featured media id if available
      this.current_variant_featured_media_id = selectedVariant.featured_media ? selectedVariant.featured_media.id : null;

      // Update unit price
      if (selectedVariant.unit_price) {
        this.current_variant_unit_price = selectedVariant.unit_price;
        this.current_variant_unit_label = selectedVariant.unit_price_measurement.reference_unit;
      }

      // Set selling plan to true if allocations are available
      this.current_variant_has_selling_plan = Array.isArray(selectedVariant.selling_plan_allocations) && selectedVariant.selling_plan_allocations.length > 0;
      if (this.current_variant_has_selling_plan && this.enable_selling_plan_widget) {

        // Update if variant requires plan
        this.current_variant_requires_selling_plan = selectedVariant.requires_selling_plan;

        // Set array of available groups
        this.current_variant_selling_group_ids = selectedVariant.selling_plan_allocations.map(allocation => allocation.selling_plan_group_id);
        this.current_variant_selling_group_ids.push('0');
  
        // Update current_variant_selling_group_id if it is not within current_variant_selling_group_ids
        this.current_variant_selling_group_id = this.current_variant_selling_group_ids.includes(this.current_variant_selling_group_id) ? this.current_variant_selling_group_id : this.current_variant_selling_group_ids[0];
     
        // Check if allocation exists with matching group and plan
        let matchingAllocation = selectedVariant.selling_plan_allocations.find(
          allocation => allocation.selling_plan_group_id === this.current_variant_selling_group_id && 
          allocation.selling_plan_id === parseInt(this.current_variant_selling_plan_id)
        );

        // Set values to first plan if matching allocation not found
        if (!matchingAllocation) {
          const firstAllocationInGroup = selectedVariant.selling_plan_allocations.find(
            allocation => allocation.selling_plan_group_id === this.current_variant_selling_group_id
          );
          if (firstAllocationInGroup) {
            matchingAllocation = firstAllocationInGroup;
            this.current_variant_selling_plan_id = firstAllocationInGroup.selling_plan_id;
          }
        } 

        // Update prices to matchingAllocation
        if (matchingAllocation) {
          this.defaultSellingPlanPrice = matchingAllocation.per_delivery_price;
          this.current_variant_price = matchingAllocation.per_delivery_price;
          this.current_variant_compare_price = matchingAllocation.compare_at_price;
          this.current_variant_unit_price = matchingAllocation.unit_price;
        }

        // Update defaults and summary from selling plan data
        if (this.current_variant_selling_plan_id !== 0) {

          // Update plan basics
          let sellingPlanInput = formContainer.querySelector('.js-' + this.current_variant_selling_plan_id);
          let sellingPlanData = JSON.parse(sellingPlanInput.getAttribute('data-selling-plan'));
          this.current_variant_selling_plan_name = sellingPlanData.name.trim() + '.';
          this.current_variant_selling_plan_description = sellingPlanData.description.trim(); 

          // Update plan savings from price adjustment array
          let savingSummary = '';
          let savingHighlight = '';
          sellingPlanData.price_adjustments.forEach((price_adjustment, index, array) => {
            let savingValue = price_adjustment.value;
            if (savingValue <= 0) return;
            let savingsPercentLabel = '';
            let savingsCount = price_adjustment.order_count || 'ongoing'; 
            let punctuation = index === (array.length - 1) ? '. ' : '';
            let sentenceStart = 'Save ';
            switch (price_adjustment.value_type) {
              case 'percentage':
                savingsPercentLabel = '%';
                break;
              case 'price':
                savingValue = Shopify.formatMoney(sellingPlanData.compare_at_price - savingValue);
                sentenceStart = '';
                savingHighlight = `Save ${savingValue}${savingsPercentLabel}`;
                break;
              case 'fixed_amount':
                savingValue = Shopify.formatMoney(savingValue);
                break;
            }

            savingSummary += `${sentenceStart}${savingValue}${savingsPercentLabel} for ${savingsCount} orders${punctuation}`;
            if (index === 0) {
              savingHighlight = `Save ${savingValue}${savingsPercentLabel}`;
            }
          });

          this.current_variant_selling_plan_savings_description = savingSummary;
          this.current_variant_selling_plan_savings_summary = savingHighlight;
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
  setallOptionsSelected () {
    let optionsSize = this.product.options.length;
    this.all_options_selected = 
      (optionsSize === 1 && this.option1) ||
      (optionsSize === 2 && this.option1 && this.option2) ||
      (optionsSize === 3 && this.option1 && this.option2 && this.option3);
      if(this.current_variant_has_only_default_variant === true) {
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
      const featuredImage = formContainer.querySelectorAll('.js-' + this.current_variant_featured_media_id);
      const featuredImageGrid = formContainer.querySelectorAll('.js-' + this.current_variant_featured_media_id + '-grid');

      if (featuredImage.length > 0) {
        // Slide to image
        const slideIndex = featuredImage[0].getAttribute('data-slide');
        if (slideIndex) {
          this.galleryScrollToIndex(parseInt(slideIndex));
        }

        // Reorder grid
        if(featuredImageGrid.length > 0) {
          const parentElement = featuredImageGrid[0].parentNode;
          if (parentElement) {
            parentElement.insertBefore(featuredImageGrid[0], parentElement.firstChild);
          }
        }
      }
    }

  },

  // Add variant id to URL parameters
  // URL will only update if on a product page and all options are selected
  updateUrlParameters () {
    if (window.location.pathname.includes('/products/') && this.all_options_selected) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('variant', this.current_variant_id);
      const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.replaceState(null, '', newRelativePathQuery);
    }
  },

  // Refresh pickup availability block
  fetchAndRefreshPickup () {

    const formContainer = this.$refs.formContainer;
    const pickupContainer = formContainer.querySelector('.js-pickup');

    if (pickupContainer) {
      fetch(window.location + '&section_id=product__pickup')
      .then( async (response) => {
        const data = await response.text();
        if (response.status === 200) {
          const html = document.createElement('div'); html.innerHTML = data;
          const htmlCleaned = html.querySelector('.js-pickup');
          if(htmlCleaned){
            pickupContainer.innerHTML = htmlCleaned.innerHTML;
          } 
        } 
        else {
          console.error('Error:', error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

  },

  // Scroll to next gallery item
  galleryScrollNext () {

    // Unzoom the gallery
    this.galleryResetZoom();
    
    // Set the next index
    this.gallery_next = this.gallery_index + 1;
    if (this.gallery_next > this.gallery_size){
      this.gallery_next = 0;
    }

    // Go to new slide
    this.galleryScrollToIndex(this.gallery_next);

  },

  // Scroll to previous gallery item
  galleryScrollBack () {

    // Unzoom the gallery
    this.galleryResetZoom();
    
    // Set the next index
    this.gallery_next = this.gallery_index - 1;
    if (this.gallery_next < 0){
      this.gallery_next = this.gallery_size;
    }

    // Go to new slide
    this.galleryScrollToIndex(this.gallery_next);

  },

  // Scroll to a specific gallery item
  galleryScrollToIndex (
    index: number
  ) {

    // Unzoom the gallery
    this.galleryResetZoom();

    // Get product form container
    let formContainer = this.$refs.formContainer;

    // Get sliders
    let slider = formContainer.querySelector('.js-slider');
    let thumbnailSlider = formContainer.querySelector('.js-thumbnailSlider');
    let zoomSlider = formContainer.querySelector('.js-zoomSlider');

    // Go to slide
    let currentSlide = slider.querySelector('[data-slide="' + index +'"]');
    if (currentSlide) {
      let currentSlidePosition = currentSlide.offsetLeft;
      slider.scrollTo({
        top: 0,
        left: currentSlidePosition,
        behavior: 'smooth'
      });
    }

    // Go to slide on thumbnail
    if (thumbnailSlider){
      let currentThumb = thumbnailSlider.querySelector('[data-slide="' + index +'"]');
      if (currentThumb) {
        let currentThumbPosition = currentThumb.offsetTop;
        thumbnailSlider.scrollTo({
          top: currentThumbPosition-200,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
    
    // Go to slide on fullscreen gallery
    setTimeout(() => {
      if (zoomSlider){
        let currentSlide = zoomSlider.querySelector('[data-slide="' + index +'"]');
        let currentSlidePosition = currentSlide.offsetTop;
        if (currentSlide) {
          zoomSlider.scrollTo({
            top: currentSlidePosition,
            left: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 100);

    // Update index
    // this.gallery_index = index;

  },

  // Scroll to start of gallery slider
  galleryScrollToStart () {

    // Unzoom the gallery
    this.galleryResetZoom();
    
    // Get product form container
    let formContainer = this.$refs.formContainer;

    // Get sliders
    let slider = formContainer.querySelector('.js-slider');
    let thumbnailSlider = formContainer.querySelector('.js-thumbnailSlider');

    // Go to slide
    slider.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Go to slide on thumbnail
    if (thumbnailSlider){
      thumbnailSlider.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    
    // Update index
    this.gallery_index = 0;

  },

  // Unzoom all images
  galleryResetZoom () {
    for(let i = 0; i < this.gallery_size; i++) {
      this['gallery_zoom_' + i] = false;
    }
  },

  // Zoom in on gallery image
  galleryZoomIn() {
    this['gallery_zoom_'+this.gallery_index] = true;
  },

  // Zoom out of gallery image
  galleryZoomOut() {
    this['gallery_zoom_'+this.gallery_index] = false;
  }

};