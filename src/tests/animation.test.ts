import { test, expect,vi } from 'vitest';
import initAnimationObserver from '../ts/animation/observer';

test('initAnimationObserver should attach IntersectionObserver to elements with js:animation class', async () => {
  // Mock IntersectionObserver
  const observe = vi.fn();
  class IntersectionObserverMock {
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
    observe = observe;
  }

  const originalIntersectionObserver = global.IntersectionObserver;
  (global as any).IntersectionObserver = IntersectionObserverMock as any;

  document.body.innerHTML = `
    <div class="js:animation" data-id="test-1" data-delay="100" data-replace='{ "hide": "show" }' data-callback="() => {}"></div>
  `;

  initAnimationObserver();

  const animationElement = document.querySelector('.js\\:animation') as HTMLElement;

  expect(observe).toHaveBeenCalledTimes(1);
  expect(observe).toHaveBeenCalledWith(animationElement);

  // Restore the original IntersectionObserver
  global.IntersectionObserver = originalIntersectionObserver;
});
