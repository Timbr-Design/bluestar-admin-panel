/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import React, { useEffect } from "react";

import CustomPagination from "../../../Common/Pagination";
import { getLoans } from "../../../../redux/slices/vehicleTrackerSlice";
import useDebounce from "../../../../hooks/common/useDebounce";

const LoansTable = () => {
  const { loans, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  const dispatch = useAppDispatch();
  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Loan Amount (₹)",
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (text) => `₹${text.toLocaleString("hi-IN")}`,
    },
    {
      title: "EMI Amount (₹)",
      dataIndex: "emiAmount",
      key: "emiAmount",
      render: (text) => `₹${text.toLocaleString("hi-IN")}`,
    },
    {
      title: "Paid Till Date (₹)",
      dataIndex: "paidTillDate",
      key: "paidTillDate",
      render: (text) => `₹${text.toLocaleString("hi-IN")}`,
    },
    {
      title: "Next Payment Date",
      dataIndex: "nextPaymentDate",
      key: "nextPaymentDate",
    },
  ];

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getLoans({
        ...filters,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={loans}
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
                getLoans({
                  search: filters.search,
                  page,
                })
              );
            }}
          />
        )}
      />
    </>
  );
};

export default LoansTable;
