/* eslint-disable */
// Single Booking page with all the Duties of that Booking in it.

import { EditFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, DatePicker, Button, Drawer, Form } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PrimaryBtn from "../../../components/PrimaryBtn";
import { useAppDispatch } from "../../../hooks/store";
import { RootState } from "../../../types/store";
import styles from "../index.module.scss";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { ReactComponent as ArrowLeftOutlined } from "../../../icons/arrow-left-blue.svg";
import classNames from "classnames";
import { BOOKINGS_DUTY_TABS } from "../../../constants/bookings";
import SingleBookingsTable from "../../../components/BookingsTable/SingleBooking";
import {
  getBookingsDuties,
  setBookingDutiesFilter,
  setCurrentSelectedBookingDuties,
  setIsAddEditDrawerClose,
  setIsAddEditDrawerOpen,
  setIsEditingBookingDuties,
} from "../../../redux/slices/bookingDutiesSlice";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import AddNewDutyToBookingForm from "../../../components/Bookings/AddNewDutyToBooking";
import SecondaryBtn from "../../../components/SecondaryBtn";
import useNotification from "../../../components/DeleteNotification/useNotification";

dayjs.extend(utc);

const BookingsTabs = () => {
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
  // let { bookingId } = useParams();
  const dispatch = useAppDispatch();
  const {
    filters,
    isAddEditDrawerOpen,
    currentSelectedBookingDuties,
    isEditingBookingDuties,
    bookingId,
  } = useSelector((state: RootState) => state.bookingDuties);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const notify = useNotification();

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setBookingDutiesFilter({ search: value }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      const start_date = dayjs(dates[0]).format("YYYY-MM-DD HH:mm:ss");
      const end_date = dayjs(dates[1]).format("YYYY-MM-DD HH:mm:ss");

      dispatch(
        getBookingsDuties({
          search: filters.search,
          status: status,
          start_date,
          end_date,
        })
      );
    } else {
      dispatch(getBookingsDuties({ page: "1", search: "", limit: 10 }));
    }
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
          <PrimaryBtn
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties([]));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
            LeadingIcon={PlusOutlined}
            btnText="Add Duty"
          />
          {/* <PrimaryBtn
            LeadingIcon={EditFilled}
            onClick={() => {
              dispatch(setIsAddEditDrawerOpen());
            }}
            btnText="Edit"
          /> */}
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
            <DatePicker.RangePicker
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Start Date", "End Date"]}
              disabledDate={(current) => {
                if (!startDate) return false; // no restriction until start selected
                return current.isBefore(startDate, "day"); // disable before start
              }}
              onCalendarChange={(dates) => {
                setStartDate(dates?.[0] || null);
              }}
            />
          </div>
        </div>
        <SingleBookingsTable />
      </div>
      <Drawer
        destroyOnClose
        size="large"
        mask
        width={630}
        closable={false}
        title={
          <div className={styles.formHeader}>
            <div className={styles.header}>
              {isEditingBookingDuties
                ? currentSelectedBookingDuties?.id
                  ? "Edit Duty"
                  : "Add New Duty"
                : "Duty details"}
            </div>
            <div className={styles.primaryText}>
              {isEditingBookingDuties
                ? "Fill your duty details here"
                : "View your duty details here"}
            </div>
          </div>
        }
        footer={
          <div style={{ height: "72px" }} className={styles.bottomContainer}>
            <SecondaryBtn
              btnText="Cancel"
              onClick={() => dispatch(setIsAddEditDrawerClose())}
            />

            {currentSelectedBookingDuties?.status !== "Cancelled" && (
              <Button
                onClick={() => {
                  !isEditingBookingDuties
                    ? dispatch(setIsEditingBookingDuties(true))
                    : form.submit();
                }}
                type="primary"
                icon={!isEditingBookingDuties ? <EditFilled /> : ""}
                className="primary-btn"
              >
                {!isEditingBookingDuties ? "Edit" : "Save"}
              </Button>
            )}
          </div>
        }
        open={isAddEditDrawerOpen}
      >
        <button
          className={styles.closeBtn}
          onClick={() => {
            dispatch(setIsAddEditDrawerClose());
            notify.success(`Duty slip updated`);
          }}
        >
          <CrossIcon />
        </button>

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
