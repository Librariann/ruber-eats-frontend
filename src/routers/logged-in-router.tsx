import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { NotFound } from "../pages/404";
import Restaurants from "../pages/client/restaurants";
import { MeQuery } from "../__api__/types";

const ClientRouter = [<Route path="/" element={<Restaurants />} />];

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        {data.me.role === "Client" && ClientRouter}
        <Route path="*" element={<NotFound />}></Route>
        {/* <Route path="*" element={<Navigate to="/" replace />}></Route> */}
      </Routes>
    </Router>
  );
};
