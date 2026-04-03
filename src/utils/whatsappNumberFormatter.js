const formatWhatsAppNumber = (phone, defaultCountry = "91") => {
  if (!phone) return null;

  // Remove everything except digits
  let num = phone.replace(/\D/g, "");

  // If number starts with 00 (international format)
  if (num.startsWith("00")) {
    num = num.slice(2);
  }

  // If number starts with 0 → remove leading 0 (India / many countries)
  if (num.startsWith("0")) {
    num = num.slice(1);
  }

  // If number length is 10 → assume India (or default country)
  if (num.length === 10) {
    num = defaultCountry + num;
  }

  // If number length < 10 → invalid
  if (num.length < 10) return null;

  return num; // returns without +
};

export {
    formatWhatsAppNumber
}