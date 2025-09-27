import { notification } from "antd";
import styles from "./useNotification.module.scss";
import { ReactComponent as OutlineIcon } from "../../icons/outline-outer.svg";

const useNotification = () => {
  const openNotification = (
    type: string | "success" | "error" | "info" | "warning",
    title: string,
    description?: string,
    icon?: any,
    showUndo?: boolean,
    handleUndo?: () => void
  ) => {
    const key = `${type}-${Date.now()}`;
    const handleClickUndo = () => {
      if (handleUndo) {
        handleUndo();
      }
      notification.destroy(key); // close this notification immediately
    };
    notification.open({
      key,
      message: (
        <div className={styles.content}>
          <div className={styles.iconWrapper}>{icon ?? <OutlineIcon />}</div>
          <div className={styles.textWrapper}>
            <div className={styles.title}>{title}</div>
            {description && (
              <div className={styles.description}>{description}</div>
            )}
            {showUndo && (
              <div className={styles.undo} onClick={handleClickUndo}>
                undo
              </div>
            )}
          </div>
        </div>
      ),
      className: styles.customNotification,
      closeIcon: <span className={styles.close}>×</span>,
      duration: 3,
    });
  };

  return {
    success: (
      title: string,
      description?: string,
      type?: string,
      icon?: any,
      showUndo?: boolean,
      handleUndo?: () => void
    ) =>
      openNotification(
        type ?? "success",
        title,
        description,
        icon,
        showUndo,
        handleUndo
      ),
  };
};

export default useNotification;
