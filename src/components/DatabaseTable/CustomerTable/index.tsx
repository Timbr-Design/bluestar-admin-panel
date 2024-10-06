/* eslint-disable */
import { CUSTOMERS } from "../../../constants/database";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  getCustomer,
  getCustomerById,
  deleteCustomer,
  updateCustomer,
  setViewContentDatabase,
} from "../../../redux/slices/databaseSlice";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import cn from "classnames";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import type { MenuProps } from "antd";
import Modal from "../../Modal";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { Table, TableProps, Dropdown } from "antd";
import styles from "./index.module.scss";
import React, { useState, useEffect } from "react";
import CustomPagination from "../../Common/Pagination";

interface ICustomerTableData {
  _id: string;
  name: string;
  phoneNumber: string;
  gstNumber: string;
  status: any;
}

interface ICustomerTable {
  handleOpenSidePanel: () => void;
}

const CustomerTable = ({ handleOpenSidePanel }: ICustomerTable) => {
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>({});
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState({ name: "" });
  const { customers, customersStates, q, deleteCustomersStates, pagination } =
    useAppSelector((state) => state.database);

  const handleDeleteVehicleGroup = () => {
    dispatch(deleteCustomer({ id: customerId }));
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getCustomerById({ id: customerId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateCustomer({
          payload: { isActive: currentCustomer?.isActive ? false : true },
          id: currentCustomer?._id,
        })
      );
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit Customer",
      key: "1",
      icon: <EditIcon />,
    },
    {
      label: <>{currentCustomer?.isActive ? "Mark Inactive" : "Mark Active"}</>,
      key: "2",
      icon: <Clipboard />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const columns: TableProps<ICustomerTableData>["columns"] = [
    ...CUSTOMERS,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentCustomer(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setCustomerId(record._id);
              setCustomer(record);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setCustomerId(record._id)}
            >
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: ICustomerTableData[]
  ) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  };

  useEffect(() => {
    dispatch(getCustomer({ search: q }));
  }, [q]);

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getCustomerById({ id: record._id }));
              dispatch(setViewContentDatabase(true));
              handleOpenSidePanel();
            },
          };
        }}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
        }}
        columns={columns}
        dataSource={customers?.data?.map((data: any) => {
          return {
            ...data,
            gstNumber: data?.taxDetails?.gstNumber,
            status: (
              <div
                className={cn(styles.status, {
                  [styles.active]: data?.isActive,
                })}
              >
                <div
                  className={cn(styles.dot, {
                    [styles.active]: data?.isActive,
                  })}
                />
                {data?.isActive ? "Active" : "Inactive"}
              </div>
            ),
          };
        })}
        loading={customersStates?.loading || deleteCustomersStates?.loading}
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
                getCustomer({
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
            <div className={styles.primaryText}>Delete customer</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this customer?{" "}
              <div className={styles.selectedSecondaryText}>
                {customer?.name}
              </div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteVehicleGroup}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomerTable;
