import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";

interface IheaderProps {
  darkModeOnOff: () => void;
}

const Header: React.FC<IheaderProps> = ({ darkModeOnOff }) => {
  const { data } = useMe(); //useMe hooks에 정보들은 cache에 저장되어 cache에서 데이터를 불러온다

  return (
    <>
      {/* {!data?.me.verified && (
        <div className="bg-red-500 py-3 text-center text-sm text-white">
          <span>이메일 인증을 해주세요!</span>
        </div>
      )} */}
      <header className="py-4">
        <div className="w-full px-5 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <span className="w-36 text-3xl">
              Ruber <span className="text-lime-500">Eats</span>
            </span>
          </Link>

          <span className="text-xs">
            <button className="mr-4" onClick={darkModeOnOff}>
              <span>light</span>
              <span>dark</span>
            </button>

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
