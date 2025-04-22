"use client";
import { InputField } from "./InputField"; 
export const CustomerAddUser = ({
  formValues,
  handleInputChange,
  errors,

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
          name="personName"
          value={formValues.personName}
          onChange={handleInputChange}
          error={errors.personName}
        />
      </div>

      <div className="mb-4">
        <InputField
          label="Contact Number"
          name="contactNumber"
          value={formValues.contactNumber}
          onChange={handleInputChange}
          error={errors.contactNumber}
        />
      </div>
      

      <div className="mb-4">
        <InputField
          label="Email"
          name="Email"
          placeholder={`abc@${
            formValues.companyName?.toLowerCase()?.replace(/\s/g, "") ||
            "company"
          }.com`}
          value={formValues.Email}
          onChange={handleInputChange}
          error={errors.Email}
        />
      </div>
    </>
  );
};
