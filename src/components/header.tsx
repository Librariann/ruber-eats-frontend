import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import ruberLogo from "../images/eats_logo.svg";

const Header = () => {
  const { data } = useMe(); //useMe hooks에 정보들은 cache에 저장되어 cache에서 데이터를 불러온다
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 py-3 text-center text-sm text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 max-w-screen-2xl mx-auto flex justify-between items-center">
          <span className="w-36 text-3xl">
            Ruber <span className="text-lime-500">Eats</span>
          </span>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl mr-1 -my-1" />
              {data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
