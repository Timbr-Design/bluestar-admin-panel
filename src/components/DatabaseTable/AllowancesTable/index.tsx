/* eslint-disable */
import { ALLOWANCES_TABLE } from "../../../constants/database";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { Table, TableProps, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  getAllowances,
  getAllowanceById,
  deleteAllowance,
  updateAllowance,
  setViewContentDatabase,
  setSelectedRowType,
  setSelectedRowIds,
} from "../../../redux/slices/databaseSlice";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";

interface IAllowanceData {
  key: string;
  id: string;
  allowanceType: string;
  status: any;
  rate: number;
}

interface IAllowanceTable {
  handleOpenSidePanel: () => void;
}

const AllowancesTable = ({ handleOpenSidePanel }: IAllowanceTable) => {
  const {
    allowancesList,
    allowanceStates,
    deleteAllowancesStates,
    q,
    pagination,
  } = useAppSelector((state) => state.database);
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allowanceId, setAllowanceId] = useState("");
  const [allowance, setAllowance] = useState<any>({});
  const [allowanceName, setAllowanceName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getAllowanceById({ id: allowanceId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateAllowance({
          payload: { is_active: allowance?.is_active ? false : true },
          id: allowance?.id,
        })
      );
    }
  };

  console.log(allowance, "allowance");

  const items: MenuProps["items"] = [
    {
      label: "Edit allowance",
      key: "1",
      icon: <EditIcon />,
    },
    {
      label: <>{allowance?.is_active ? "Disable" : "Enable"}</>,
      key: "2",
      icon: <Clipboard />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const columns: TableProps<IAllowanceData>["columns"] = [
    ...ALLOWANCES_TABLE,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setAllowance(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setAllowanceId(record.id);
              setAllowanceName(record?.allowanceType);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setAllowanceId(record.id)}
            >
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteAllowance = () => {
    dispatch(deleteAllowance({ id: allowanceId }));
    setOpenDeleteModal(false);
  };

  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(
      getAllowances({
        search: debouncedSearch,
      })
    );
  }, [debouncedSearch]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IAllowanceData[]
  ) => {
    dispatch(setSelectedRowType("allowances"));
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
              dispatch(getAllowanceById({ id: record.id }));
              handleOpenSidePanel();
              dispatch(setViewContentDatabase(true));
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
          allowancesList && Array.isArray(allowancesList)
            ? allowancesList?.map((data: any) => ({
                ...data,
                rate: (
                  <div className={styles.rate}>
                    <div className={styles.text}>{`₹${data?.rate}`}</div>
                    <div className={styles.perDay}>{"per day"}</div>
                  </div>
                ),
                key: data?.id,
                status: (
                  <div
                    className={cn(styles.status, {
                      [styles.enabled]: data?.is_active,
                    })}
                  >
                    <div
                      className={cn(styles.text, {
                        [styles.enabled]: data?.is_active,
                      })}
                    >
                      {data?.is_active ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                ),
              }))
            : []
        }
        loading={allowanceStates?.loading || deleteAllowancesStates?.loading}
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
                getAllowances({
                  search: q,
                  page,
                })
              );
            }}
          />
        )}
      />

      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete allowance"}
        desc={"Are you sure you want to delete this Allowance?"}
        onDelete={handleDeleteAllowance}
        data={allowanceName}
      />
    </>
  );
};

export default AllowancesTable;
