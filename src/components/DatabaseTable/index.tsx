/* eslint-disable */
import { useState, ChangeEvent, useEffect } from "react";
import SearchComponent from "../SearchComponent";
import { Dropdown } from "antd";
import { ReactComponent as SearchIcon } from "../../icons/SearchIcon.svg";
import { ReactComponent as PlusIcon } from "../../icons/plus.svg";
import { ReactComponent as DotsIcon } from "../../icons/dots.svg";
import { ReactComponent as FileDownloadIcon } from "../../icons/fileDownload.svg";
import { ReactComponent as UploadCloud } from "../../icons/uploadCloud.svg";
import DutyTypeTable from "./DutyTypeTable";
import AllowancesTable from "./AllowancesTable";
import BankAccountsTable from "./BankAccountsTable";
import TaxesTable from "./TaxesTable";
import VehicleGroupTable from "./VehicleGroupTable";
import CustomerTable from "./CustomerTable";
import DriversTable from "./DriversTable";
import VehicleTable from "./VehicleTable";
import FastTagTable from "./FastTagTable";
import PrimaryBtn from "../PrimaryBtn";
import styles from "./index.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  deleteAllowance,
  deleteBankAccount,
  deleteCustomer,
  deleteDriver,
  deleteDutyType,
  deleteTax,
  deleteVehicle,
  deleteVehicleGroup,
  setQueryForSearch,
} from "../../redux/slices/databaseSlice";
import { RootState } from "../../types/store";

interface IDatabaseItem {
  id: number;
  name: string;
  type: string;
  text: string;
}

interface IDatabaseTable {
  item: IDatabaseItem;
  handleOpenSidePanel: () => void;
}

const DatabaseTable = ({ item, handleOpenSidePanel }: IDatabaseTable) => {
  const dispatch = useAppDispatch();
  const { q, selectedRowType, selectedRowKeys } = useAppSelector(
    (state: RootState) => state.database
  );
  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setQueryForSearch(value));
  };

  const handleDeleteSelected = async () => {
    switch (selectedRowType) {
      case "duty_types":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteDutyType({ id })))
        );
      case "vehicle_groups":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteVehicleGroup({ id })))
        );
      case "customers":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteCustomer({ id })))
        );
      case "drivers":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteDriver({ id })))
        );
      case "vehicles":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteVehicle({ id })))
        );
      case "bank_accounts":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteBankAccount({ id })))
        );
      case "taxes":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteTax({ id })))
        );
      case "allowances":
        return await Promise.all(
          selectedRowKeys.map((id) => dispatch(deleteAllowance({ id })))
        );
    }
  };

  const vehicleItems = [
    {
      key: "0",
      disabled: true,
      label: (
        <div className={styles.item}>
          <UploadCloud />
          Import
        </div>
      ),
    },
    {
      key: "1",
      disabled: true,
      label: (
        <div className={styles.item}>
          <FileDownloadIcon />
          Export
        </div>
      ),
    },
  ];

  const renderComponent = () => {
    switch (item.type) {
      case "duty_types":
        return <DutyTypeTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "vehicle_groups":
        return <VehicleGroupTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "customers":
        return <CustomerTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "drivers":
        return <DriversTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "vehicles":
        return <VehicleTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "bank_accounts":
        return <BankAccountsTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "taxes":
        return <TaxesTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "allowances":
        return <AllowancesTable handleOpenSidePanel={handleOpenSidePanel} />;
      case "fastag":
        return <FastTagTable />;
    }
  };

  const renderSearchText = () => {
    switch (item.type) {
      case "duty_types":
        return "duty type";
      case "vehicle_groups":
        return "vehicle group name";
      case "customers":
        return "name, GST number, phone number";
      case "drivers":
        return "name or phone";
      case "vehicles":
        return "model name, number";
      case "bank_accounts":
        return "name, account number, bank name";
      case "taxes":
        return "tax name or percentage";
      case "allowances":
        return "allowances";
      case "fastag":
        return "Tag account or License Plate no.";
    }
  };

  const renderBtnText = () => {
    switch (item.type) {
      case "duty_types":
        return "duty type";
      case "vehicle_groups":
        return "vehicle group";
      case "customers":
        return "customer";
      case "drivers":
        return "driver";
      case "vehicles":
        return "vehicle";
      case "bank_accounts":
        return "bank account";
      case "taxes":
        return "tax type";
      case "allowances":
        return "allowance";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerText}>
          <div className={styles.headerPrimary}>{item.name}</div>
          <div className={styles.headerSecondary}>{item.text}</div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <SearchComponent
              value={q}
              onChange={searchHandler}
              LeadingIcon={SearchIcon}
              placeholder={`Search by ${renderSearchText()}`}
            />
          </div>
          {item.type !== "allowance" && item.type !== "fastag" && (
            <PrimaryBtn
              LeadingIcon={selectedRowType ? null : PlusIcon}
              btnText={selectedRowType ? "Delete" : `Add ${renderBtnText()}`}
              onClick={
                selectedRowType ? handleDeleteSelected : handleOpenSidePanel
              }
            />
          )}
          {/* <Dropdown menu={{ items: vehicleItems }} trigger={["click"]}>
            <DotsIcon />
          </Dropdown> */}
        </div>
      </div>
      <div className={styles.tableContainer}>{renderComponent()}</div>
    </div>
  );
};

export default DatabaseTable;
