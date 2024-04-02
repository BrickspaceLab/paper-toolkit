export const utils = {
  // Initiate animation setup - classes will swap when elements scroll into view
  initAnimationObserver () {

    // observerCallback for IntersectionObserver
    const observerCallback: IntersectionObserverCallback = function (entries) {
      entries.forEach((entry) => {
        let element = document.getElementById((entry.target as HTMLElement).dataset.id!);

        // Update classes
        if (entry.isIntersecting) {

          // Set delay for animation
          const delay = (entry.target as HTMLElement).dataset.delay || '';

          // Use try-catch to handle JSON parsing errors
          let replaceClasses: { [key: string]: string };
          try {
            replaceClasses = JSON.parse(
              (entry.target as HTMLElement).dataset.replace!.replace(/'/g, '"')
            ) as { [key: string]: string };
          } 
          catch (error) {
            console.error('Error parsing replaceClasses:', error);
            return;
          }

          // Avoid using eval due to security risks, instead use a safer alternative
          const callback = (entry.target as HTMLElement).dataset.callback!;
          if (callback && (window as any)[callback] && typeof (window as any)[callback] === "function") {
            (window as any)[callback]();
          }

          Object.keys(replaceClasses).forEach(function (key) {
            setTimeout(function () {
              if (element) {
                element.classList.remove(key);
                if (replaceClasses[key]) {
                  element.classList.add(replaceClasses[key]);
                }
              } else {
                entry.target.classList.remove(key);
                if (replaceClasses[key]) {
                  entry.target.classList.add(replaceClasses[key]);
                }
              }
            }, parseInt(delay, 10));
          });
        }
      });
    };

    // Get elements with .js-animation
    const animationElements = document.querySelectorAll(".js-animation");
    if (animationElements.length > 0) {
      const animationObserver = new IntersectionObserver(observerCallback);
      animationElements.forEach(function (target) {
        animationObserver.observe(target);
      });
    }
  },

  // set query params
  // NEEDS TO GET REWORKED
  setQuery: (query: string) => {

    if(query === "") {
      window.history.replaceState({}, '', window.location.pathname);
      return;
    } else {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      
      // Update query string values
      params.set('edit', query);
      
      // Update URL
      window.history.replaceState({}, '', `${path}?${params.toString()}${hash}`);
    }
  },

  // Refresh when using back button when history states were changed
  initPopstate () {
    window.addEventListener('popstate', async () => {
      window.location.href = location.href;
    });
  },

  debounce(
    func: (...args: any[]) => void, 
    wait: number
  ) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout!);
        func(...args);
      };
      clearTimeout(timeout!);
      timeout = setTimeout(later, wait);
    };
  },

  // Match to liquid handle filter
  handleize (
    str: string
  ) {    
    return str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Optional: Remove accents
      .replace(/[^a-z0-9\p{L}\p{N}]+/gu, '-') // Allow letters and numbers from any language
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Add classes to images after loading
  loadImages () {

    // Function to add 'loaded' classes to images and image containers
    const loadImage = (img: HTMLImageElement) => {
      img.classList.add('loaded');
      img.parentElement?.parentElement?.classList.add('loaded');
    };

    // Iterate over each image with .js-image
    const images = document.querySelectorAll('img.js-image');
    images.forEach((img: Element) => {
      const imageElement = img as HTMLImageElement;

      // When image is cached
      if(imageElement.complete){
        loadImage(imageElement);
      } 

      // Check when image loads
      else {
        imageElement.onload = () => {
          loadImage(imageElement);
        }
      }

      // Set a fallback for adding the classes
      setTimeout(() => {
        loadImage(imageElement); 
      }, 2000);
    });
  },

  // Copy value of input to clipboard and focus element
  copyToClipboard (
      id: string
    ) {
      const copyText = document.getElementById(id) as HTMLInputElement;
  
      // Check if copyText is not null before proceeding to avoid potential errors
      if(copyText) {
        copyText.select();
        copyText.setSelectionRange(0, 99999);
      
        // Use try-catch to handle potential errors when writing to clipboard
        try {
          navigator.clipboard.writeText(copyText.value);
        } 
        catch (err) {
          console.error('Failed to copy text: ', err);
        }
      } else {
        console.error('Element not found: ', id);
      }
  },

  // Get cookie by name
  getCookie (
    name: string
  ) {

    // Using RegExp for more efficient and accurate cookie name matching
    const cookieMatch = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieMatch ? cookieMatch.pop() : null;
  },

  // Handle audio playing
  playAudioIfEnabled (
    audioFile: string
  ) {
    if (this.enable_audio) {
      const audio = new Audio(audioFile);
      if (window.innerWidth > 768) {
        audio.play();
      }
    }
  },

  // Open menu drawer
  openMenu () {
    this.menu_drawer = true;
    this.enable_body_scrolling = false;
    this.playAudioIfEnabled(this.click_audio);
  },

  // Open cart drawer
  openCart () {
    this.cart_drawer = true; 
    this.cart_alert = false;
    this.enable_body_scrolling = false;
    this.playAudioIfEnabled(this.click_audio);
  },
  
  // Open search drawer
  openSearch () {
    this.menu_drawer = false;
    this.search_drawer = true; 
    this.enable_body_scrolling = false; 
    setTimeout(() => {
      let searchField = document.querySelector('#search-field') as HTMLInputElement;
      if (searchField) {
        searchField.focus();
      }
    }, 400);
  },

  // Close cart drawer
  closeCart () {
    this.cart_drawer = false; 
    this.cart_alert = false;
    this.enable_body_scrolling = true;
  },
  
  // Close menu drawer
  closeMenu (){
    this.menu_drawer = false; 
    this.enable_body_scrolling = true;
  },
  
  // Close menu drawer
  closeSearch () {
    this.search_drawer = false; 
    this.enable_body_scrolling = true;
  },

  // Initiate header scrolling (unless in preview mode)
  initScroll: function () {
     if(!Shopify.visualPreviewMode){
      const body = document.querySelector('body');
      
      body!.setAttribute('x-on:scroll.window', `() => {
        if (window.pageYOffset > 400) {
          is_scrolled = window.pageYOffset > prev_scroll_pos ? true : false; 
          prev_scroll_pos = window.pageYOffset;
          $refs.header.style.transform = 'none'
        } else {
          is_scrolled = false;
          prev_scroll_pos = window.pageYOffset;
          $refs.header.style.transform = 'none'
        }
      }`);
      body!.setAttribute('x-intersect.half:enter', 'scroll_up = false');
      body!.setAttribute('x-intersect.half:leave', 'scroll_up = true');
    }
  },

  // Check line items values
  // REWORK
  checkLineItems(handle: string): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(
      `.custom-input_${handle}`
    );
    const inputsArr = Array.from(inputs);
    const requiredFields = inputsArr.filter((inp) => inp.required);

    if (requiredFields.some((field) => field.value === "")) {
      this.incomplete_fields = true;
    } else {
      this.incomplete_fields = false;
    }
  },
  
};