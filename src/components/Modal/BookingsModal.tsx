import type React from "react";
import { ReactComponent as DeleteIconRed } from "../../icons/trash-red.svg";
import { ReactComponent as SpiralBg } from "../../icons/spiralBg1.svg";
import styles from "./DeleteModal.module.scss";
import Modal from "./index";
import { BookingsModalProps } from "../../types/booking";

const BookingsModal: React.FC<BookingsModalProps> = ({
  title,
  desc,
  show,
  onClose,
  handleCTA,
  data,
  actionBtn,
  icon,
  actionBtnColor,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <div className={styles.deleteContainer}>{icon ?? <DeleteIconRed />}</div>
      <div className={styles.bg}>
        <SpiralBg width={200} height={200} />
      </div>
      <div className={styles.modalContainer}>
        <div className={styles.textContainer}>
          <div className={styles.primaryText}>{title}</div>
          <div className={styles.secondaryText}>
            {desc}
            <div className={styles.selectedSecondaryText}>{data}</div>
          </div>
        </div>
        <div className={styles.bottomBtns}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.deleteBtn}
            style={{
              background: actionBtnColor ?? "#d92d20",
            }}
            onClick={() => {
              onClose();
              handleCTA();
            }}
          >
            {actionBtn ? actionBtn : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default BookingsModal;
