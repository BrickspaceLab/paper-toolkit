import { ShopifyInterface } from "../models.interface";
import { globals } from "../globals/globals";
let Shopify: ShopifyInterface = window.Shopify ?? {};

// Format money from subunits to standard format
function formatMoney (
  cents: number | string, 
  forceEnableCurrency: boolean
): string {

  // If cents is a string, remove the decimal point
  if (typeof cents == 'string') { cents = cents.replace('.',''); }

  // Get variables we need
  let value = '';
  let placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  let formatStringWithoutCurrency = globals.price_format_without_currency;
  let formatStringWithCurrency = globals.price_format_with_currency;
  let formatString = '';
  let enableZeros = globals.price_enable_zeros;
  let enableCurrency = globals.price_enable_currency;

  // Use strict equality '===' for comparison to avoid type coercion
  // Also, use ternary operator for cleaner and more concise code
  formatString = enableCurrency === false ? formatStringWithCurrency : formatStringWithoutCurrency;

  // Update formatString based on forceEnableCurrency. If this is true we'll use formatStringWithCurrency
  if (forceEnableCurrency === false) {
    formatString = formatStringWithCurrency;
  } else if (forceEnableCurrency === true) {
    formatString = formatStringWithoutCurrency;
  }

  // Function to return the default value if the option is undefined
  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  // Function to format the number with delimiters
  function formatWithDelimiters(number, precision, thousands, decimal) {

    // Set default values for precision, thousands, and decimal if they are not provided
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    // If the number is not a number or null, return 0
    if (isNaN(number) || number == null) { return 0; }

    // Convert the number from subunits to standard format
    number = (number/100.0).toFixed(precision);

    // Split the number into dollars and cents
    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  // Determine the format string and format the value accordingly
  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  // Replace the placeholder in the format string with the value
  value = formatString.replace(placeholderRegex, value);

  // If enableZeros is false, remove ".00" from the price
  if (enableZeros === false) {
    value = value.replace('.00', '');
  }

  return value;
}

// Update Shopify object with new function
// Then export to rest of app
Shopify.formatMoney = formatMoney;
export { Shopify };