/* eslint-disable */
import { BANK_ACCOUNTS } from "../../../constants/database";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";

import type { MenuProps } from "antd";
import { Table, Dropdown } from "antd";
import type { TableProps } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import Modal from "../../Modal";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import CustomPagination from "../../Common/Pagination";
import {
  deleteBankAccount,
  getBankAccountById,
  getBankAccount,
} from "../../../apis/database";

interface IBankAccountsTable {
  _id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteBankAccountId, setDeleteBankAccountId] = useState<string>("");

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
              setDeleteBankAccountId(record._id);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setDeleteBankAccountId(record._id)}
            >
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      getBankAccount({
        page: pagination.page,
        search: q,
        limit: pagination.limit,
      })
    );
  }, [q]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IBankAccountsTable[]
  ) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
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
              dispatch(getBankAccountById({ id: record._id }));
              handleOpenSidePanel();
            },
          };
        }}
        columns={columns}
        dataSource={bankAccounts?.data}
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
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete bank account</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteBankAccount}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BankAccountsTable;
