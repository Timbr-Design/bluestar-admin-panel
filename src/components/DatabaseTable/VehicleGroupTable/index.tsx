/* eslint-disable */
import { VEHICLE_GROUPS } from "../../../constants/database";
import { Table, Dropdown } from "antd";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import type { MenuProps } from "antd";
import cn from "classnames";
import {
  getVehicleGroup,
  getVehicleGroupById,
  deleteVehicleGroup,
  setViewContentDatabase,
  setSelectedRowType,
  setSelectedRowIds,
} from "../../../redux/slices/databaseSlice";
import type { TableProps } from "antd";
import styles from "./index.module.scss";
import React, { useEffect, useState, useRef } from "react";
import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";

interface IVehicleGroupTableData {
  key: string;
  id: string;
  name: string;
  vehicleCount: number;
}

interface IVehicleGroupTable {
  handleOpenSidePanel: () => void;
}

const VehicleGroupTable = ({ handleOpenSidePanel }: IVehicleGroupTable) => {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {
    vehicleGroupData,
    vehicleGroupStates,
    q,
    deleteVehicleGroupStates,
    pagination,
  } = useAppSelector((state) => state.database);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [vehicleGroup, setVehicleGroup] = useState({ name: "" });
  const [deleteVehicleGroupId, setDeleteVehicleGroupId] = useState<string>("");
  const [currentVehicleGroup, setCurrentVehicleGroup] = useState<any>({});
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  // const handleClickOutside = (event: any) => {
  //   if (
  //     dropdownRef.current &&
  //     !dropdownRef.current.contains(event.target as Node)
  //   ) {
  //     setDeleteVehicleGroupId("");
  //   }
  // };

  // useEffect(() => {
  //   // Add event listener to detect outside clicks
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     // Remove event listener on cleanup to prevent memory leaks
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          ref={dropdownRef}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentVehicleGroup(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setDeleteVehicleGroupId(record.id);
              setVehicleGroup(record);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={cn(styles.button, {
                [styles.selected]: deleteVehicleGroupId === record.id,
              })}
              onClick={() => setDeleteVehicleGroupId(record.id)}
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
      getVehicleGroup({
        page: 1,
        limit: "",
        search: debouncedSearch,
      })
    );
  }, [debouncedSearch]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IVehicleGroupTableData[]
  ) => {
    dispatch(setSelectedRowType("vehicle_groups"));
    dispatch(setSelectedRowIds(selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getVehicleGroupById({ id: record.id }));
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
          // []
          vehicleGroupData && Array.isArray(vehicleGroupData)
            ? vehicleGroupData?.map((data: any) => {
                return {
                  ...data,
                  key: data?.id,
                };
              })
            : []
        }
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
      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete vehicle group"}
        desc={"Are you sure you want to delete this vehicle group?"}
        onDelete={handleDeleteVehicleGroup}
        data={vehicleGroup?.name}
      />
    </>
  );
};

export default VehicleGroupTable;
