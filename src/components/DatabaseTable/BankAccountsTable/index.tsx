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
} from "../../../redux/slices/databaseSlice";
import type { MenuProps } from "antd";
import { Table, Dropdown } from "antd";
import type { TableProps } from "antd";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";

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
  const [bankAccountName, setBankAccountName] = useState("");
  const handleDeleteBankAccount = () => {
    dispatch(deleteBankAccount({ id: deleteBankAccountId }));
    setOpenDeleteModal(false);
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getBankAccountById({ id: deleteBankAccountId }));
      handleOpenSidePanel();
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit Bank Account",
      key: "1",
      icon: <EditIcon />,
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
        <div className={styles.editButton} onClick={(e) => e.stopPropagation()}>
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
        search: debouncedSearch,
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
