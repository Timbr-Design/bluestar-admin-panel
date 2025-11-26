/* eslint-disable */
import { EditFilled } from "@ant-design/icons";
import { Popover, Flex, Radio, DatePicker, Button, Space } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../../../hooks/store";
import { markAbsent, markPresent } from "../../../redux/slices/attendanceSlice";
import dayjs, { Dayjs } from "dayjs";
import styles from "../ViewLogs/ViewLogs.module.scss";

const MarkedAttendance = ({ driverId }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [isToday, setIsToday] = useState(true);
  const options = [
    { label: "Today", value: "today" },
    { label: "Select Date", value: "selectDate" },
  ];
  const hide = () => {
    setOpen(false);
    setDates([]);
  };

  const handleChange = (value: string, dateStrings) => {
    console.log(`Selected month:`, dateStrings);
    let ds = dateStrings.map((each) =>
      dayjs(each).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    );

    setDates(ds);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleAbsent = async () => {
    await dispatch(
      markAbsent({
        driverId: driverId,
        dates: isToday ? [dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")] : dates,
      })
    );
    hide();
  };
  const handlePresent = async () => {
    await dispatch(
      markPresent({
        driverId: driverId,
        dates: isToday ? [dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")] : dates,
      })
    );
    hide();
  };
  return (
    <Popover
      destroyTooltipOnHide
      content={
        <div style={{ width: "100%" }}>
          {/* <a onClick={hide}>Close</a> */}
          <Flex vertical gap="middle">
            <Radio.Group
              options={options}
              defaultValue="today"
              optionType="button"
              buttonStyle="solid"
              style={{ width: "100%" }}
              onChange={(e) =>
                e.target.value == "today" ? setIsToday(true) : setIsToday(false)
              }
            />
          </Flex>
          {/* {!isToday && ( */}
          <DatePicker
            style={{
              width: "100%",
              marginTop: "0.5rem",
              overflow: "scroll",
            }}
            needConfirm
            multiple={isToday ? false : true}
            allowClear
            maxTagCount="responsive"
            onChange={handleChange}
            // value={isToday ? dayjs(new Date()) : ""}
          />
          {/* )} */}
          <Flex
            style={{
              marginTop: "1rem",
            }}
            gap="middle"
          >
            <Button onClick={handleAbsent}>Mark Absent</Button>
            <Button onClick={handlePresent} type="primary">
              Mark Present
            </Button>
          </Flex>
        </div>
      }
      title={
        <div>
          <p>Attendance</p>
          <p className={styles.title2}>For Shadab</p>
        </div>
      }
      trigger="click"
      open={open}
      arrow={false}
      onOpenChange={handleOpenChange}
    >
      <div className="popoverContainer">
        <EditFilled />
        Mark Attendance
      </div>
    </Popover>
  );
};

export default MarkedAttendance;
