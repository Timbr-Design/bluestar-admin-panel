/* eslint-disable */
import cn from "classnames";
import { useState, ChangeEvent, useMemo, useEffect } from "react";
import { BOOKINGS_STATUS, BOOKINGS_TABS } from "../../constants/bookings";
import styles from "./index.module.scss";
import SecondaryBtn from "../../components/SecondaryBtn";
import PrimaryBtn from "../../components/PrimaryBtn";
import {
  getVehicle,
  getDrivers,
  setSelectedRowIds,
  setSelectedRowType,
} from "../../redux/slices/databaseSlice";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import BookingsTable from "../../components/BookingsTable";
import { Button, DatePicker, Drawer, Form, Input, Radio } from "antd";
import AddNewBookingForm from "../../components/Bookings/AddNewBooking/AddNewBookingForm";
import {
  setIsAddEditDrawerClose,
  setIsAddEditDrawerOpen,
  setBookingFilter,
  setIsEditingBooking,
  clearCurrentSelectedBooking,
  addNewBooking,
  updateBooking,
  getBookings,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import {
  clearSelectedVehicleGroup,
  clearSelectedDutyType,
} from "../../redux/slices/databaseSlice";
import AssignVehicle from "../../components/Bookings/AssignVehicle";
import AssignDriver from "../../components/Bookings/AssignDriver";
import { ReactComponent as EditIcon } from "../../icons/edit-icon.svg";
import { ReactComponent as CrossIcon } from "../../icons/x.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../types/store";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const BookingsTabs = ({ status, setStatus }) => {
  const dispatch = useAppDispatch();
  // const [status, setStatus] = useState<string>("");

  return (
    <div className={styles.tabsContainer}>
      {BOOKINGS_TABS?.map((item, idx) => (
        <button
          key={idx}
          className={cn(styles.tab, {
            [styles.selected]: item.type === status,
          })}
          onClick={() => {
            setStatus(item.type);
            dispatch(getBookings({ page: 1, limit: 10, status: item.type }));
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

const Bookings = () => {
  const dispatch = useAppDispatch();
  const {
    isAddEditDrawerOpen,
    isEditingBooking,
    filters,
    currentSelectedBooking,
  } = useSelector((state: RootState) => state.booking);
  const { q, selectedRowKeys, selectedRowType } = useAppSelector(
    (state) => state.database
  );

  const [bookingValues, setBookingValues] = useState<any>({});
  const [driver, setDriver] = useState<any>({});
  const [vehicle, setVehicle] = useState<any>({});
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (currentSelectedBooking) {
      setBookingValues(currentSelectedBooking);
      dispatch(
        getVehicle({
          vehicle_group_id: currentSelectedBooking?.vehicle_group_id,
        })
      );
      setDriver(currentSelectedBooking?.expand?.driver_id);
      setVehicle(currentSelectedBooking?.expand?.vehicle_id);
    }
  }, [currentSelectedBooking]);

  const handleSetBookingValues = (values: any) => {
    setBookingValues(values);
  };

  const handleSetDriver = (values: any) => {
    setDriver(values);
  };

  const handleSetVehicle = (values: any) => {
    console.log("Sdf");
    setVehicle(values);
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setBookingFilter({ search: value }));
    // dispatch(getBookings({ page: 1, limit: 10, status: filters.status,search: value }))
  };

  const [form] = Form.useForm();
  const [formStep, setFormSetp] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getVehicle({ page: 1, limit: "10", search: q || "" }));
    dispatch(
      getDrivers({
        search: q,
      })
    );
  }, [q]);

  const handleCloseSidePanel = () => {
    setFormSetp(1);
    dispatch(setIsAddEditDrawerClose());
    dispatch(setIsEditingBooking(false));
    dispatch(clearCurrentSelectedBooking());
    dispatch(clearSelectedVehicleGroup());
    dispatch(clearSelectedDutyType());
    form.resetFields();
  };

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedRowKeys.map((id) => dispatch(deleteBooking({ id })))
    );
    dispatch(setSelectedRowIds([]));
    dispatch(setSelectedRowType(""));
  };

  const primaryBtnText = useMemo(() => {
    if (formStep === 1 || formStep === 2) {
      return "next";
    } else if (formStep === 3) {
      return "save";
    }
  }, [formStep]);

  const secondaryBtnText = useMemo(() => {
    if (formStep === 1) {
      return "cancel";
    } else if (formStep === 2 || formStep === 3) {
      return "back";
    }
  }, [formStep]);

  const handlePrimaryBtn = async () => {
    // To move forward in the form
    if (formStep === 1) {
      try {
        await form.validateFields();
        form.submit();
        setFormSetp(2);
      } catch (error) {
        // Form validation failed
      }
    } else if (formStep === 2) {
      setFormSetp(3);
    } else if (formStep === 3) {
      const bookingData = {
        booking_id: form.getFieldValue("bookingId"),
        customer_id: form.getFieldValue("customer"),
        booked_by_name: form.getFieldValue("booked_by_name"),
        booked_by_number: form.getFieldValue("booked_by_number"),
        booked_by_email: form.getFieldValue("booked_by_email"),
        base_rate: form.getFieldValue("base_rate"),
        per_extra_km_rate: form.getFieldValue("per_extra_km_rate"),
        per_extra_hour_rate: form.getFieldValue("per_extra_hour_rate"),
        passengers: form
          .getFieldValue("passenger")
          .map((ele: { name: string; phoneNo: string; email: string }) => ({
            name: ele.name,
            phoneNo: ele.phoneNo,
            email: ele.email,
          })),
        duty_type_id: form.getFieldValue("dutyType"),
        vehicle_id: vehicle !== undefined ? vehicle.id : null,
        driver_id: driver !== undefined ? driver.id : null,
        vehicle_group_id: [form.getFieldValue("vehicleGroup")],
        from: form.getFieldValue("from"),
        to: form.getFieldValue("to"),
        reporting_address: form.getFieldValue("reporting_address"),
        drop_address: form.getFieldValue("drop_address"),
        local_booking: form.getFieldValue("bookingType") === "Local",
        outstation_booking: form.getFieldValue("bookingType") === "Outstation",
        airportBooking: form.getFieldValue("airportBooking"),
        start_date: dayjs(form.getFieldValue("durationDetails").start_date),
        end_date: dayjs(form.getFieldValue("durationDetails").end_date),
        reporting_time: dayjs(
          form.getFieldValue("durationDetails").reporting_time
        ),
        est_drop_time: dayjs(
          form.getFieldValue("durationDetails").est_drop_time
        ),
        start_from_garage_before_mins: form
          .getFieldValue("durationDetails")
          .start_from_garage_before_mins.valueOf(),
        operator_notes: form.getFieldValue("operator_notes") ?? null,
        driver_notes: form.getFieldValue("notes") ?? null,
        booking_status: form.getFieldValue("isUnconfirmed")
          ? BOOKINGS_STATUS.unconfirmed
          : BOOKINGS_STATUS.booked,
        is_confirmed: !form.getFieldValue("isUnconfirmed"),
        billed_customer_id: form.getFieldValue("billTo"),
      };

      const bookingDataUpdate = {
        ...bookingData,
        customer_id: form.getFieldValue("customer")[0]?.value,
        duty_type_id: form.getFieldValue("dutyType")[0]?.value,
        vehicle_group_id: [form.getFieldValue("vehicleGroup")[0]?.value],
        is_confirmed: currentSelectedBooking?.is_confirmed,
      };

      if (isEditingBooking && currentSelectedBooking?.id) {
        dispatch(
          updateBooking({
            body: bookingDataUpdate,
            id: currentSelectedBooking?.id,
          })
        );

        setFormSetp(1);
      } else {
        dispatch(addNewBooking(bookingData));
        setFormSetp(1);
      }
    }
  };

  const handleSecondaryBtn = () => {
    // To move backward in the form
    if (formStep === 1) {
      handleCloseSidePanel();
      setFormSetp(1);
    } else if (formStep === 2) {
      setFormSetp(1);
    } else if (formStep === 3) {
      setFormSetp(2);
    }
  };

  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      const start_date = dayjs(dates[0]).format("YYYY-MM-DD HH:mm:ss");
      const end_date = dayjs(dates[1]).format("YYYY-MM-DD HH:mm:ss");

      setDateRange([start_date, end_date]);
      dispatch(
        getBookings({ search: q, status: status, start_date, end_date })
      );
    } else {
      dispatch(getBookings({ page: "1", search: "", limit: 10 }));
      setDateRange(null);
    }
  };

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div>
          <div className={styles.heading}>Bookings</div>
          <div className={styles.text}>
            Create and manage your bookings from here
          </div>
        </div>
        <div className={styles.btnContainer}>
          <SecondaryBtn
            onClick={() => {
              navigate(RouteName.DUTIES);
            }}
            btnText="All Duties"
          />
          <PrimaryBtn
            className={
              selectedRowKeys && selectedRowKeys.length > 0
                ? styles.deleteBtn
                : null
            }
            LeadingIcon={
              selectedRowKeys && selectedRowKeys.length > 0
                ? null
                : PlusOutlined
            }
            onClick={() => {
              if (selectedRowKeys && selectedRowKeys.length > 0)
                handleDeleteSelected();
              else {
                dispatch(setIsAddEditDrawerOpen());
                dispatch(setIsEditingBooking(true));
              }
            }}
            btnText={
              selectedRowKeys && selectedRowKeys.length > 0
                ? "Delete Bookings"
                : "Add booking"
            }
          />
        </div>
      </div>
      <div className={styles.mainContainer}>
        <BookingsTabs status={status} setStatus={setStatus} />

        <div className={styles.searchContainer}>
          <Input
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={searchHandler}
            className={styles.inputContainer}
            placeholder="Search by name, number, duty type, city or booking id"
          />
          <div className={styles.filterContainer}>
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
        <BookingsTable />
      </div>
      <Drawer
        destroyOnClose
        width={630}
        size="large"
        closable={false} // Remove the default close button
        mask
        title={
          <div className={styles.formHeader}>
            <div className={styles.header}>
              {isEditingBooking
                ? currentSelectedBooking?.id
                  ? "Edit Booking"
                  : "New Booking"
                : "Booking Details"}
            </div>
            <div className={styles.primaryText}>
              {formStep === 1
                ? isEditingBooking
                  ? "Fill your booking details here"
                  : "View your booking details here"
                : ""}
              {formStep === 2 && "Select the vehicle"}
              {formStep === 3 && "Select the driver"}
            </div>
          </div>
        }
        footer={
          isEditingBooking ? (
            <div
              className={`${styles.bottomContainer}`}
              style={{ height: "72px" }}
            >
              <SecondaryBtn
                btnText={secondaryBtnText}
                onClick={handleSecondaryBtn}
              />
              <Button
                type="primary"
                loading={false}
                onClick={handlePrimaryBtn}
                className="primary-btn"
              >
                {primaryBtnText}
              </Button>
            </div>
          ) : (
            <div
              className={`${styles.bottomContainer}`}
              style={{ height: "72px" }}
            >
              <PrimaryBtn
                btnText={"Edit"}
                onClick={() => {
                  dispatch(setIsEditingBooking(true));
                }}
                LeadingIcon={EditIcon}
              />
            </div>
          )
        }
        open={isAddEditDrawerOpen}
      >
        <button className={styles.closeBtn} onClick={handleCloseSidePanel}>
          <CrossIcon />
        </button>
        <div>
          {formStep == 1 && (
            <AddNewBookingForm
              form={form}
              isEditable={isEditingBooking}
              initialData={bookingValues}
              handleSetBookingValues={handleSetBookingValues}
            />
          )}
          {formStep == 2 && (
            <AssignVehicle
              form={form}
              handleSetVehicle={handleSetVehicle}
              vehicle={vehicle}
            />
          )}
          {formStep == 3 && (
            <AssignDriver handleSetDriver={handleSetDriver} driver={driver} />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Bookings;
