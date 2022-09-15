import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICorrds {
  lat: number;
  lng: number;
}

export const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICorrds>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<any>();
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
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
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
          <div
            //@ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lat}
            className="h-8 w-8 rounded-full flex justify-center items-center text-lg"
          >
            🛵
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};
