// credit: https://onesheep.org/insights/animate-on-scroll-with-tailwind-css
// credit: https://devdojo.com/tnylea/animating-tailwind-transitions-on-page-load

// Setup IntersectionObserver to add classes on scroll
export default function initAnimationObserver() {
  // observerCallback for IntersectionObserver
  const observerCallback: IntersectionObserverCallback = function (entries) {
    entries.forEach((entry) => {
      let element = document.getElementById((entry.target as HTMLElement).dataset.id!);

      // Update classes
      if (entry.isIntersecting) {
        let replaceClasses = JSON.parse(
          (entry.target as HTMLElement).dataset.replace!.replace(/'/g, '"')
        ) as { [key: string]: string };
        let delay = (entry.target as HTMLElement).dataset.delay || '';

        let callback = (entry.target as HTMLElement).dataset.callback!;
        let x = eval(callback);
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
          }, parseInt(delay, 10));
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
