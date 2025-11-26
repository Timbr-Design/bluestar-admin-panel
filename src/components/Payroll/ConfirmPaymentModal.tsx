import { Modal, Input } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import styles from "./ConfirmPaymentModal.module.scss";
import SecondaryBtn from "../SecondaryBtn";
import PrimaryBtn from "../PrimaryBtn";
import { ReactComponent as CheckFilled } from "../../icons/check-circle-filled.svg";
import { ReactComponent as SpiralBg } from "../../icons/spiralBg1.svg";

interface ConfirmPaymentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
  driverName: string;
  month: string;
  payrollData: {
    calculated: number;
    advance: number;
    rollover: number;
    effective: number;
  };
}

const ConfirmPaymentModal = ({
  open,
  onCancel,
  onConfirm,
  driverName,
  month,
  payrollData,
}: ConfirmPaymentModalProps) => {
  const [amount, setAmount] = useState<number | null>(null);

  const format = (num: number) =>
    `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={420}>
      <div className={styles.confirmModal}>
        <div className={styles.deleteContainer}>
          <CheckFilled />
        </div>
        <div className={styles.bg}>
          <SpiralBg width={120} height={120} />
        </div>

        <h3 className={styles.confirmModal__title}>Confirm Payment</h3>
        <p className={styles.confirmModal__subtitle}>
          For {driverName} – {month}
        </p>

        <div className={styles.confirmModal__box}>
          <div>
            <span>Calculated Payroll</span>
            <span>{format(payrollData.calculated)}</span>
          </div>
          <div>
            <span>Advance Payment (if any)</span>
            <span className={styles.textRed}>
              -{format(payrollData.advance)}
            </span>
          </div>
          <div>
            <span>Past payment rollover</span>
            <span className={styles.textGreen}>
              +{format(payrollData.rollover)}
            </span>
          </div>
          <div className={styles.effectivePayment}>
            <span>Effective Payroll</span>
            <span>{format(payrollData.effective)}</span>
          </div>
        </div>

        <p className={styles.confirmModal__label}>Pay driver</p>
        <Input
          prefix="₹"
          placeholder="Enter amount to pay"
          type="number"
          value={amount ?? ""}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <p className={styles.confirmModal__note}>
          If the driver is not paid fully, the remaining balance will be carried
          over to the next month.
        </p>

        <div className={styles.confirmModal__buttons}>
          <SecondaryBtn btnText="Cancel" onClick={onCancel} />
          <PrimaryBtn
            btnText="Confirm"
            onClick={() => onConfirm(amount)}
            disabled={!amount}
          />
          {/* <button className={styles.btn btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn btn--confirm ${!amount ? "disabled" : ""}`}
            onClick={() => amount && onConfirm(amount)}
            disabled={!amount}
          >
            Confirm
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPaymentModal;
