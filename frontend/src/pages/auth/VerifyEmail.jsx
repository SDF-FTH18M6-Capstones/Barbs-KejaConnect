import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();