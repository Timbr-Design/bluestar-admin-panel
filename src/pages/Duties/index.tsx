/* eslint-disable */
// All Duties Page

import {
  ArrowLeftOutlined,
  EditFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, Form, Drawer, Button } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import styles from "./index.module.scss";
import utc from "dayjs/plugin/utc";
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddNewDutyToBookingForm from "../../components/Bookings/AddNewDutyToBooking";
import SingleBookingsTable from "../../components/BookingsTable/SingleBooking";
import PrimaryBtn from "../../components/PrimaryBtn";
import SecondaryBtn from "../../components/SecondaryBtn";
import { BOOKINGS_DUTY_TABS } from "../../constants/bookings";
import { useAppDispatch } from "../../hooks/store";
import {
  setBookingDutiesFilter,
  setIsAddEditDrawerClose,
} from "../../redux/slices/bookingDutiesSlice";
import { RootState } from "../../types/store";

dayjs.extend(utc);

const { RangePicker } = DatePicker;

const DutiesTabs = () => {
  const dispatch = useAppDispatch();
  const { filters } = useSelector((state: RootState) => state.bookingDuties);

  return (
    <div className={styles.tabsContainer}>
      {BOOKINGS_DUTY_TABS?.map((item) => (
        <button
          key={item.type}
          className={classNames(styles.tab, {
            [styles.selected]: item.type === filters.status,
          })}
          onClick={() => {
            dispatch(setBookingDutiesFilter({ status: item.type }));
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
const SingleBookingDuties = () => {
  const dispatch = useAppDispatch();
  const {
    filters,
    isAddEditDrawerOpen,
    currentSelectedBookingDuties,
    isEditingBookingDuties,
  } = useSelector((state: RootState) => state.bookingDuties);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setBookingDutiesFilter({ search: value }));
  };

  const [form] = Form.useForm();
  return (
    <div className={classNames("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div>
          <a href="/bookings" className={styles.backBtn}>
            <ArrowLeftOutlined />
            Back to all bookings
          </a>

          <div className={styles.heading}>{`All Duties`}</div>
          <div className={styles.text}>{"Manage all duties from here"}</div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <DutiesTabs />

        <div className={styles.searchContainer}>
          <Input
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={searchHandler}
            className={styles.inputContainer}
            placeholder="Search by name, number, duty type, city or booking id"
          />
          <div
            className="flex"
            style={{
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <RangePicker
              allowClear
              value={[
                filters.startDate ? dayjs(filters.startDate) : null,
                filters.endDate ? dayjs(filters.endDate) : null,
              ]}
              onChange={(dates, dateString) => {
                dispatch(
                  setBookingDutiesFilter({
                    startDate: dayjs(dateString[0]).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    endDate: dayjs(dateString[1]).format("YYYY-MM-DD HH:mm:ss"),
                  })
                );
              }}
            />
            <p
              className="cursor-pointer"
              onClick={() => {
                dispatch(
                  setBookingDutiesFilter({
                    startDate: undefined,
                    endDate: undefined,
                  })
                );
              }}
            >
              clear
            </p>
          </div>
        </div>
        <SingleBookingsTable />
      </div>
      <Drawer
        destroyOnClose
        size="large"
        mask
        title={
          <div>
            <div>Add New Duty</div>
            <small>Fill your duty details here</small>
          </div>
        }
        footer={
          <div className={styles.drawerFooter}>
            <Button>Cancel</Button>
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
            >
              Save
            </Button>
          </div>
        }
        onClose={() => {
          dispatch(setIsAddEditDrawerClose());
        }}
        open={isAddEditDrawerOpen}
      >
        <div>
          <AddNewDutyToBookingForm
            initialData={currentSelectedBookingDuties}
            form={form}
            isEditable={isEditingBookingDuties}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default SingleBookingDuties;
