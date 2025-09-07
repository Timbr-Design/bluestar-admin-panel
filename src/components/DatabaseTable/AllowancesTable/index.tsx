/* eslint-disable */
import { ALLOWANCES_TABLE } from "../../../constants/database";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
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
  setQueryForSearch,
} from "../../../redux/slices/databaseSlice";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import useNotification from "../../DeleteNotification/useNotification";

interface IAllowanceData {
  key: string;
  id: string;
  allowance_type: string;
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
  const notify = useNotification();

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
              setAllowanceName(record?.allowance_type);
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
    notify.success("Allowance Deleted", allowanceName);
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
                    <div className={styles.perDay}>{"per hour"}</div>
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
        locale={{
          emptyText: (
            <EmptyComponent
              backgroundImageIcon={<SpiralIcon />}
              upperImageIcon={<SearchIcon2 />}
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
