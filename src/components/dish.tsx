import React, { ReactChild } from "react";
import { DishOption, DishOptionInputType } from "../__api__/types";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  options?: DishOption[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false,
  options,
  addItemToOrder,
  removeFromOrder,
  isSelected,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex items-center">
          {name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
              onClick={onClick}
            >
              {isSelected ? "삭제" : "추가"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="mt-8 font-medium">음식 추가옵션:</h5>
          <div className="grid gap-2  justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
