// eslint-disable-next-line import/prefer-default-export
export function parseLargeNumber(number) {
  const numberString = number.toString();
  if (numberString.length <= 3) {
    return numberString;
  }
  // TODO add for millions if needed
  let splitedNumber = numberString.replace(/\D/g, '');
  splitedNumber = splitedNumber.split('');
  splitedNumber.splice(splitedNumber.length - 2, 2);
  splitedNumber.splice(splitedNumber.length - 1, 0, '.');
  splitedNumber.splice(splitedNumber.length, 0, 'k');
  return splitedNumber.join('');
}
/* function process number, return string contains incoming number;
if number have 4-6 digits return number without 2 last digits, with 'k' letter in the end, with dot than separate hundred rank */
