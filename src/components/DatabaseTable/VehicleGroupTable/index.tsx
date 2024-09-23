/* eslint-disable */
import { VEHICLE_GROUPS } from "../../../constants/database";
import { Table, Dropdown } from "antd";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import Modal from "../../Modal";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import type { MenuProps } from "antd";
import {
  getVehicleGroup,
  getVehicleGroupById,
  deleteVehicleGroup,
  setPagination,
} from "../../../redux/slices/databaseSlice";
import type { TableProps } from "antd";
import styles from "./index.module.scss";
import React, { useEffect, useState } from "react";
import CustomPagination from "../../Common/Pagination";

interface IVehicleGroupTableData {
  _id: string;
  name: string;
  vehicleCount: number;
}

interface IVehicleGroupTable {
  handleOpenSidePanel: () => void;
}

const VehicleGroupTable = ({ handleOpenSidePanel }: IVehicleGroupTable) => {
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {
    vehicleGroupData,
    vehicleGroupStates,
    q,
    deleteVehicleGroupStates,
    pagination,
  } = useAppSelector((state) => state.database);
  const [deleteVehicleGroupId, setDeleteVehicleGroupId] = useState<string>("");

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getVehicleGroupById({ id: deleteVehicleGroupId }));
      handleOpenSidePanel();
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit Vehicle Group",
      key: "1",
      icon: <EditIcon />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleDeleteVehicleGroup = () => {
    dispatch(deleteVehicleGroup({ id: deleteVehicleGroupId }));
    setOpenDeleteModal(false);
  };

  const columns: TableProps<IVehicleGroupTableData>["columns"] = [
    ...VEHICLE_GROUPS,
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <div className={styles.editButton}>
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setDeleteVehicleGroupId(record._id);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setDeleteVehicleGroupId(record._id)}
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
      getVehicleGroup({
        search: q,
      })
    );
  }, [q]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IVehicleGroupTableData[]
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
        bordered
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
        }}
        columns={columns}
        dataSource={vehicleGroupData?.data}
        loading={
          vehicleGroupStates?.loading || deleteVehicleGroupStates?.loading
        }
        pagination={false}
        scroll={{
          x: 756,
        }}
        footer={() => (
          <CustomPagination
            total={pagination?.total}
            current={pagination?.page}
            pageSize={pagination.limit}
            onPageChange={(page: number) => {
              dispatch(
                getVehicleGroup({
                  search: q,
                  page: page,
                })
              );
            }}
          />
        )}
      />
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete vehicle group</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this vehicle group? This action
              cannot be undone.
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

export default VehicleGroupTable;
