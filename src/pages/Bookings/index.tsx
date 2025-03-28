/* eslint-disable */
import cn from "classnames";
import { useState, ChangeEvent, useMemo, useEffect } from "react";
import { BOOKINGS_STATUS, BOOKINGS_TABS } from "../../constants/bookings";
import styles from "./index.module.scss";
import SecondaryBtn from "../../components/SecondaryBtn";
import PrimaryBtn from "../../components/PrimaryBtn";
import { getVehicle, getDrivers } from "../../redux/slices/databaseSlice";
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
  getBookings
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

const { RangePicker } = DatePicker;

const BookingsTabs = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<string>("");

  return (
    <div className={styles.tabsContainer}>
      {BOOKINGS_TABS?.map((item) => (
        <button
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
  const { q } = useAppSelector((state) => state.database);

  const [bookingValues, setBookingValues] = useState<any>({});
  const [driver, setDriver] = useState<any>({});
  const [vehicle, setVehicle] = useState<any>({});

  useEffect(() => {
    setBookingValues(currentSelectedBooking);
    setDriver(currentSelectedBooking?.driver);
    setVehicle(currentSelectedBooking?.vehicle);
  }, [currentSelectedBooking]);

  const handleSetBookingValues = (values: any) => {
    setBookingValues(values);
  };

  const handleSetDriver = (values: any) => {
    setDriver(values);
  };

  const handleSetVehicle = (values: any) => {
    setVehicle(values);
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setBookingFilter({ search: value }));
  };

  const [form] = Form.useForm();
  const [formStep, setFormSetp] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getVehicle({ page: 1, limit: "10", search: q || "" }));
  }, [q]);

  useEffect(() => {
    dispatch(
      getDrivers({
        search: q,
      })
    );
  }, [q]);

  const handleCloseSidePanel = () => {
    dispatch(setIsAddEditDrawerClose());
    dispatch(setIsEditingBooking(false));
    dispatch(clearCurrentSelectedBooking());
    dispatch(clearSelectedVehicleGroup());
    dispatch(clearSelectedDutyType());
    form.resetFields();
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
        bookingId: form.getFieldValue("bookingId"),
        customerId: form.getFieldValue("customer"),
        bookedBy: {
          name: form.getFieldValue("bookedBy").name,
          phoneNo: form.getFieldValue("bookedBy").phoneNo,
          email: form.getFieldValue("bookedBy").email,
        },
        passenger: form
          .getFieldValue("passenger")
          .map((ele: { name: string; phoneNo: string; email: string }) => ({
            name: ele.name,
            phoneNo: ele.phoneNo,
            email: ele.email,
          })),
        dutyTypeId: form.getFieldValue("dutyType"),
        vehicleId: vehicle !== undefined ? vehicle._id : null,
        driverId: driver !== undefined ? driver._id : null,
        vehicleGroupId: [form.getFieldValue("vehicleGroup")],
        from: form.getFieldValue("from"),
        to: form.getFieldValue("to"),
        reportingAddress: form.getFieldValue("reportingAddress"),
        dropAddress: form.getFieldValue("dropAddress"),
        localBooking: form.getFieldValue("bookingType") === "Local",
        outstationBooking: form.getFieldValue("bookingType") === "Outstation",
        airportBooking: form.getFieldValue("airportBooking"),
        durationDetails: {
          startDate: form.getFieldValue("durationDetails").startDate.valueOf(),
          endDate: form.getFieldValue("durationDetails").endDate.valueOf(),
          reportingTime: form
            .getFieldValue("durationDetails")
            .reportingTime.valueOf(),
          dropTime: form.getFieldValue("durationDetails").dropTime.valueOf(),
          garageStartTime: form
            .getFieldValue("durationDetails")
            .garageStartTime.valueOf(),
        },
        pricingDetails: form.getFieldValue("pricingDetails"),
        operatorNotes: form.getFieldValue("operatorNotes") ?? null,
        notes: form.getFieldValue("notes") ?? null,
        status: form.getFieldValue("isUnconfirmed")
          ? BOOKINGS_STATUS.unconfirmed
          : BOOKINGS_STATUS.booked,
        isConfirmed: false,
      };

      const bookingDataUpdate = {
        ...bookingData,
        customerId: form.getFieldValue("customer")[0]?.value,
        dutyTypeId: form.getFieldValue("dutyType")[0]?.value,
        vehicleGroupId: [form.getFieldValue("vehicleGroup")[0]?.value],
        isConfirmed: currentSelectedBooking?.isConfirmed,
      };

      if (isEditingBooking && currentSelectedBooking?._id) {
        dispatch(
          updateBooking({
            body: bookingDataUpdate,
            id: currentSelectedBooking?._id,
          })
        );

        setFormSetp(1)
      } else {
        dispatch(addNewBooking(bookingData));
        setFormSetp(1)
      }
    }
  };

  const handleSecondaryBtn = () => {
    // To move backward in the form
    if (formStep === 1) {
      handleCloseSidePanel();
    } else if (formStep === 2) {
      setFormSetp(1);
    } else if (formStep === 3) {
      setFormSetp(2);
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
            LeadingIcon={PlusOutlined}
            onClick={() => {
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBooking(true));
            }}
            btnText="Add bookings"
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
            <RangePicker />
            <span
              onClick={() => {
                dispatch(setBookingFilter({ search: undefined }));
              }}
              style={{
                cursor: "pointer",
              }}
            >
              clear
            </span>
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
                ? currentSelectedBooking?._id
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
