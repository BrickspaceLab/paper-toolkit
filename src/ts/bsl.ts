import { ShopifyInterface } from "./models.interface";
import { AppInterface } from "./models.interface";

import { globals } from "./globals/globals";
import { cart } from "./cart/cart";
import { search } from "./search/search";
import { products } from "./products/products";
import { collections } from "./collections/collections";
import { utils } from "./utils/utils";
import { Shopify } from "./shopify/shopify";

// Load images and replace classes
utils.loadImages();

// Extend window object with Shopify, app, and initial data
declare global {
  interface Window {
    app: () => AppInterface;
    __initialData: AppInterface;
    Shopify: ShopifyInterface;
  }
}

// Expose variables and functions to Alpine
window.app = function () {
  return {
    // Spread globals
    ...globals,
    ...cart,
    ...search,
    ...products,
    ...collections,
    ...utils,
    ...Shopify,
  };
};