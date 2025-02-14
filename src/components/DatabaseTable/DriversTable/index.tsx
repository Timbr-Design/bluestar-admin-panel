/* eslint-disable */
import {
  getDrivers,
  getDriverById,
  deleteDriver,
  setViewContentDatabase,
} from "../../../redux/slices/databaseSlice";
import Modal from "../../Modal";
import type { TableProps, MenuProps } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import { Table, Dropdown } from "antd";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { DRIVERS } from "../../../constants/database";
import styles from "./index.module.scss";
import cn from "classnames";
import React, { useEffect, useState } from "react";
import CustomPagination from "../../Common/Pagination";

interface IDriversTableData {
  key: string;
  _id: string;
  name: string;
  driverId: string;
  phoneNumber: string;
  status: any;
}

interface IDriversTable {
  handleOpenSidePanel: () => void;
}

const DriversTable = ({ handleOpenSidePanel }: IDriversTable) => {
  const dispatch = useAppDispatch();
  const { driverList, driverStates, deleteDriverStates, q, pagination } =
    useAppSelector((state) => state.database);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [driverId, setDriverId] = useState<string>("");
  const [driver, setDriver] = useState({ name: "" });
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getDriverById({ id: driverId }));
      handleOpenSidePanel();
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteDriver = () => {
    dispatch(deleteDriver({ id: driverId }));
    setOpenDeleteModal(false);
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit driver",
      key: "1",
      icon: <EditIcon />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  useEffect(() => {
    dispatch(
      getDrivers({
        search: q,
      })
    );
  }, [q]);

  const columns: TableProps<IDriversTableData>["columns"] = [
    ...DRIVERS,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div className={styles.editButton} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setDriverId(record._id);

              const item = driverList?.data?.find(
                (driver: { _id: string }) => driver._id === record?._id
              );

              setDriver(item);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setDriverId(record._id)}
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
    selectedRows: IDriversTableData[]
  ) => {
    console.log(selectedRowKeys, "selectedRowKeys");
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  const getInitials = (name: string) => {
    const names = name.split(" "); // Split the name by spaces
    const firstInitial = names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
    const lastInitial = names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

    return firstInitial + (lastInitial || ""); // Combine the initials
  };

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getDriverById({ id: record._id }));
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
                getDrivers({
                  search: q,
                  page: page,
                })
              );
            }}
          />
        )}
        dataSource={driverList?.data?.map((data: any) => {
          return {
            ...data,
            key: data?._id,
            name: (
              <div className={styles.driverNameContainer}>
                <div
                  className={styles.driverProfile}
                >{`${getInitials(data?.name)}`}</div>
                <div className={styles.driverName}>{data?.name}</div>
              </div>
            ),
            driverId: data?.driverId,
            status: (
              <div className={cn(styles.status, { [styles.active]: true })}>
                <div className={cn(styles.dot, { [styles.active]: true })} />
                <div>{"Active"}</div>
              </div>
            ),
          };
        })}
        loading={driverStates?.loading || deleteDriverStates?.loading}
      />
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete driver</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this driver?{" "}
              <div className={styles.selectedSecondaryText}>{driver?.name}</div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteDriver}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DriversTable;
