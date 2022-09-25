import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import Restaurant from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CategoryQuery, CategoryQueryVariables } from "../../__api__/types";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

type Params = {
  slug: string;
};

const Category = () => {
  const params = useParams<Params>();

  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug + "",
        },
      },
    }
  );

  console.log(data);

  return (
    <div className="mx-5 mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
      {data?.category.restaurants?.map((restaurant, index) => (
        <Restaurant
          key={restaurant.id}
          id={restaurant.id + ""}
          coverImage={restaurant.coverImage}
          name={restaurant.name}
          categoryName={restaurant.category?.name}
        />
      ))}
    </div>
  );
};

export default Category;
