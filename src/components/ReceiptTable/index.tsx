/* eslint-disable */

import { Table, TableProps, Dropdown, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import ReceiptStates from "../States/ReceiptStates";
import { RECEIPTS_COLUMNS } from "../../constants/billings";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { RootState } from "../../types/store";
import { formatDateFull } from "../../utils/date";
import CustomPagination from "../Common/Pagination";
import { getReceipts } from "../../redux/slices/receiptSlice";
import { ReactComponent as EmptyIcon } from "../../icons/EmptyBackground.svg";
import { ReactComponent as IllustrationIcon } from "../../icons/Illustration.svg";
import styles from "./index.module.scss";
import PrimaryBtn from "../PrimaryBtn";
import { ReactComponent as PlusIcon } from "../../icons/plus.svg";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import EmptyComponent from "../EmptyComponent/EmptyComponent";

interface ReceiptData {
  key: string;
  _id: string;
  receiptNumber: string;
  entryDate: string;
  customer: string;
  invoices: string;
  mode: string;
  creditDate: string;
  amountPaid: any;
  status: any;
}
const ReceiptTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { filters, receipts, pagination } = useAppSelector(
    (state: RootState) => state.billing
  );
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const columns: TableColumnsType<any> = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Invoice Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
    },
    {
      title: "Amount Outstanding",
      dataIndex: "amountOutstanding",
      key: "amountOutstanding",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const populateDate = () => {
    return receipts?.map((data) => {
      return {
        ...data,
        invoiceNumber: data?.invoiceNumber,
        customerName: data?.customerDetails?.name,
        amountPaid: `₹${data?.amountPaid}`,
        amount: `₹${data?.amount}`,
        date: `${formatDateFull(data?.date)}`,
        amountOutstanding: `₹${data?.amountOutstanding}`,
        status: <ReceiptStates status={data.status} />,
        key: data?._id,
        id: data?._id,
      };
    });
  };

  const handleAdd = () => {
    navigate(RouteName.CREATE_RECEIPT);
  };

  useEffect(() => {
    dispatch(getReceipts({ page: 1, limit: 10 }));
  }, []);

  return (
    <Table
      bordered
      columns={columns}
      // rowSelection={{
      //   type: "checkbox",
      //   // onChange: onChange,
      //   selectedRowKeys: selectedRowKeys,
      // }}
      dataSource={populateDate()}
      pagination={false}
      footer={() => (
        <CustomPagination
          total={pagination?.total ?? 0}
          current={pagination?.page ?? 1}
          pageSize={pagination.limit ?? 10}
          onPageChange={(page: number) => {
            dispatch(
              getReceipts({
                search: filters.search,
                page: page,
              })
            );
          }}
        />
      )}
      locale={{
        emptyText: (
          <EmptyComponent 
          backgroundImageIcon={<EmptyIcon />} 
          upperImageIcon={ <IllustrationIcon />} 
          headerText={"No Reciepts found"} 
          descText={"There are no items on this page Start by creating receipts from your booking data"}
           handleCTA={handleAdd} 
           btnText={`Add New Reciept`}
           btnLeadingIcon={PlusIcon}
           />
        ),
      }}
    />
  );
};

export default ReceiptTable;
