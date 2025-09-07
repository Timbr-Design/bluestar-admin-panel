import { notification } from "antd";
import styles from "./useNotification.module.scss";
import { ReactComponent as OutlineIcon } from "../../icons/outline-outer.svg";

const useNotification = () => {
  const openNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description: string
  ) => {
    notification.open({
      message: (
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <OutlineIcon />
          </div>
          <div className={styles.textWrapper}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
          </div>
        </div>
      ),
      className: styles.customNotification,
      closeIcon: <span className={styles.close}>×</span>,
      duration: 3,
    });
  };

  return {
    success: (title: string, description: string) =>
      openNotification("success", title, description),
  };
};

export default useNotification;
