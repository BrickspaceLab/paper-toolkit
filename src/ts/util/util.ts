export const utils = {
  // set query params
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
  // Play sound
  playSound: function (audio: HTMLAudioElement) {
    if (!this.isMobileDevice()) {
      audio.play();
    }
  },
  
  // Check if device is mobile
  isMobileDevice: function() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  },

  // Copy value of input to clipboard and focus element
  copyToClipboard: function (id: string) {
    var copyText = document.getElementById(id) as HTMLInputElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  },

  // Check line items values
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