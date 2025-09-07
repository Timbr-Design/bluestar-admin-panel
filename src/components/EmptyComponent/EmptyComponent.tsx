/* eslint-disable */

import React from "react";
import styles from "./EmptyComponent.module.scss";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";

interface EmptyComponentProps {
  backgroundImageIcon: any;
  upperImageIcon: any;
  headerText?: string;
  descText?: string;
  btnLeadingIcon?: any;
  handleCTA?: () => void;
  btnText?: string;
}

const EmptyComponent: React.FC<EmptyComponentProps> = ({
  backgroundImageIcon,
  upperImageIcon,
  headerText,
  descText,
  btnLeadingIcon,
  handleCTA,
  btnText,
}) => {
  return (
    <div className={styles.emptyState}>
      {backgroundImageIcon}
      <div className={styles.background}>{upperImageIcon}</div>
      <div className={styles.emptyText}>
        <div>
          <div className={styles.headerText}>{headerText}</div>
          <div className={styles.descText}>{descText}</div>
        </div>
        <div>
          {handleCTA && (
            <SecondaryBtn
              onClick={handleCTA}
              LeadingIcon={btnLeadingIcon}
              btnText={`${btnText}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyComponent;
