import React from "react";

export const useUserFormValidation = () => {
  const validateForm = (formValues) => {
    let newErrors = {};
    if (!formValues.companyName)
      newErrors.companyName = "Company Name is required";

    if (!formValues.personName)
      newErrors.personName = "Person Name is required";

    if (
      !formValues.contactNumber ||
      !/^[0-9]{7,12}$/.test(formValues.contactNumber)
    ) {
      newErrors.contactNumber = "Invalid Contact Number";
    }

    if (!formValues.Email) {
      newErrors.Email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.Email)) {
      newErrors.Email = "Invalid email format";
    } else {
      const CompanyName = formValues.companyName
        ?.toLowerCase()
        .replace(/\s?(pvt|ltd|limited|inc|llp|corp|co)\b/gi, "")
        .replace(/\./g, "")
        .trim()
        .replace(/\s+/g, "");

      if (!formValues.Email.endsWith(`@${CompanyName || "companyName"}.com`)) {
        newErrors.Email = `Email must be in the format example@${
          CompanyName ? CompanyName : "companyName"
        }.com`;
      }
    }

    if (
      !formValues.password ||
      !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/.test(formValues.password)
    ) {
      newErrors.password =
        "Password must be 8+ chars, with 1 uppercase, 1 number & 1 special char";
    }

    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  return { validateForm };
};
