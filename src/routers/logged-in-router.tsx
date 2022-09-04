import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import Category from "../pages/client/category";
import RestaurantDetail from "../pages/client/restaurantDetail";
import Restaurants from "../pages/client/restaurants";
import Search from "../pages/client/search";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";

const clientRoutes = [
  {
    path: "/",
    element: <Restaurants />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/category/:slug",
    element: <Category />,
  },
  {
    path: "/restaurants/:id",
    element: <RestaurantDetail />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    element: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    element: <MyRestaurants />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Client" &&
          clientRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        {data.me.role === "Owner" &&
          restaurantRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        {commonRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        <Route path="*" element={<NotFound />}></Route>
        {/* <Route path="*" element={<Navigate to="/" replace />}></Route> */}
      </Routes>
    </Router>
  );
};
