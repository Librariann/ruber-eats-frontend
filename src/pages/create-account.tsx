import { gql, useMutation } from "@apollo/client";
import React from "react";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import FormError from "../components/form-error";
import {
  CreateAccountMutationMutation,
  CreateAccountMutationMutationVariables,
  UserRole,
} from "../__api__/types";
import ruberLogo from "../images/eats_logo.svg";
import Button from "../components/button";
import { Link, useNavigate } from "react-router-dom";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    formState: { errors, isValid },
    formState,
    handleSubmit,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutationMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      //redirect
      navigate("/");
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<
    CreateAccountMutationMutation,
    CreateAccountMutationMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Ruber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={ruberLogo} className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 mb-5 w-full"
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.password?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input type="password" name="dummyPwd" className="hidden" />
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 9,
            })}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <select {...register("role", { required: "true" })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
