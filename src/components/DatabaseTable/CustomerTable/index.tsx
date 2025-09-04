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
  setSelectedRowType,
  setSelectedRowIds,
} from "../../../redux/slices/databaseSlice";
import cn from "classnames";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import type { MenuProps } from "antd";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { Table, TableProps, Dropdown } from "antd";
import styles from "./index.module.scss";
import React, { useState, useEffect } from "react";
import CustomPagination from "../../Common/Pagination";
import useDebounce from "../../../hooks/common/useDebounce";
import DeleteModal from "../../Modal/DeleteModal";

interface ICustomerTableData {
  key: string;
  id: string;
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
          payload: { is_active: currentCustomer?.is_active ? false : true },
          id: currentCustomer?.id,
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
      label: (
        <>{currentCustomer?.is_active ? "Mark inactive" : "Mark Active"}</>
      ),
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
              setCustomerId(record.id);
              setCustomer(record);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setCustomerId(record.id)}
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
    dispatch(setSelectedRowType("customers"));
    dispatch(setSelectedRowIds(selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };

  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(getCustomer({ search: debouncedSearch }));
  }, [debouncedSearch]);

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getCustomerById({ id: record.id }));
              dispatch(setViewContentDatabase(true));
              handleOpenSidePanel();
            },
          };
        }}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
          selectedRowKeys: selectedRowKeys,
        }}
        columns={columns}
        dataSource={
          customers && Array.isArray(customers)
            ? customers?.map((data: any) => {
                return {
                  ...data,
                  key: data?.id,
                  gstNumber: <div>Hello</div>,
                  status: (
                    <div
                      className={cn(styles.status, {
                        [styles.active]: data?.is_active,
                      })}
                    >
                      <div
                        className={cn(styles.dot, {
                          [styles.active]: data?.is_active,
                        })}
                      />
                      {data?.is_active ? "Active" : "Inactive"}
                    </div>
                  ),
                };
              })
            : []
        }
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
      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete customer"}
        desc={"Are you sure you want to delete this customer?"}
        onDelete={handleDeleteVehicleGroup}
      />
    </>
  );
};

export default CustomerTable;
