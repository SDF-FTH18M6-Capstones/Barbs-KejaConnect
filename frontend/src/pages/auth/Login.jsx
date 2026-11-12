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