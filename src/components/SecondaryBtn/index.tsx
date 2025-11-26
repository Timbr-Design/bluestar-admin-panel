/* eslint-disable */
import styles from "./index.module.scss";

interface ISecondaryBtn extends Partial<HTMLButtonElement> {
  LeadingIcon?: any;
  btnText: string;
  onClick: VoidFunction;
  style?: any;
}

const SecondaryBtn = ({
  btnText,
  LeadingIcon,
  onClick,
  style,
}: ISecondaryBtn) => {
  return (
    <button
      type={"button"}
      className={styles.container}
      onClick={onClick}
      style={style}
    >
      {LeadingIcon ? <LeadingIcon /> : null}
      <div className={styles.text}>{btnText}</div>
    </button>
  );
};

export default SecondaryBtn;
