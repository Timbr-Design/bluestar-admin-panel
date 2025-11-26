/* eslint-disable */
import { CopyOutlined, MoreOutlined } from "@ant-design/icons";
import { Table, Tag, Dropdown, MenuProps, Space, Drawer } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ReactComponent as EyeIcon } from "../../../icons/eye2.svg";
import styles from "./ViewLogs.module.scss";
import styles1 from "../../Payroll/Payroll.module.scss";
import {
  setIsSlipDrawerClose,
  setIsSlipDrawerOpen,
  setIsViewDrawerOpen,
} from "../../../redux/slices/attendanceSlice";
import { RootState } from "../../../types/store";
function LogsReturnItems(row: any) {
  const dispatch = useAppDispatch();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label:
        row["status"] == "completed" ? (
          <div
            className={styles.popoverContainer}
            onClick={() => {
              dispatch(setIsSlipDrawerOpen());
            }}
          >
            <EyeIcon />
            View duty slip
          </div>
        ) : (
          <div
            className={styles.popoverContainer}
            // onClick={() => {
            //   dispatch(setIsViewDrawerOpen());
            // }}
          >
            <EyeIcon />
            View duty
          </div>
        ),
    },
  ];
  return items;
}
const ViewLogs = () => {
  const dispatch = useAppDispatch();
  const { isSlipDrawerOpen } = useAppSelector(
    (state: RootState) => state.attendance
  );
  return (
    <div>
      {[1, 2, 3, 4].map(() => (
        <div>
          <h4
            style={{
              margin: "1rem 0rem",
            }}
          >
            Aug 28, 2024
          </h4>
          <Table
            showHeader={false}
            bordered
            pagination={false}
            columns={[
              {
                dataIndex: "id",
                key: "id",
                render: (value: any, row: any) => {
                  return (
                    <div>
                      <p>{value}</p>
                      <p className={styles.title2}>{row["time"]}</p>
                    </div>
                  );
                },
              },
              {
                dataIndex: "vehicleName",
                key: "vehicleName",
                render: (value: any, row: any) => {
                  return (
                    <div>
                      <p className={styles.title1}>{value}</p>
                      <p className={styles.title2}>{row["vehicleNumber"]}</p>
                    </div>
                  );
                },
              },
              {
                dataIndex: "status",
                key: "status",
                render: (value) => {
                  if (value === "alloted") {
                    return <Tag color="yellow">{value}</Tag>;
                  } else if (value === "completed") {
                    return <Tag color="green">{value}</Tag>;
                  } else {
                    return <Tag color="blue">{value}</Tag>;
                  }
                },
              },
              {
                title: "Action",
                key: "operation",
                width: 100,
                render: (_, row) => (
                  <div>
                    <Dropdown menu={{ items: LogsReturnItems(row) }}>
                      <MoreOutlined />
                    </Dropdown>
                  </div>
                ),
              },
            ]}
            dataSource={[
              {
                id: "#2387293",
                time: "5:00 PM",
                vehicleName: "Toyota Innova",
                vehicleNumber: "MH01 4656",
                status: "alloted",
              },
              {
                id: "#2387293",
                time: "5:00 PM",
                vehicleName: "Toyota Innova",
                vehicleNumber: "MH01 4656",
                status: "dispatched",
              },
              {
                id: "#2387293",
                time: "5:00 PM",
                vehicleName: "Toyota Innova",
                vehicleNumber: "MH01 4656",
                status: "completed",
              },
            ]}
          />
        </div>
      ))}
      <Drawer
        title="Basic Drawer"
        onClose={() => {
          dispatch(setIsSlipDrawerClose());
        }}
        width={"700px"}
        open={isSlipDrawerOpen}
        className={styles1.drawer}
      >
        hell
      </Drawer>
    </div>
  );
};

export default ViewLogs;
