import { gql, useQuery } from "@apollo/client";
import { url } from "inspector";
import React from "react";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__api__/types";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  console.log(data);
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md border-0 w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="px-5 mt-8 max-w-screen-2xl mx-auto">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map((category, index) => (
              <div className="flex flex-col group items-center cursor-pointer">
                <div
                  className="w-16 h-16 bg-cover group-hover:bg-gray-200 rounded-full"
                  style={{ backgroundImage: `url(${category.coverImage})` }}
                  key={index}
                ></div>
                <span className="mt-1 text-sm text-center font-bold">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <div>
                <div
                  style={{ backgroundImage: `url(${restaurant.coverImage})` }}
                  className="py-28 bg-center bg-cover mb-2"
                ></div>
                <h3 className="text-xl font-medium">{restaurant.name}</h3>
                <span className="border-t-2 border-gray-200">
                  {restaurant.category?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
