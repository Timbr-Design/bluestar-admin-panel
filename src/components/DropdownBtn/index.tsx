/* eslint-disable */
import { Spin } from "antd";
import { useState } from "react";
import styles from "./index.module.scss";

interface IDropdownBtn {
  LeadingIcon?: any;
  btnText: string;
  onClick: any;
  loading?: boolean;
}

const DropdownBtn = ({
  btnText,
  LeadingIcon,
  onClick,
  loading,
}: IDropdownBtn) => {
  return (
    <button className={styles.container} type={"button"} onClick={onClick}>
      {loading && <Spin size="small" />}
      {LeadingIcon ? <LeadingIcon /> : null}
      <div className={styles.text}>{btnText}</div>
    </button>
  );
};

export default DropdownBtn;
