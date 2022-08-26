import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, []);
  return <h1>Search page</h1>;
};

export default Search;
