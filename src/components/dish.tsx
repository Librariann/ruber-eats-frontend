import React from "react";
import { DishOption, DishOptionInputType } from "../__api__/types";

interface IDishProps {
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: DishOption[] | null;
}

export const Dish: React.FC<IDishProps> = ({
  description,
  name,
  price,
  isCustomer = false,
  options,
}) => {
  return (
    <div className="px-8 py-4 border hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="mt-8 font-medium">Dish Options:</h5>
          {options?.map((option, index) => (
            <span key={index}>
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
