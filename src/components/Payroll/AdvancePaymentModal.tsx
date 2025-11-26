import { Modal, Input } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import styles from "./AdvancePaymentModal.module.scss";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";
import { ReactComponent as CheckFilled } from "../../icons/check-circle-filled.svg";
import { ReactComponent as SpiralBg } from "../../icons/spiralBg1.svg";
import classNames from "classnames";

interface AdvancePaymentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
  driverName: string;
  month: string;
}

const AdvancePaymentModal = ({
  open,
  onCancel,
  onConfirm,
  driverName,
  month,
}: AdvancePaymentModalProps) => {
  const [amount, setAmount] = useState<number | null>(null);

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={400}>
      <div className={styles.advanceModal}>
        <div className={styles.deleteContainer}>
          <CheckFilled />
        </div>
        <div className={styles.bg}>
          <SpiralBg width={200} height={200} />
        </div>

        <h3 className={styles.advanceModal__title}>Advance Payment</h3>
        <p className={styles.advanceModal__subtitle}>
          For {driverName} – {month}
        </p>

        <p className={styles.advanceModal__label}>
          Record advance payment made to the driver
        </p>

        <Input
          prefix="₹"
          placeholder="Enter advance amount"
          type="number"
          value={amount ?? ""}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <div className={styles.advanceModal__buttons}>
          <SecondaryBtn
            btnText="Cancel"
            onClick={onCancel}
            className={styles.btnCancel}
          />
          <PrimaryBtn
            btnText="Confirm"
            onClick={() => onConfirm(amount)}
            disabled={!amount}
            className={classNames(styles.btnConfirm, {
              [amount]: styles.disabled,
            })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AdvancePaymentModal;
