/* eslint-disable */

import { Table, TableColumnsType, Button, Popconfirm, Space } from "antd";
import { useEffect, useState } from "react";
import InvoicesStates from "../States/InvoicesStates";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { getInvoices, deleteInvoice } from "../../redux/slices/invoiceSlice";
import { RootState } from "../../types/store";
import { formatDateFull } from "../../utils/date";
import CustomPagination from "../Common/Pagination";
import { DeleteOutlined } from "@ant-design/icons";

const InvoiceTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { filters, invoices, pagination } = useAppSelector(
    (state: RootState) => state.invoice
  );

  const dispatch = useAppDispatch();
  const columns: TableColumnsType<any> = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete Invoice"
            description="Are you sure you want to delete this invoice?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    dispatch(deleteInvoice({ id }));
  };

  const populateData = () => {
    return invoices?.map((data) => {
      return {
        ...data,
        invoiceNumber: data?.invoiceNumber,
        customer: data?.customer?.name,
        amount: `₹${data?.amount || 0}`,
        invoiceDate: formatDateFull(data?.invoiceDate),
        dueDate: formatDateFull(data?.dueDate),
        status: <InvoicesStates status={data.status} />,
        key: data?._id,
        id: data?._id,
      };
    });
  };

  useEffect(() => {
    dispatch(getInvoices({ page: 1, limit: 10 }));
  }, []);

  return (
    <Table
      bordered
      columns={columns}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectedRowKeys,
      }}
      dataSource={populateData()}
      pagination={false}
      footer={() => (
        <CustomPagination
          total={pagination?.totalDocuments ?? 0}
          current={pagination?.currentPage ?? 1}
          pageSize={10}
          onPageChange={(page: number) => {
            dispatch(
              getInvoices({
                page: page,
                limit: 10,
              })
            );
          }}
        />
      )}
    />
  );
};

export default InvoiceTable;
