/* eslint-disable */
// Single Booking page with all the Duties of that Booking in it.

import { EditFilled, SearchOutlined } from "@ant-design/icons";
import { Input, DatePicker, Button, Drawer, Form } from "antd";
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PrimaryBtn from "../../../components/PrimaryBtn";
import SecondaryBtn from "../../../components/SecondaryBtn";
import { useAppDispatch } from "../../../hooks/store";
import { RootState } from "../../../types/store";
import styles from "../index.module.scss";
import { ReactComponent as ArrowLeftOutlined } from "../../../icons/arrow-left-blue.svg";
import classNames from "classnames";
import { BOOKINGS_DUTY_TABS } from "../../../constants/bookings";
import SingleBookingsTable from "../../../components/BookingsTable/SingleBooking";
import {
  setBookingDutiesFilter,
  setIsAddEditDrawerClose,
  setIsAddEditDrawerOpen,
} from "../../../redux/slices/bookingDutiesSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import AddNewDutyToBookingForm from "../../../components/Bookings/AddNewDutyToBooking";

dayjs.extend(utc);

const { RangePicker } = DatePicker;

const BookingsTabs = () => {
  console.log("I RUN");
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
  let { bookingId } = useParams();
  const dispatch = useAppDispatch();
  const {
    filters,
    isAddEditDrawerOpen,
    currentSelectedBookingDuties,
    isEditingBookingDuties,
  } = useSelector((state: RootState) => state.bookingDuties);
  console.log(currentSelectedBookingDuties);

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

          <div className={styles.heading}>{`Booking ID: ${bookingId}`}</div>
          <div className={styles.text}>
            {dayjs(currentSelectedBookingDuties?.duration?.startTime).format(
              "DD,MMM YYYY hh:mm A"
            )}
            to{" "}
            {dayjs(currentSelectedBookingDuties?.duration?.endTime).format(
              "DD,MMM YYYY hh:mm A"
            )}
          </div>
        </div>
        <div className={styles.btnContainer}>
          <SecondaryBtn
            onClick={() => {
              dispatch(setIsAddEditDrawerOpen());
            }}
            btnText="Add Duty"
          />
          <PrimaryBtn
            LeadingIcon={EditFilled}
            onClick={() => {
              dispatch(setIsAddEditDrawerOpen());
            }}
            btnText="Edit"
          />
        </div>
      </div>
      <div className={styles.mainContainer}>
        <BookingsTabs />

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
                    startDate: dayjs(dateString[0]).utc(true).toISOString(),
                    endDate: dayjs(dateString[1]).utc(true).toISOString(),
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
