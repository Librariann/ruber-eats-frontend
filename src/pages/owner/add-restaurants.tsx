import { gql, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__api__/types";
import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import Button from "../../components/button";
import { Helmet } from "react-helmet";
import FormError from "../../components/form-error";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurants(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurants = () => {
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurants: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, categoryName, address, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Ruber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          {...register("address", { required: "address is required" })}
          placeholder="address"
        />
        <input
          className="input"
          type="text"
          {...register("name", { required: "name is required" })}
          placeholder="name"
        />
        <input
          className="input"
          type="text"
          {...register("categoryName", {
            required: "categoryName is required",
          })}
          placeholder="categoryName"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurants?.error && (
          <FormError errorMessage={data.createRestaurants.error} />
        )}
      </form>
    </div>
  );
};
