import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col">
        <div
          style={{ backgroundImage: `url(${coverImage})` }}
          className="py-28 bg-center bg-cover mb-2"
        ></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-300">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};

export default Restaurant;
