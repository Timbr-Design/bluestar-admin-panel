import { notification } from "antd";
import { ReactComponent as OutlineIcon } from "../../../icons/outline-outer.svg";

/* eslint-disable */
export const formatEpochToDate = (epoch: number) => {
  const date = new Date(epoch * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}