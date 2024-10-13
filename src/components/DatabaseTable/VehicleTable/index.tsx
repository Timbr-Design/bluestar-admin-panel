/* eslint-disable */
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  getVehicle,
  deleteVehicle,
  getVehicleById,
  setViewContentDatabase,
  updateVehicle,
} from "../../../redux/slices/databaseSlice";
import { VEHICLES } from "../../../constants/database";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import Modal from "../../Modal";
import type { MenuProps } from "antd";
import { Table, TableProps, Dropdown } from "antd";
import styles from "./index.module.scss";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import CustomPagination from "../../Common/Pagination";

interface IVehicleTable {
  key: string;
  _id: string;
  modelName: string;
  group: string;
  assigned_driver: string;
  vehicleNumber: string;
  status: any;
}

interface IVehicleTableTable {
  handleOpenSidePanel: () => void;
}

const VehicleTable = ({ handleOpenSidePanel }: IVehicleTableTable) => {
  const dispatch = useAppDispatch();
  const { vehicleStates, vehicleList, q, deleteVehicleStates, pagination } =
    useAppSelector((state) => state.database);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [currentVehicle, setCurrentVehicle] = useState<any>({});
  const [vehicleName, setVehicleName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDeleteVehicle = () => {
    dispatch(deleteVehicle({ id: vehicleId }));
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getVehicleById({ id: vehicleId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateVehicle({
          payload: { isActive: currentVehicle?.isActive ? false : true },
          id: currentVehicle?._id,
        })
      );
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit vehicle",
      key: "1",
      icon: <EditIcon />,
    },
    {
      label: <>{currentVehicle?.isActive ? "Mark inactive" : "Mark Active"}</>,
      key: "2",
      icon: <Clipboard />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  useEffect(() => {
    dispatch(getVehicle({ page: 1, limit: "10", search: q || "" }));
  }, [q]);

  const columns: TableProps<IVehicleTable>["columns"] = [
    ...VEHICLES,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentVehicle(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setVehicleId(record._id);
              setVehicleName(record?.modelName);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setVehicleId(record._id)}
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
    selectedRows: IVehicleTable[]
  ) => {
    console.log(selectedRowKeys, "selectedRowKeys");
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getVehicleById({ id: record._id }));
              handleOpenSidePanel();
              dispatch(setViewContentDatabase(true));
            },
          };
        }}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
        }}
        columns={columns}
        dataSource={vehicleList?.data?.map((data: any) => ({
          ...data,
          key: data?._id,
          group: "Taxi",
          assigned_driver: data.registration.ownerName,
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
        }))}
        loading={vehicleStates?.loading || deleteVehicleStates?.loading}
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
                getVehicle({
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
            <div className={styles.primaryText}>Delete vehicle</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this vehicle?{" "}
              <div className={styles.selectedSecondaryText}>{vehicleName}</div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteVehicle}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VehicleTable;
