/* eslint-disable */

import { ChangeEventHandler } from "react";
import styles from "./index.module.scss";
import { Input } from "antd";
import cn from "classnames";
import { ReactComponent as SearchIcon } from "../../icons/SearchIcon.svg";
interface ISearchComponent {
  LeadingIcon?: any;
  value: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  customClass?: string;
}

const SearchComponent = ({
  value,
  onChange,
  LeadingIcon,
  placeholder,
  customClass,
}: ISearchComponent) => {
  return (
    <Input
      value={value}
      defaultValue={value}
      prefix={<SearchIcon />}
      suffix={<></>}
      onChange={onChange}
      allowClear
      className={cn(customClass, "custom-search")}
      placeholder={placeholder}
    />
  );
};

export default SearchComponent;
