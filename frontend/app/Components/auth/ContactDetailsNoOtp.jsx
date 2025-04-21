"use client";
import { InputField } from "./InputField";

export const ContactDetailsNoOtp = ({
  formValues,
  handleInputChange,
  errors
  
}) => {
  return (
    <>
      <div>
        <InputField
          label="Company Name"
          name="companyName"
          value={formValues.companyName}
          onChange={handleInputChange}
          error={errors.companyName}
          disabled={true}
        />
      </div>

      <div className="mb-4">
        <InputField
          label="Person Name"
          name="personName" // ✅ updated to match state key
          value={formValues.personName || ""} // ✅ updated to match state key
          onChange={handleInputChange}
          error={errors.personName} // ✅ updated to match state key
        />
      </div>

      <div className="mb-4">
        <InputField
          label="Contact Number"
          name="phoneNumber"
          value={formValues.phoneNumber || ""}
          onChange={handleInputChange}
          error={errors.phoneNumber}
        />
      </div>

      <div className="mb-4">
        <InputField
          label="Email"
          name="Email"
          placeholder={`abc@${
            formValues.companyName?.toLowerCase()?.replace(/\s/g, "") || "company"
          }.com`}
          value={formValues.Email || ""}
          onChange={handleInputChange}
          error={errors.Email}
        />
      </div>
    </>
  );
};
