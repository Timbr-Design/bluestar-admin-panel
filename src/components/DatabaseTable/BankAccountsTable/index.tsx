/* eslint-disable */
import { BANK_ACCOUNTS } from "../../../constants/database";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  getBankAccount,
  getBankAccountById,
  deleteBankAccount,
  setViewContentDatabase,
  setSelectedRowType,
  setSelectedRowIds,
  setQueryForSearch,
  updateBankAccount,
} from "../../../redux/slices/databaseSlice";
import type { MenuProps } from "antd";
import { Table, Dropdown } from "antd";
import type { TableProps } from "antd";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import useNotification from "../../DeleteNotification/useNotification";

interface IBankAccountsTable {
  key: string;
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  branch_name: string;
  ifsc: string;
  notes: string;
}

interface IBankAccountsTableTable {
  handleOpenSidePanel: () => void;
}

const BankAccountsTable = ({
  handleOpenSidePanel,
}: IBankAccountsTableTable) => {
  const dispatch = useAppDispatch();
  const {
    bankAccounts,
    bankAccountStates,
    deleteBankAccountStates,
    q,
    pagination,
  } = useAppSelector((state) => state.database);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteBankAccountId, setDeleteBankAccountId] = useState<string>("");
  const [currentBankAccount, setCurrentBankAccount] = useState(null);
  const [bankAccountName, setBankAccountName] = useState("");
  const notify = useNotification();

  const handleDeleteBankAccount = () => {
    notify.success("Bank account Deleted", bankAccountName);
    dispatch(deleteBankAccount({ id: deleteBankAccountId }));
    setOpenDeleteModal(false);
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log(currentBankAccount);
    if (e.key === "1") {
      dispatch(getBankAccountById({ id: deleteBankAccountId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateBankAccount({
          id: currentBankAccount?.id,
          payload: { is_active: currentBankAccount?.is_active ? false : true },
        })
      );
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit Bank Account",
      key: "1",
      icon: <EditIcon />,
    },
    {
      type: "divider",
    },
    {
      label: (
        <>{currentBankAccount?.is_active ? "Mark inactive" : "Mark Active"}</>
      ),
      key: "2",
      icon: <Clipboard />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const columns: TableProps<IBankAccountsTable>["columns"] = [
    ...BANK_ACCOUNTS,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentBankAccount(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setDeleteBankAccountId(record.id);
              setBankAccountName(record?.account_name);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setDeleteBankAccountId(record.id)}
            >
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(
      getBankAccount({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IBankAccountsTable[]
  ) => {
    dispatch(setSelectedRowType("bank_accounts"));
    dispatch(setSelectedRowIds(selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <>
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
        }}
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getBankAccountById({ id: record.id }));
              handleOpenSidePanel();
              dispatch(setViewContentDatabase(true));
            },
          };
        }}
        columns={columns}
        dataSource={
          bankAccounts && Array.isArray(bankAccounts)
            ? bankAccounts?.map((data: any) => ({
                ...data,
                key: data?.id,
              }))
            : []
        }
        loading={bankAccountStates?.loading || deleteBankAccountStates?.loading}
        pagination={false}
        scroll={{
          x: 756,
        }}
        locale={{
          emptyText: (
            <EmptyComponent
              backgroundImageIcon={<SpiralIcon />}
              upperImageIcon={<SearchIcon2 />}
              headerText={"No items found"}
              descText={
                "There is no data in this page Start by clicking the Add button above "
              }
              handleCTA={
                q && q.length > 0 ? () => dispatch(setQueryForSearch()) : null
              }
              btnText={"Clear Search"}
            />
          ),
        }}
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {
              dispatch(
                getBankAccount({
                  search: q,
                  page: page,
                })
              );
            }}
          />
        )}
      />
      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete bank account"}
        desc={"Are you sure you want to delete this bank account?"}
        onDelete={handleDeleteBankAccount}
        data={bankAccountName}
      />
    </>
  );
};

export default BankAccountsTable;
