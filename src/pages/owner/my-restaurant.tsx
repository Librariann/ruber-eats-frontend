import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryVoronoiContainer,
} from "victory";
import { Dish } from "../../components/dish";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  PendingOrdersSubscription,
  PendingOrdersSubscriptionVariables,
} from "../../__api__/types";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    findOneMyRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

type IParams = {
  id: string;
};

export const MyRestaurant = () => {
  const { id } = useParams() as unknown as IParams;
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subscriptionData } = useSubscription<
    PendingOrdersSubscription,
    PendingOrdersSubscriptionVariables
  >(PENDING_ORDERS_SUBSCRIPTION);
  const navigate = useNavigate();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      navigate(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]); //[subscriptionData] -> subscriptionData가 변할때마다 useEffect 실행됨
  return (
    <div>
      <Helmet>
        <title>
          {data?.findOneMyRestaurant.restaurant?.name || "Loading..."} | Nuber
          Eats
        </title>
      </Helmet>
      <div
        className="  bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.findOneMyRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="ml-5 container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.findOneMyRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurants/${id}/add-dish`}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          음식추가 &rarr;
        </Link>
        {/* <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
          프로모션 구매 &rarr;
        </Link> */}
        <div className="mt-10">
          {data?.findOneMyRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">음식을 업로드 해주세요!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.findOneMyRestaurant.restaurant?.menu.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="mt-10">
            <VictoryChart
              width={window.innerWidth}
              height={500}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryLabel
                    style={{ fontSize: 18 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.findOneMyRestaurant.restaurant?.orders.map(
                  (order) => ({ x: order.createdAt, y: order.total })
                )}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: {
                    fontSize: 20,
                  },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
