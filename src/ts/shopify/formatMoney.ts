import { createLogger } from "vite";

export default function formatMoney(
  cents: string | number,
  currency: string,
  showCurrency?: boolean,
  format = "amount",
  subunits = '100'
) {
  // Convert string cents to number
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }

  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  let formatString;
  let isISO = false;
  const isoCurrencyRegex = /^[A-Z]{3}$/;
  if(isoCurrencyRegex.test(currency)) {
    isISO = true;
  } 

  if (currency && showCurrency && !isISO) {
    formatString = `${currency + `{{ ${format} }}`}`;
  } else if(currency && showCurrency && isISO) {
    formatString = `${`{{ ${format} }}` + ' ' + currency}`;
  } else if (showCurrency) {
    formatString = "$" + `{{ ${format} }}`;
  } else {
    formatString = `{{ ${format} }}`;
  }

  // Set default options
  function defaultOption<T>(opt: T | undefined, def: T): T {
    return typeof opt == "undefined" ? def : opt;
  }

  // Format number with delimiters
  function formatWithDelimiters(
    number: number,
    precision?: number,
    thousands?: string,
    decimal?: string
  ) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return "0";
    }

    if(subunits === '1000'){
      precision = 3
    }

    // Adjust the number to account for subunits
    number = number / 100;

    const numberString = number.toFixed(precision);

    const parts = numberString.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return String(dollars + cents);
  }

  // Determine the format based on the placeholder
  switch (formatString.match(placeholderRegex)![1]) {
    case "amount":
      value = formatWithDelimiters(cents as number, 2);
      break;
    case "amount_no_decimals":
      // Check if the numberString ends with "00"
      const numberString = (cents as number / 100).toFixed(2);
      if (numberString.endsWith("00")) {
        value = formatWithDelimiters(cents as number, 0);
      } else {
        // Format as if format was "amount" since it doesn't end with "00"
        value = formatWithDelimiters(cents as number, 2);
      }
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents as number, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents as number, 0, ".", ",");
      break;
  }

  // Replace the placeholder with the formatted value
  return formatString.replace(placeholderRegex, value);
}
