// import AuthLayout from "../../components/auth/AuthLayout";
// export default function Login() {
//   return (
//     <AuthLayout>
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-3xl font-bold">Log in</h2>

//           <p className="mt-2 text-text-muted">
//             Welcome back. Enter your details to continue.
//           </p>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import PasswordInput from "../../components/auth/PasswordInput";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });

    setMessage("");
  }
   function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setMessage("Frontend validation successful! Backend login is not connected yet.");
  }

  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* Page heading */}
        <div>
          <h2 className="text-3xl font-bold">Log in</h2>

          <p className="mt-2 text-text-muted">
            Welcome back. Enter your details to continue.
          </p>
        </div>