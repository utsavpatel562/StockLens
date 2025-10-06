"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => console.log(data);

  return (
    <div>
      <h1 className="form-title">Sign Up & Personalize</h1>
    </div>
  );
};

export default SignUp;
