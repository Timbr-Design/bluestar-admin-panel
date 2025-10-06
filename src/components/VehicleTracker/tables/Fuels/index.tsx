/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Dropdown, Space, Table } from "antd";
import { ReactComponent as Edit02 } from "../../../../icons/edit-02.svg";
import { ReactComponent as Eye } from "../../../../icons/eye.svg";
import { ReactComponent as Trash01 } from "../../../../icons/trash-01.svg";
import type { MenuProps, TableColumnsType } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../../Common/Pagination";
import { MoreOutlined } from "@ant-design/icons";
import {
  deleteFuel,
  getFuels,
  setSelectedFuel,
} from "../../../../redux/slices/FuelSlice";
import DeleteModal from "../../../Modal/DeleteModal";
import dayjs from "dayjs";
import useDebounce from "../../../../hooks/common/useDebounce";
import { IFuel } from "../../../../interface/fuel";
import useNotification from "../../../DeleteNotification/useNotification";
import { setVehicleTrackerFilter } from "../../../../redux/slices/vehicleTrackerSlice";

interface IFuelsTable {
  handleOpenSidePanel: () => void;
}

const FuelsTable = ({ handleOpenSidePanel }: IFuelsTable) => {
  const { filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );

  const { fuels } = useAppSelector((state) => state.fuels);

  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IFuel | null>(null);

  const notify = useNotification();

  const handleEditFuels = (row) => {
    dispatch(setSelectedFuel(row));
    handleOpenSidePanel();
  };

  const handleDeleteFuel = async () => {
    try {
      const resultAction = await dispatch(deleteFuel({ id: selectedRow?.id }));

      if (deleteFuel.fulfilled.match(resultAction)) {
        notify.success("Expense has been deleted");
      } else {
        notify.success("Failed to delete expense");
      }
    } catch (error) {
      console.log("ERRRO");
    }
    setOpenDeleteModal(false);
  };

  const handleAllExpenses = () => {
    dispatch(
      setVehicleTrackerFilter({
        search: selectedRow?.expand?.vehicle_id?.model_name,
      })
    );
  };

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEditFuels(row);
            }}
          >
            <Space align="center">
              <Edit02 />

              <p>Edit Fuels</p>
            </Space>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAllExpenses();
            }}
          >
            <Space>
              <Eye />
              See all car related expense
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "4",
        label: (
          <div
            style={{
              color: "#F04438",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeleteModal(true);
              setSelectedRow(row);
            }}
          >
            <Space>
              <Trash01 />
              Delete Expenses
            </Space>
          </div>
        ),
      },
    ];
    return items;
  }
  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name and Number",
      dataIndex: "vehicleName",
      key: "vehicleName",
      className: "vehicle-column-separator",
      render: (_: any, record: any) => (
        <div>
          <div>{record?.expand?.vehicle_id?.model_name ?? "-"}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record?.expand?.vehicle_id?.vehicle_number ?? "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (_: any, record: any) => {
        const transaction_date = dayjs(record?.transaction_date).format(
          "DD/MM/YYYY"
        );
        return transaction_date;
      },
    },
    {
      title: "Driver",
      dataIndex: "driver_id",
      key: "driver_id",
      render: (_: any, record: any) => {
        const driver = record?.expand?.driver_id?.name ?? "-";
        return driver;
      },
    },
    {
      title: "Fuel Type",
      dataIndex: "fuel_type",
      key: "fuel_type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity_ltr",
      key: "quantity_ltr",
      render: (text) => `${text} L`,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (_: any, record: any) => {
        const amount = record?.amount_inr;
        const quantity = record?.quantity_ltr;
        return amount / quantity;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount_inr",
      key: "amount_inr",
      render: (text) => `₹${text ?? "-"}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (data: any, row: any) => {
        setSelectedRow(row);
        return (
          <div className={styles.columnsAction}>
            <Dropdown menu={{ items: returnItems(row) }}>
              <MoreOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getFuels({
        search: debouncedSearch || "",
      })
    );
  }, [debouncedSearch]);

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={fuels}
        loading={vehicleTrackerState?.loading}
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
                getFuels({
                  search: filters.search,
                  page,
                })
              );
            }}
          />
        )}
      />
      <DeleteModal
        title={"Delete Fuels"}
        desc={" Are you sure you want to delete this expense?"}
        show={openDeleteModal}
        onClose={handleCloseModal}
        onDelete={handleDeleteFuel}
        data={`Car: ${selectedRow?.expand?.vehicle_id?.model_name} | ${selectedRow?.expand?.vehicle_id?.vehicle_number}`}
      />
    </>
  );
};

export default FuelsTable;
