/* eslint-disable */
import { Select, Dropdown, Form, Input, DatePicker } from "antd";
import PrimaryBtn from "../PrimaryBtn";
import CancelBtn from "../CancelBtn";
import { ReactComponent as CheckIcon } from "../../icons/check.svg";
import { ReactComponent as ArrowLeftOutlined } from "../../icons/arrow-left-blue.svg";
import InvoiceForm from "./InvoiceForm";
import ReceiptForm from "./ReceiptForm";

import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/store";

interface IBillingsSection {
  isEdit: boolean;
  isInvoice: boolean;
}

const BillingsSection = ({ isEdit, isInvoice }: IBillingsSection) => {
  const [dropdownValue, setDropdownValue] = useState<string>("BlueStar Prime");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {currentSelectedInvoice} = useAppSelector((state)=>state.invoice)

  const handleCancel = ()=>{
    navigate(RouteName.BILLINGS);
  }

    useEffect(() => {
      if (currentSelectedInvoice && Object.keys(currentSelectedInvoice).length) {
        form.setFieldsValue({
          amount: currentSelectedInvoice.amount,
          date: currentSelectedInvoice.date,
          expenseTypes: currentSelectedInvoice.expenseTypes,
          isActive: currentSelectedInvoice.isActive,
          notes:currentSelectedInvoice.notes,
          paymentMode: currentSelectedInvoice.paymentMode,
        });
      }
      else form.resetFields();
    }, [currentSelectedInvoice]);

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <a href="/billings" className={styles.backBtn}>
          <ArrowLeftOutlined />
          {isInvoice ? "Back to Invoices" : "Back to Receipts"}
        </a>
        <div className={styles.headingSection}>
          <div className={styles.header}>
            {isInvoice ? "Create invoice" : "New Receipt"}
          </div>
          <div className={styles.leftHeader}>
            {isInvoice && <div className={styles.text}>Billing as: </div>}
            {isInvoice && <Select value={dropdownValue} />}
            {isInvoice && <div className={styles.dash} />}
            <CancelBtn btnText="Cancel" onClick={handleCancel} />
            <PrimaryBtn
              btnText={isInvoice ? "Save Invoice" : "Save Receipt"}
              onClick={() => isInvoice ? form.submit() : {}}
              LeadingIcon={CheckIcon}
            />
          </div>
        </div>
      </div>
      {isInvoice ? <InvoiceForm form={form}/> : <ReceiptForm />}
    </div>
  );
};

export default BillingsSection;
