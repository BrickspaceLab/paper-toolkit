// credit: https://onesheep.org/insights/animate-on-scroll-with-tailwind-css
// credit: https://devdojo.com/tnylea/animating-tailwind-transitions-on-page-load

// Setup IntersectionObserver to add classes on scroll
export default function initAnimationObserver() {
  
  // observerCallback for IntersectionObserver
  const observerCallback: IntersectionObserverCallback = function (entries) {
    entries.forEach((entry) => {
      let element = document.getElementById((entry.target as any).dataset.id);

      // Update classes
      if (entry.isIntersecting) {
        let replaceClasses = JSON.parse(
          (entry.target as any).dataset.replace.replace(/'/g, '"')
        );
        let delay = (entry.target as any).dataset.delay;

        let callback = (entry.target as any).dataset.callback;
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

}