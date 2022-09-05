import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__api__/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import { Helmet } from "react-helmet";
import FormError from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useNavigate } from "react-router-dom";

/**
 * 음식점 생성후 백엔드에서 restaurantId를 받아 프론트엔드에서 fake한다
 */

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurants(input: $input) {
      ok
      error
      restaurantId
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
  const client = useApolloClient();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState();
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurants: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address, file } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log(queryResult);
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImage: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult?.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate("/");
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    //refetchQuery의 작업은 mutation 작업이 끝나면 자동으로 일어난다
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
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
      setImageUrl(coverImage);
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
