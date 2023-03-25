import formatMoney from "./shopify/formatMoney";
import initAnimationObserver from "./animation/observer";
import { IShopify } from "./models.interface";
import { AppInterface } from "./models.interface";
import { globals } from "./globals/globals";
import { cart } from "./cart/cart";
import { search } from "./search/search";
import { collections } from "./collections/collections";
import { utils } from "./util/util";

// Extend window object with Shopify, app, and initial data
declare global {
  interface Window {
    Shopify: IShopify;
    app: () => AppInterface;
    __initialData: AppInterface;
  }
}

// Set up Shopify stuff
let Shopify = window.Shopify || {};
Shopify.formatMoney = formatMoney;

// Watch for class changes for animation
initAnimationObserver();

// Expose variables and functions to Alpine
window.app = function () {
  return {
    // Spread globals
    ...globals,

    ...cart,

    ...search,

    ...collections,

    ...utils,
  };
};