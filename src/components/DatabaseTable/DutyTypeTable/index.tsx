/* eslint-disable */
import {
  getAllDutyTypes,
  getDutyTypeById,
  deleteDutyType,
  setViewContentDatabase,
  setSelectedRowType,
  setSelectedRowIds,
} from "../../../redux/slices/databaseSlice";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";

import type { MenuProps } from "antd";
import { Table, TableProps, Dropdown } from "antd";
import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import CustomPagination from "../../Common/Pagination";
import styles from "./index.module.scss";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import useDebounce from "../../../hooks/common/useDebounce";
import DeleteModal from "../../Modal/DeleteModal";

interface IDutyTypeTableData {
  key: string;
  id: string;
  dutyTypeName: string;
  secondary_type: string;
  customDutyType: any;
  ratePerKm: number;
  category: string;
  pricing: any;
}

interface IDutyTypeTable {
  handleOpenSidePanel: () => void;
}

const DutyTypeTable = ({ handleOpenSidePanel }: IDutyTypeTable) => {
  const dispatch = useAppDispatch();
  const {
    selectedDutyType,
    dutyTypeList,
    q,
    deleteDutyTypeStates,
    dutyTypeStates,
    pagination,
  } = useAppSelector((state) => state.database);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dutyTypeId, setDutyTypeId] = useState<string>("");
  const [dutyType, setDutyType] = useState({ name: "" });
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDeleteDutyType = () => {
    dispatch(deleteDutyType({ id: dutyTypeId }));
    setOpenDeleteModal(false);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getDutyTypeById({ id: dutyTypeId }));
      handleOpenSidePanel();
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit duty type",
      key: "1",
      icon: <EditIcon />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(
      getAllDutyTypes({ page: "1", search: debouncedSearch, limit: 10 })
    );
  }, [debouncedSearch]);

  const columns: TableProps<any>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span>{record?.name}</span>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => {
        return (
          <span style={{ textTransform: "capitalize" }}>
            {record?.category}
          </span>
        );
      },
    },
    {
      title: "Max Kilometers",
      dataIndex: "max_kilometers",
      key: "max_kilometers",
      render: (_, record) => {
        return (
          <span>
            {record && record?.pricing ? record?.pricing[0]?.extraKmRate : "-"}
          </span>
        );
      },
    },
    {
      title: "Max Hours",
      dataIndex: "max_hours",
      key: "max_hours",
      render: (_, record) => {
        return (
          <span>
            {record && record?.pricing ? record?.pricing[0]?.extraHrRate : "-"}
          </span>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => e.stopPropagation()}
          ref={dropdownRef}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setDutyTypeId(record.id);
              setDutyType(record);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={cn(styles.button, {
                [styles.selected]: dutyTypeId === record.id && openDropdown,
              })}
              onClick={() => {
                setDutyTypeId(record.id);
              }}
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
    selectedRows: IDutyTypeTableData[]
  ) => {
    dispatch(setSelectedRowType("duty_types"));
    dispatch(setSelectedRowIds(selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <>
      <Table
        bordered
        rowKey={"id"}
        onRow={(record) => {
          return {
            onClick: () => {
              dispatch(getDutyTypeById({ id: record.id }));
              dispatch(setViewContentDatabase(true));
              handleOpenSidePanel();
            },
          };
        }}
        rowClassName={styles.rowstyles}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
          selectedRowKeys: selectedRowKeys,
        }}
        columns={columns}
        dataSource={
          dutyTypeList && Array.isArray(dutyTypeList) ? dutyTypeList : []
        }
        loading={deleteDutyTypeStates?.loading || dutyTypeStates?.loading}
        pagination={false}
        scroll={{
          x: 756,
        }}
        locale={{
          emptyText: (
            <EmptyComponent
              backgroundImageIcon={<SpiralIcon />}
              upperImageIcon={<SearchIcon2 />}
              headerText={"No items found"}
              descText={
                "There is no data in this page Start by clicking the Add button above "
              }
            />
          ),
        }}
        onHeaderRow={(columns) => {
          return {
            style: {
              backgroundColor: "#1890ff",
              color: "white",
              fontWeight: "bold",
            },
          };
        }}
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {}}
          />
        )}
      />
      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete duty type"}
        desc={"Are you sure you want to delete this duty type?"}
        onDelete={handleDeleteDutyType}
      />
    </>
  );
};

export default DutyTypeTable;
