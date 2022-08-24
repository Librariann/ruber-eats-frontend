import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/header";
import useMe from "../hooks/useMe";
import { NotFound } from "../pages/404";
import Restaurants from "../pages/client/restaurants";
import ConfirmEmail from "../pages/user/confirm-email";

const ClientRouter = [
  <Route key={1} path="/" element={<Restaurants />} />,
  <Route key={2} path="confirm" element={<ConfirmEmail />} />,
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
      <Header email={data.me.email} />
      <Routes>
        {data.me.role === "Client" && ClientRouter}
        <Route path="*" element={<NotFound />}></Route>
        {/* <Route path="*" element={<Navigate to="/" replace />}></Route> */}
      </Routes>
    </Router>
  );
};
