/* eslint-disable */
import cn from "classnames";
import { Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PlusIcon } from "../../icons/plus.svg";
import PrimaryBtn from "../../components/PrimaryBtn";
import InvoiceTable from "../../components/InvoiceTable";
import ReceiptTable from "../../components/ReceiptTable";
import { RouteName } from "../../constants/routes";
import { ChangeEvent, useState } from "react";
import styles from "./index.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { RootState } from "../../types/store";
import { setBillingFilter } from "../../redux/slices/billingSlice";

const Billings = () => {
  const [tab, setTab] = useState<"invoice" | "receipt">("invoice");
  const navigate = useNavigate();
  const { filters, invoices, pagination } = useAppSelector(
    (state: RootState) => state.billing
  );

  function handleTabChange(val: "invoice" | "receipt") {
    dispatch(setBillingFilter({ status: undefined, search: undefined }));
    setTab(val);
  }

  const handleAdd = () => {
    if (tab === "invoice") navigate(RouteName.CREATE_INVOICE);
    else navigate(RouteName.CREATE_RECEIPT);
  };
  const dispatch = useAppDispatch();

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setBillingFilter({ search: value }));
  };
  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>Billing</div>
        <div className={styles.text}>
          Manage your source of billing actions here
        </div>
        <div className={styles.headerBtns}>
          <button
            className={cn(styles.headerBtn, {
              [styles.selected]: tab === "invoice",
            })}
            onClick={() => handleTabChange("invoice")}
          >
            Invoices
          </button>
          <button
            className={cn(styles.headerBtn, {
              [styles.selected]: tab === "receipt",
            })}
            onClick={() => handleTabChange("receipt")}
          >
            Receipts
          </button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.headerText}>
            <div className={styles.headerPrimary}>
              {tab === "invoice" ? "Invoices" : "Receipts"}
            </div>
            <div className={styles.headerSecondary}>
              {tab === "invoice"
                ? "Create and manage your invoices here"
                : "Create and manage your receipts here"}
            </div>
          </div>
          <div className={styles.searchContainer}>
            <div className={styles.search}>
              {/* <SearchComponent
                 value={filters.search}
                 onChange={searchHandler}
                LeadingIcon={SearchIcon}
                
              /> */}
              <Input
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={searchHandler}
                className={styles.inputContainer}
                placeholder={
                  tab === "invoice"
                    ? `Search by customer, booked by, passenger`
                    : `Search by customer name, group, allowance`
                }
              />
            </div>
            <PrimaryBtn
              onClick={handleAdd}
              LeadingIcon={PlusIcon}
              btnText={`Add ${tab}`}
            />
            {/* <Dropdown menu={{ items: vehicleItems }} trigger={["click"]}>
            <DotsIcon />
          </Dropdown> */}
          </div>
        </div>
        <div className={styles.table}>
          {tab === "invoice" ? <InvoiceTable /> : <ReceiptTable />}
        </div>
      </div>
    </div>
  );
};

export default Billings;
