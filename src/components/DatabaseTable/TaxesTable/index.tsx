/* eslint-disable */
import { TAXES_TABLE } from "../../../constants/database";
import { Table, TableProps, Dropdown } from "antd";
import type { MenuProps } from "antd";
import cn from "classnames";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as Clipboard } from "../../../icons/clipboard-x.svg";
import { ReactComponent as ClipboardActive } from "../../../icons/clipboard-check.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as IllustrationIcon } from "../../../icons/Illustration.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import {
  getTaxes,
  deleteTax,
  getTaxesById,
  updateTax,
  setViewContentDatabase,
  setSelectedRowType,
  setSelectedRowIds,
  setQueryForSearch,
} from "../../../redux/slices/databaseSlice";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import CustomPagination from "../../Common/Pagination";
import DeleteModal from "../../Modal/DeleteModal";
import useDebounce from "../../../hooks/common/useDebounce";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import useNotification from "../../DeleteNotification/useNotification";

interface ITaxesTableData {
  key: string;
  id: string;
  name: string;
  percentage: string;
  status: any;
}

interface ITaxesTable {
  handleOpenSidePanel: () => void;
}

const TaxesTable = ({ handleOpenSidePanel }: ITaxesTable) => {
  const { taxes, taxesStates, deleteTaxesState, q, pagination } =
    useAppSelector((state) => state.database);
  const dispatch = useAppDispatch();
  const [currentTax, setCurrentTax] = useState<any>({});
  const [taxName, setTaxName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taxId, setTaxId] = useState("");
  const notify = useNotification();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getTaxesById({ id: taxId }));
      handleOpenSidePanel();
    } else if (e.key === "2") {
      dispatch(
        updateTax({
          payload: { is_active: currentTax?.is_active ? false : true },
          id: currentTax?.id,
        })
      );
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click left button", e);
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit tax",
      key: "1",
      icon: <EditIcon />,
    },
    {
      label: <>{currentTax?.is_active ? "Mark inactive" : "Mark Active"}</>,
      key: "2",
      icon: !currentTax?.is_active ? (
        <Clipboard />
      ) : (
        <ClipboardActive height={16} width={16} />
      ),
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const columns: TableProps<ITaxesTableData>["columns"] = [
    ...TAXES_TABLE,
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentTax(record);
          }}
        >
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setTaxId(record.id);
              setTaxName(record?.name);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              onClick={() => setTaxId(record.id)}
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

  const handleDeleteTax = async () => {
    try {
      const resultAction = await dispatch(deleteTax({ id: taxId }));

      if (deleteTax.fulfilled.match(resultAction)) {
        notify.success("Tax entry Deleted", taxName);
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.log("ERRRO");
    }

    setOpenDeleteModal(false);
  };

  const debouncedSearch = useDebounce(q, 500);

  useEffect(() => {
    dispatch(
      getTaxes({
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: ITaxesTableData[]
  ) => {
    dispatch(setSelectedRowType("taxes"));
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
              dispatch(getTaxesById({ id: record.id }));
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
          taxes && Array.isArray(taxes)
            ? taxes?.map((data: any) => {
                return {
                  ...data,
                  key: data?.id,
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
        loading={taxesStates?.loading || deleteTaxesState?.loading}
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
                "There is no data in this page. Start by clicking the Add button above"
              }
              handleCTA={
                q && q.length > 0 ? () => dispatch(setQueryForSearch()) : null
              }
              btnText={"Clear Search"}
            />
          ),
        }}
        footer={
          taxes?.length !== 0
            ? () => (
                <CustomPagination
                  total={pagination?.total ?? 0}
                  current={pagination?.page ?? 1}
                  pageSize={pagination.limit ?? 10}
                  onPageChange={(page: number) => {
                    dispatch(
                      getTaxes({
                        search: q,
                        page: page,
                      })
                    );
                  }}
                />
              )
            : () => <></>
        }
      />

      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete tax"}
        desc={"Are you sure you want to delete this tax?"}
        onDelete={handleDeleteTax}
        data={taxName}
      />
    </>
  );
};

export default TaxesTable;
