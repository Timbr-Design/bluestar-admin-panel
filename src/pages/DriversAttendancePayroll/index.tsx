/* eslint-disable */
import cn from "classnames";
import styles from "./index.module.scss";
import { DatePicker, Input, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AttendanceTable from "../../components/Attendance/Table";
import PayrollTable from "../../components/Payroll/Table";
import { ChangeEvent } from "react";
import { setAttendanceFilter } from "../../redux/slices/attendanceSlice";
import { useDispatch } from "react-redux";

const DriversAttendancePayroll = () => {
  const { TabPane } = Tabs;
  const { RangePicker } = DatePicker;
  const handleChange = (value: string) => {
    console.log(`Selected month: ${value}`);
  };
  const handleChangeRange = (value: string, dateStrings) => {
    console.log(value, dateStrings);
  };
  const dispatch = useDispatch();
  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setAttendanceFilter({ q: value }));
  };

  const operations = (
    <div className={styles.extraTabComponent}>
      <Input
        style={{ width: 200 }}
        prefix={<SearchOutlined />}
        placeholder="Search by name or phone"
        type="search"
        allowClear
        onChange={searchHandler}
      />
      <RangePicker
        onChange={(value: any, dateStrings) =>
          handleChangeRange(value, dateStrings)
        }
        allowClear
      />
      <DatePicker allowClear onChange={handleChange} picker="month" />
    </div>
  );

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>Drivers Attendance and Payroll</div>
        <div className={styles.text}>
          Manage your drivers attendance and payrolls here
        </div>
      </div>
      <div className={styles.attendanceTable}>
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="Attendance" key="attendance">
            <AttendanceTable />
          </TabPane>
          <TabPane tab="Payroll" key="payroll">
            <PayrollTable />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default DriversAttendancePayroll;
