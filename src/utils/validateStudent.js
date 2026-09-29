// Same rules as StudentDetailValidator in the API, so users get instant feedback.
// The API still validates too - this is only for a better experience.
export function validateStudent({ name, dob, mobileNo }) {
  const errors = {};

  if (!name?.trim()) errors.name = "Name is required.";
  else if (name.trim().length > 150) errors.name = "Name must not exceed 150 characters.";

  if (mobileNo && !/^\d{10}$/.test(mobileNo)) {
    errors.mobileNo = "Mobile number must be exactly 10 digits.";
  }

  if (dob) {
    const date = new Date(`${dob}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(date.getTime()) || date >= today) {
      errors.dob = "Date of birth must be a valid past date.";
    }
  }

  return errors;
}
