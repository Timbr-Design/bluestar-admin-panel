import type React from "react"
import { ReactComponent as DeleteIconRed } from "../../icons/trash-red.svg";
import { ReactComponent as SpiralBg } from "../../icons/spiralBg1.svg";
import styles from "./DeleteModal.module.scss";
import Modal from "./index";

interface DeleteExpenseModalProps {
  title: string
  show: boolean
  onClose: () => void
  onDelete: () => void
  expenseDetails?: {
    vehicle: string
    plateNumber: string
  }
}

const DeleteModal: React.FC<DeleteExpenseModalProps> = ({
  title,
  show,
  onClose,
  onDelete,
  expenseDetails = { vehicle: "Swift Dzire", plateNumber: "RJ90AB8264" }
}) => {
  const handleDelete = () => {
    onDelete()
    onClose()
  }

  return (
    <Modal show={show} onClose={onClose}>
      <div className={styles.deleteExpenseContent}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <DeleteIconRed className={styles.trashIcon} cursor={'pointer'}/>
          </div>
          <div className={styles.bg}>
            <SpiralBg width={200} height={200}/>
            </div>
          
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.confirmText}>Are you sure you want to delete this expense?</p>
          <p className={styles.detailText}>
            Car: {expenseDetails.vehicle} | {expenseDetails.plateNumber}
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}
export default DeleteModal;

// Demo component to show the modal
// export default function Component() {
//   const [showModal, setShowModal] = useState(true)

//   const handleDelete = () => {
//     console.log("Expense deleted")
//   }

//   return (
//     <div className={styles.demoContainer}>
//       <button className={styles.triggerButton} onClick={() => setShowModal(true)}>
//         Show Delete Modal
//       </button>

//       <DeleteModal show={showModal} onClose={() => setShowModal(false)} onDelete={handleDelete} />
//     </div>
//   )
// }
