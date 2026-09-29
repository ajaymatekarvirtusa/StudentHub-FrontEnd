// Same rules as CountryRequestValidator in the API (the API still validates too).
export function validateCountry({ name, code }) {
  const errors = {};
  const trimmedName = name?.trim() ?? "";
  const trimmedCode = code?.trim() ?? "";

  if (!trimmedName) errors.name = "Country name is required.";
  else if (trimmedName.length > 100) errors.name = "Country name must not exceed 100 characters.";
  else if (!/^[\p{L} .'\-()]+$/u.test(trimmedName)) errors.name = "Country name can contain only letters, spaces and . ' - ( )";

  if (!trimmedCode) errors.code = "Country code is required.";
  else if (!/^[A-Za-z]{2,3}$/.test(trimmedCode)) errors.code = "Country code must be 2 or 3 letters (ISO 3166), e.g. IN or IND.";

  return errors;
}
