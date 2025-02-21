
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookUser, Building, MapPinned, RectangleEllipsis } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const API_KEY="MHlWWnpWRG9WMWtNbnRBOVZvVmVGUWhyVXJ4em5JYlBKSTZleFk5MQ==";

const CustomerSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formValues, setFormValues] = useState({
    companyName: "",
    registrationNumber: "",
    gstNumber: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    otp: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
    terms: true,
  });

  const selectedCountry = formValues.country;
  const selectedState = formValues.state;
  const Router=useRouter();

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
          console.log(data)
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch States
  const fetchStates = useCallback(async () => {
    if (!selectedCountry) {
      setStates([]);
      setCities([]);
      return;
    }

    try {
      const country = countries.find((c) => c.name === selectedCountry);
      if (!country) return;

      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${country.code}/states`,
        { headers: { "X-CSCAPI-KEY": API_KEY } }
      );

      const data = await response.json();
      setStates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  }, [selectedCountry, countries]);

  // Fetch Cities
  const fetchCities = useCallback(async () => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    try {
      const country = countries.find((c) => c.name === selectedCountry);
      if (!country) return;

      const stateObj = states.find((state) => state.name === selectedState);
      if (!stateObj) return;

      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${country.code}/states/${stateObj.iso2}/cities`,
        { headers: { "X-CSCAPI-KEY": API_KEY } }
      );

      const data = await response.json();
      setCities(Array.isArray(data) ? data.map((city) => city.name) : []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  }, [selectedState, states, countries]);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates();
      handleInputChange({ target: { name: "state", value: "" } });
      handleInputChange({ target: { name: "city", value: "" } });
    }
  }, [selectedCountry, fetchStates]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      fetchCities();
      handleInputChange({ target: { name: "city", value: "" } });
    }
  }, [selectedState, fetchCities]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // const handleOtpChange = (e, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = e.target.value;
  //   setOtp(newOtp);
  // };

  const validateForm = () => {
    let newErrors = {};
    if (!formValues.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formValues.registrationNumber)
      newErrors.registrationNumber = "Registration Number is required";
   
    if (!formValues.gstNumber) newErrors.gstNumber = "GST Number is required";
    if (!formValues.firstName) newErrors.firstName = "First Name is required";
    if (!formValues.lastName) newErrors.lastName = "Last Name is required";
    if (!formValues.phoneNumber.match(/^[0-9]{7,12}$/))
      newErrors.phoneNumber = "Invalid Contact Number";
    if (!formValues.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email";
    } else {
  
      let companyName = formValues.companyName
        ?.toLowerCase()
        .replace(/\s?(pvt|ltd|limited|inc |llp|corp|co)\b/gi, "") 
        .replace(/\./g, "") 
        .trim()
        .replace(/\s+/g, "");  
      const expectedDomain = `@${companyName}.com`;
  
      if (!formValues.email.endsWith(expectedDomain)) {
        newErrors.email = `Email must be in the format abc@${companyName}.com`;
      }
    }
    if (!formValues.otp.match(/^\d{4}$/))
      newErrors.otp = "OTP must be 4 digits";

    if (
      !formValues.password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/)
    )
      newErrors.password =
        "Password must be 8+ chars, with 1 uppercase, 1 number & 1 special char";
    if (formValues.password !== formValues.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    if (!formValues.terms) newErrors.terms = "You must accept the terms";
    if (!formValues.address) newErrors.address = "Address is required";
    if (!formValues.country) newErrors.country = "Country is required";
    if (!formValues.state) newErrors.state = "State is required";
    if (!formValues.city) newErrors.city = "City is required";
    if (!formValues.postalCode)
      newErrors.postalCode = "Postal Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP Function
  const handleOtpRequest = async () => {
    const { email } = formValues;
    if (!email) {
      setOtpMessage("Email is required before requesting OTP.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/auth/customer/customer-sendotp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully!");
      } else {
        setOtpMessage(result.error || "Failed to send OTP");
      }
    } catch (error) {
      setOtpMessage("Error sending OTP. Try again.");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Submission:", formValues); 
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/auth/customer/customer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues), 
      });
  
      const result = await response.json();
  
     
      if (response.ok) {
        Swal.fire({
          title: "Signup Successful!",
          text: "You have successfully signed up.",
          icon: "success",  
          confirmButtonColor: "#4BB543", 
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            Router.push('./SignIn')
          }
        });;
      } else {
        Swal.fire({
          title: "Signup Failed",
          text: result.message || "Please try again later.",
          icon: "error", 
          confirmButtonColor: "#D9534F", 
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error Occurred",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error", 
        confirmButtonColor: "#D9534F", 
        confirmButtonText: "Close",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <div className="bg-[#549DA9] w-full font-sans h-[250px] flex flex-col justify-center items-center text-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-14 h-12 md:w-14 md:h-14 pb-2 rounded-xl bg-black flex items-center justify-center text-white text-2xl font-semibold">
            M
          </div>
          <span className="text-4xl font-semibold text-black">M-Place</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white">
          Expand Your Business with M-Place!
        </h1>
        <p className="mt-3 text-lg text-gray-100">
          Register today and gain access to a marketplace of trusted buyers.
        </p>
      </div>

      <div className="w-full min-h-screen flex flex-col items-center justify-center pt-10 pl-12 bg-gray-50">
        <div className="w-full md:w-2/3 p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section
              title="Business Info"
              icon={<Building className="text-black w-6 h-6" />}
            >
              <div>
                <InputField
                  label="Company Name"
                  name="companyName"
                  value={formValues.companyName}
                  onChange={handleInputChange}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>

              <div>
                <InputField
                  label="Registration Number"
                  name="registrationNumber"
                  value={formValues.registrationNumber}
                  onChange={handleInputChange}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-500">
                    {errors.registrationNumber}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  label="GST Number"
                  name="gstNumber"
                  value={formValues.gstNumber}
                  onChange={handleInputChange}
                />
                {errors.gstNumber && (
                  <p className="text-sm text-red-500">{errors.gstNumber}</p>
                )}
              </div>
            </Section>

            <Section
              title="Contact Details"
              icon={<BookUser className="text-black w-6 h-6" />}
            >
              <div>
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <InputField
                  label=" Email"
                  name="email"
                  placeholder="abc@companyname.com"
                  value={formValues.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  onOtpRequest={handleOtpRequest}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>


            <div>
            <InputField
                id="otp"
                label="OTP"
                name="otp"
                value={formValues.otp}
                onChange={handleInputChange}
                
              />
                {errors.otp && (
                  <p className="text-sm text-red-500">{errors.otp}</p>
                )}
            </div>
             
              {otpMessage && (
                <p
                  className={`text-sm ${
                    otpSent ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {otpMessage}
                </p>
              )}
            </Section>

            <Section
              title="Address Details"
              icon={<MapPinned className="text-black w-6 h-6" />}
            >
              {/* <div className="grid grid-cols-2 gap-3 w-full"> */}

            <div>
            <InputField
                label="Address"
                name="address"
                value={formValues.postalCode}
                onChange={handleInputChange}
                error={errors.postalCode}
              />

              {errors.address&&(
                 <p className="text-sm text-red-500">{errors.address}</p>
              )}

            </div>
             

              <div className="mt-2">
                <Label>Country</Label>
                <select
                  name="country"
                  value={formValues.country}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              <div>
                <Label>State</Label>
                <select
                  name="state"
                  value={formValues.state}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.iso2} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state}</p>
                )}
              </div>

              <div>
                <Label>City</Label>
                <select
                  name="city"
                  value={formValues.city}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

             <div>
             <InputField
                label="Postal Code"
                name="postalCode"
                value={formValues.postalCode}
                onChange={handleInputChange}
                error={errors.postalCode}
              />
               {errors.postalCode && (
                  <p className="text-sm text-red-500">{errors.postalCode}</p>
                )}

             </div>
             
              
            </Section>
            {/* Password */}
            <Section
              title="Create Password"
              icon={<RectangleEllipsis className="text-black w-7 h-10 " />}
            >
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}


                <div
                  className="absolute right-3 top-[39px] transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full"
                />
      
                <div
                  className="absolute right-3 top-[39px] transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </div>
              </div>
            </Section>

            {/* Terms and Conditions */}
            <div className="flex items-start pl-2 gap-2 ml-1 relative">
              <Checkbox
                className=""
                id="terms"
                checked={formValues.terms}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    terms: e.target.checked,
                  }))
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer"
              >
                By Signing Up, you must agree to our
                <a href="#" className="text-teal-500 hover:underline ml-1">
                  Terms
                </a>
                ,
                <a href="#" className="text-teal-500 hover:underline mx-1">
                  Privacy Policy
                </a>{" "}
                and
                <a href="#" className="text-teal-500 hover:underline ml-1">
                  Cookie Policy
                </a>
                .
              </label>
            </div>

            <Button type="submit" className="ml-[350px] bg-[#549DA9] hover:bg-black">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);
const InputField = ({ label, name, value, onChange, onOtpRequest, type,placeholder }) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <div className="relative">
      <Input
        id={name}
        type={type || "text"}
        placeholder={placeholder||label}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
      />
      {name === "email" && (
        <button
          type="button"
          onClick={onOtpRequest}
        
          className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-medium"
        >
        Get OTP
        </button>
      )}
    </div>
  </div>
);

export default CustomerSignup;
