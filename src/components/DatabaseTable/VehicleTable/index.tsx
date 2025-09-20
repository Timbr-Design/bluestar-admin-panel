/* eslint-disable */
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  getVehicle,
  deleteVehicle,
  getVehicleById,
  setViewContentDatabase,
  updateVehicle,
  setSelectedRowType,
  setSelectedRowIds,
  setQueryForSearch,
} from "../../../redux/slices/databaseSlice";
import { VEHICLES } from "../../../constants/database";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import { ReactComponent as IllustrationIcon } from "../../../icons/Illustration.svg";
import type { MenuProps } from "antd";
import { Table, TableProps, Dropdown } from "antd";
import styles from "./index.module.scss";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import useNotification from "../../DeleteNotification/useNotification";

interface IVehicleTable {
  key: string;
  id: string;
  model_name: string;
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
  const notify = useNotification();

  const handleDeleteVehicle = async () => {
    try {
      const resultAction = await dispatch(deleteVehicle({ id: vehicleId }));

      if (deleteVehicle.fulfilled.match(resultAction)) {
        notify.success("Vehicle Deleted", vehicleName);
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.log("ERRRO");
    }

    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getVehicleById({ id: vehicleId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateVehicle({
          payload: { is_active: currentVehicle?.is_active ? false : true },
          id: currentVehicle?.id,
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
      label: <>{currentVehicle?.is_active ? "Mark inactive" : "Mark Active"}</>,
      key: "2",
      icon: <Clipboard />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(
      getVehicle({
        page: 1,
        limit: "10",
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

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
              setVehicleId(record.id);
              setVehicleName(record?.model_name);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setVehicleId(record.id)}
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
    dispatch(setSelectedRowType("vehicles"));
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
              dispatch(getVehicleById({ id: record.id }));
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
        dataSource={
          vehicleList && Array.isArray(vehicleList)
            ? vehicleList.map((data: any) => ({
                ...data,
                key: data?.id,
                model_name: data?.model_name,
                group: data?.vehicleGroup?.name,
                assigned_driver: data?.driver?.name,
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
              }))
            : []
        }
        loading={vehicleStates?.loading || deleteVehicleStates?.loading}
        pagination={false}
        scroll={{
          x: 756,
        }}
        locale={{
          emptyText: (
            <EmptyComponent
              backgroundImageIcon={<SpiralIcon />}
              upperImageIcon={
                q && q.length > 0 ? <SearchIcon2 /> : <IllustrationIcon />
              }
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
                getVehicle({
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
        title={"Delete vehicle"}
        desc={"Are you sure you want to delete this vehicle?"}
        onDelete={handleDeleteVehicle}
        data={vehicleName}
      />
    </>
  );
};

export default VehicleTable;
