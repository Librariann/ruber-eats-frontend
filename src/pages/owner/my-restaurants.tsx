import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  MyRestaurantsQuery,
  MyRestaurantsQueryVariables,
} from "../../__api__/types";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery, MyRestaurantsQueryVariables>(
    MY_RESTAURANTS_QUERY
  );
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Ruber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="ml-5 text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 && (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        )}
        {data?.myRestaurants.ok &&
          data.myRestaurants.restaurants.length > 0 &&
          data.myRestaurants.restaurants.map((restaurant, index) => (
            <div key={index}>{restaurant.name}</div>
          ))}
      </div>
    </div>
  );
};
