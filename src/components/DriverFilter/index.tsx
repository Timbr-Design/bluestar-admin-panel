/* eslint-disable */
import { ReactComponent as FilterIcon } from "../../icons/filter.svg";
import { Popover, Select } from "antd";
import cn from "classnames";
import { useState, useCallback } from "react";
import styles from "./index.module.scss";

const DriverFilter = () => {
  const [open, setOpen] = useState(false);

  const selectOpen = () => (open ? true : false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const PopoverComponent = () => {
    return (
      <div className={styles.container}>
        <Select
          mode="multiple"
          placeholder="Search driver"
          className={styles.select}
          // popupClassName={cn("menu", { ["dontShow"]: !open })}
          // open={true}
          options={[
            { value: "jack", label: "Jack" },
            { value: "lucy", label: "Lucy" },
            { value: "Yiminghe", label: "yiminghe" },
          ]}
        />
      </div>
    );
  };

  return (
    <Popover
      content={<PopoverComponent />}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      arrow={false}
      placement={"bottomRight"}
    >
      <div className={styles.filter}>
        <FilterIcon />
        <div className={styles.text}>{"Filter driver"}</div>
      </div>
    </Popover>
  );
};

export default DriverFilter;
