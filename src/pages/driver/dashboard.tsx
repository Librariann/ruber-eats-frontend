import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import {
  CoockedOrdersSubscription,
  CoockedOrdersSubscriptionVariables,
  TakeOrderMutation,
  TakeOrderMutationVariables,
  TakeOrderOutput,
} from "../../__api__/types";
import { Link, useNavigate } from "react-router-dom";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICorrds {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;

export const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICorrds>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //TODO: Direction API를 사용하여 배달경로 표시..
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: coockedOrdersData } = useSubscription<
    CoockedOrdersSubscription,
    CoockedOrdersSubscriptionVariables
  >(COOCKED_ORDERS_SUBSCRIPTION);
  useEffect(() => {
    //TODO: 배달원에게 배달경로 미리보기
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [coockedOrdersData]);

  const navigate = useNavigate();
  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigate(`/orders/${coockedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, { onCompleted });
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          defaultCenter={{ lat: driverCoords.lat, lng: driverCoords.lng }}
          bootstrapURLKeys={{ key: "AIzaSyBd_MAP2wPOLDgc4XW2XOR2yS5QWnXt7m8" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng}></Driver>
        </GoogleMapReact>
      </div>
      <div className="jmax-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Coocked Order
            </h1>
            <h4 className="text-center my-3 text-2xl font-medium">
              Pick it up soon! @{" "}
              {coockedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() =>
                triggerMutation(coockedOrdersData?.cookedOrders.id)
              }
              className="btn block text-center w-full mt-5"
            >
              Accept challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet!</h1>
        )}
      </div>
    </div>
  );
};
