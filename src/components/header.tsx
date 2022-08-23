import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import useMe from "../hooks/useMe";
import ruberLogo from "../images/eats_logo.svg";

interface IHeaderProps {
  email: string;
}

const Header: React.FC<IHeaderProps> = () => {
  const { data } = useMe(); //useMe hooks에 정보들은 cache에 저장되어 cache에서 데이터를 불러온다
  return (
    <header className="py-4">
      <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
        <img src={ruberLogo} className="w-36" alt="Ruber Eats" />
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-xl" />
          </Link>
        </span>
      </div>
    </header>
  );
};

export default Header;
