// Import necessary modules from 'vitest'
import { describe, it, expect } from 'vitest';

// Import the 'formatMoney' function from the specified file
import formatMoney from '../ts/shopify/formatMoney';

// Describe the test suite for the 'Shopify.formatMoney' function
describe('Shopify.formatMoney', () => {
  // Test if the function formats cents as amount with default currency
  it('formats cents as amount with default currency', () => {
    expect(formatMoney(1000)).toEqual('$10.00');
  });

  // Test if the function formats cents as amount with specified currency
  it('formats cents as amount with specified currency', () => {
    expect(formatMoney(1000, 'EUR')).toEqual('EUR10.00');
  });
});