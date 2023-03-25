export default function formatMoney(
  cents: string | number,
  currency?: string
) {
  // Convert string cents to number
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }

  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = currency
    ? `${currency + "{{ amount }}"}`
    : "${{ amount }}";

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

    const numberString = (number / 100.0).toFixed(precision);

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
      value = formatWithDelimiters(cents as number, 0);
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
