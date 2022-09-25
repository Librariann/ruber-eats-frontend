import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import Restaurant from "../../components/restaurant";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__api__/types";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryReadyToStart, { data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }
    queryReadyToStart({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [navigate, location]);
  return (
    <>
      <Helmet>
        <title>Home | Ruber Eats</title>
      </Helmet>
      <div className="mx-5 mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
        {data?.searchRestaurant.restaurants?.length !== 0 ? (
          data?.searchRestaurant.restaurants?.map((restaurant, index) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImage={restaurant.coverImage}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))
        ) : (
          <div className="font-medium">검색된 음식점이 없습니다.</div>
        )}
      </div>
    </>
  );
};

export default Search;
