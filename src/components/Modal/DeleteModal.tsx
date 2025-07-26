import type React from "react"
import { ReactComponent as DeleteIconRed } from "../../icons/trash-red.svg";
import { ReactComponent as SpiralBg } from "../../icons/spiralBg1.svg";
import styles from "./DeleteModal.module.scss";
import Modal from "./index";

interface DeleteExpenseModalProps {
  title: string
  desc: string
  show: boolean
  onClose: () => void
  onDelete: () => void
  expenseDetails?: {
    vehicle: string
    plateNumber: string
  }
  data?: any
}

const DeleteModal: React.FC<DeleteExpenseModalProps> = ({
  title,
  desc,
  show,
  onClose,
  onDelete,
  data
}) => {
  const handleDelete = () => {
    onDelete()
    onClose()
  }

  return (<Modal show={show} onClose={onClose}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.bg}>
             <SpiralBg width={150} height={150}/>
             </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>{title}</div>
            <div className={styles.secondaryText}>
              {desc}
              <div className={styles.selectedSecondaryText}>
                {data}
              </div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
  )
}
export default DeleteModal;
