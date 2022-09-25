import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import Category from "../pages/client/category";
import RestaurantDetail from "../pages/client/restaurantDetail";
import Restaurants from "../pages/client/restaurants";
import Search from "../pages/client/search";
import { DashBoard } from "../pages/driver/dashboard";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurants } from "../pages/owner/add-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";
import { Order } from "../pages/user/order";
import { UserRole } from "../__api__/types";
import { isDarkModeVar } from "../apollo";
import { DARK_MODE_ON_OFF } from "../constants";
import { useReactiveVar } from "@apollo/client";

const clientRoutes = [
  { path: "/", element: <Restaurants /> },
  { path: "/search", element: <Search /> },
  { path: "/category/:slug", element: <Category /> },
  { path: "/restaurants/:id", element: <RestaurantDetail /> },
];

const commonRoutes = [
  { path: "/confirm", element: <ConfirmEmail /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/orders/:id", element: <Order /> },
];

const restaurantRoutes = [
  { path: "/", element: <MyRestaurants /> },
  { path: "/add-restaurants", element: <AddRestaurants /> },
  { path: "/restaurants/:id", element: <MyRestaurant /> },
  { path: "/restaurants/:restaurantId/add-dish", element: <AddDish /> },
];

const driverRoutes = [{ path: "/", element: <DashBoard /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const isDarkMode = useReactiveVar(isDarkModeVar);

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  const darkModeOnOff = () => {
    console.log("test");
    if (!isDarkMode) {
      localStorage.setItem(DARK_MODE_ON_OFF, "true");
    } else {
      localStorage.removeItem(DARK_MODE_ON_OFF);
    }
    isDarkModeVar(!isDarkMode);
  };
  return (
    <div className={`${isDarkMode ? "dark" : "light"}`}>
      <Router>
        <Header darkModeOnOff={darkModeOnOff} />
        <Routes>
          {data.me.role === UserRole.Client &&
            clientRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          {data.me.role === UserRole.Owner &&
            restaurantRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          {data.me.role === UserRole.Delivery &&
            driverRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          {commonRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          <Route path="*" element={<NotFound />}></Route>
          {/* <Route path="*" element={<Navigate to="/" replace />}></Route> */}
        </Routes>
      </Router>
    </div>
  );
};
