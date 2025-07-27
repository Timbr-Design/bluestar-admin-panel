/* eslint-disable */
import { FASTTAG_TABLE } from "../../../constants/database";
import { Table } from "antd";
import React, { useEffect } from "react";
import CustomPagination from "../../Common/Pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import useDebounce from "../../../hooks/common/useDebounce";
import { useDispatch } from "react-redux";
import { getVehicleGroup } from "../../../redux/slices/databaseSlice";

interface IFastTagTableData {
  key: React.Key;
  tag_account: string;
  license_plate: string;
  total_trips: number;
  total_cost: number;
}

const data: IFastTagTableData[] = [
  {
    key: "1",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
  {
    key: "2",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
  {
    key: "3",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
  {
    key: "4",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
  {
    key: "5",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
  {
    key: "6",
    tag_account: "23907461",
    license_plate: "MH01BT8433",
    total_trips: 26,
    total_cost: 1024,
  },
];

const FastTagTable = () => {
  const { q, pagination } = useAppSelector((state) => state.database);
  const dispatch = useAppDispatch();

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IFastTagTableData[]
  ) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  };

  //   const debouncedSearch = useDebounce(q, 500);

  // useEffect(() => {
  //   dispatch(
  //     getVehicleGroup({
  //       page: 1,
  //       limit: "",
  //       search: debouncedSearch,
  //     })
  //   );
  // }, [debouncedSearch]);

  return (
    <Table
      bordered
      rowSelection={{
        type: "checkbox",
        onChange: onChange,
      }}
      columns={FASTTAG_TABLE}
      dataSource={data}
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
            // dispatch(
            //   getDrivers({
            //     search: q,
            //     page: page,
            //   })
            // );
          }}
        />
      )}
    />
  );
};

export default FastTagTable;
