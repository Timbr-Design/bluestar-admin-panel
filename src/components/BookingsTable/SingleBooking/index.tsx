/* eslint-disable */

import {
  Button,
  Drawer,
  Dropdown,
  Form,
  MenuProps,
  Popover,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import styles from "../index.module.scss";
import styles1 from "../../../pages/Bookings/index.module.scss";
import { MoreOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/store";
import CustomPagination from "../../Common/Pagination";
import { useAppDispatch } from "../../../hooks/store";
import { getSingleBookings } from "../../../redux/slices/bookingSlice";
import { useParams } from "react-router-dom";
import {
  getBookingsDuties,
  setBookingDutiesFilter,
  setCurrentSelectedBookingDuties,
  setIsAddEditDrawerClose,
  setIsAddEditDrawerOpen,
  setIsAllotingDuties,
  setIsEditingBookingDuties,
  updateBookingDuties,
} from "../../../redux/slices/bookingDutiesSlice";
import dayjs from "dayjs";
import useDebounce from "../../../hooks/common/useDebounce";
import AssignVehicle from "../../Bookings/AssignVehicle";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { ReactComponent as EyeIcon } from "../../../icons/eye.svg";
import { ReactComponent as CarIcon } from "../../../icons/car.svg";
import { ReactComponent as ReverseIcon } from "../../../icons/reverse-left.svg";
import { ReactComponent as CancelIcon } from "../../../icons/x-circle.svg";
import { ReactComponent as CancelIconFilled } from "../../../icons/x-circle-filled.svg";
import { ReactComponent as SwitchIcon } from "../../../icons/switch-horizontal.svg";
import { ReactComponent as ShareIcon } from "../../../icons/shareIcon.svg";
import { ReactComponent as ClearFileIcon } from "../../../icons/clearFile.svg";
import { ReactComponent as CheckIcon } from "../../../icons/checkGray.svg";
import { ReactComponent as CheckCircleIcon } from "../../../icons/checkCircle.svg";
import { ReactComponent as AlertCircleIcon } from "../../../icons/alertCircle.svg";
import { ReactComponent as SuccessOutlineIcon } from "../../../icons/successOutline.svg";
import { ReactComponent as PrinterIcon } from "../../../icons/printer.svg";

import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import { ReactComponent as IllustrationIcon } from "../../../icons/Illustration.svg";
import {
  clearSelectedDriver,
  clearSelectedVehicleGroup,
  getDrivers,
  getVehicle,
} from "../../../redux/slices/databaseSlice";
import SecondaryBtn from "../../SecondaryBtn";
import AssignDriver from "../../Bookings/AssignDriver";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import BookingDutyStates from "../../States/BookingDutyStates";
import DeleteModal from "../../Modal/DeleteModal";
import useNotification from "../../DeleteNotification/useNotification";
import BookingsModal from "../../Modal/BookingsModal";
import { BookingsModalProps } from "../../../types/booking";

const SingleBookingsTable = () => {
  let { bookingId } = useParams();
  const {
    data,
    pagination,
    filters,
    bookingDutiesStates,
    isAllotingDuties,
    currentSelectedBookingDuties,
  } = useSelector((state: RootState) => state.bookingDuties);

  const { vehicleList, driverList } = useSelector(
    (state: RootState) => state.database
  );

  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState<any>({});
  const [driver, setDriver] = useState<any>({});
  const [formStep, setFormStep] = useState(1);
  const [allotedVehicleDriver, setAllotedVehicleDriver] = useState<any>({});
  const [openModal, setOpenModal] = useState(false);
  const [modalValues, setModalValues] = useState<BookingsModalProps | null>(
    null
  );

  const notify = useNotification();

  useEffect(() => {
    if (vehicleList) setVehicle(vehicleList);
    if (driverList) setDriver(driverList);
  }, [vehicleList, driverList]);

  const handleUnconfirmDuty = async (dutyId: string, prevStatus: string) => {
    const resultAction = await dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: "Unconfirmed",
        },
      })
    );
    if (updateBookingDuties.fulfilled.match(resultAction)) {
      notify.success(
        "Duty has been marked as unconfirmed",
        "",
        "",
        <AlertCircleIcon />,
        true,
        () => handleUndoStatus(prevStatus, dutyId)
      );
    } else {
      notify.success("Failed to update details.");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setModalValues(null);
  };

  const handleCancelDuty = async (dutyId: string) => {
    dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: "Cancelled",
        },
      })
    );
  };

  const handleConfirmDuty = async (dutyId: string) => {
    const resultAction = await dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: "Booked",
        },
      })
    );

    if (updateBookingDuties.fulfilled.match(resultAction)) {
      notify.success(
        "Duty confirmed",
        `Duty ID: ${dutyId}`,
        "",
        <SuccessOutlineIcon />
      );
    } else {
      notify.success("Failed to restore duty.");
    }
  };

  const handleRestoreDuty = async (dutyId: string, prevStatus: string) => {
    const resultAction = await dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: "Booked",
        },
      })
    );

    if (updateBookingDuties.fulfilled.match(resultAction)) {
      notify.success(
        "Duty restored",
        "",
        "",
        <SuccessOutlineIcon />,
        true,
        () => handleUndoStatus(prevStatus, dutyId)
      );
    } else {
      notify.success("Failed to restore duty.");
    }
  };

  const handleSendInfomation = async (dutyId: string) => {
    dispatch(setIsAddEditDrawerOpen());
    dispatch(setIsEditingBookingDuties(true));

    notify.success("Duty information has been sent to assigned driver");
  };

  const handleClearAllotment = async (dutyId: string) => {
    dispatch(setIsAddEditDrawerOpen());
    dispatch(setIsEditingBookingDuties(true));

    notify.success("Allotment cleared", "", "", <SuccessOutlineIcon />);
  };

  function returnItems(row: any) {
    const items1: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(false));
            }}
          >
            <Space className={styles.actionItem}>
              <EyeIcon />
              View Duty
            </Space>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <EditIcon />
              Edit Duty
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(
                getVehicle({
                  vehicle_group_id: row?.expand?.vehicle_group_id?.id,
                })
              );
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAllotingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <CarIcon />
              Allot vehicle and driver
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "4",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => handleUnconfirmDuty(row.id, row.status)}
          >
            <Space className={styles.actionItem}>
              <ReverseIcon />
              Unconfirm Duty
            </Space>
          </div>
        ),
      },
      {
        key: "5",
        label: (
          <div
            className={styles.actionItemBox}
            style={{
              color: "#F04438",
            }}
            onClick={() => {
              setOpenModal(true);
              const modalValues: BookingsModalProps = {
                title: "Cancel duty",
                desc: "Are you sure you want to cancel this duty?",
                handleCTA: () => handleCancelDuty(row?.id),
                onClose: handleModalClose,
                actionBtn: "Cancel",
                icon: <CancelIconFilled />,
                show: true,
              };
              setModalValues(modalValues);
            }}
          >
            <Space className={styles.actionItem}>
              <CancelIcon />
              Cancel Duty
            </Space>
          </div>
        ),
      },
    ];

    const items2: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
            }}
          >
            <Space className={styles.actionItem}>
              <EyeIcon />
              View Duty
            </Space>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <EditIcon />
              Edit Duty
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(
                getVehicle({
                  vehicle_group_id: row?.expand?.vehicle_group_id?.id,
                })
              );
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAllotingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <CarIcon />
              Re-allot vehicle and driver
            </Space>
          </div>
        ),
      },
      {
        key: "4",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(
                getDrivers({
                  driver_id: row?.expand?.driver_id?.id,
                })
              );
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAllotingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <SwitchIcon />
              Change Driver
            </Space>
          </div>
        ),
      },
      {
        key: "5",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));

              handleSendInfomation(row?.id);
            }}
          >
            <Space className={styles.actionItem}>
              <ShareIcon />
              Send information to driver
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "6",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              const modalValues: BookingsModalProps = {
                title: "Clear allotment",
                desc: "Assigned vehicle and driver to this duty will be removed",
                handleCTA: () => handleClearAllotment(row?.id),
                onClose: handleModalClose,
                actionBtn: "Remove",
                icon: <AlertCircleIcon />,
                show: true,
              };
              setModalValues(modalValues);
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <ClearFileIcon />
              Clear allotment
            </Space>
          </div>
        ),
      },
      {
        key: "7",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <CheckIcon />
              Close Duty
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "8",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => handleUnconfirmDuty(row.id, row.status)}
          >
            <Space className={styles.actionItem}>
              <ReverseIcon />
              Unconfirm Duty
            </Space>
          </div>
        ),
      },
      {
        key: "9",
        label: (
          <div
            className={styles.actionItemBox}
            style={{
              color: "#F04438",
            }}
            onClick={() => {
              setOpenModal(true);
              const modalValues: BookingsModalProps = {
                title: "Cancel duty",
                desc: "Are you sure you want to cancel this duty?",
                handleCTA: () => handleCancelDuty(row?.id),
                onClose: handleModalClose,
                actionBtn: "Cancel",
                icon: <CancelIconFilled />,
                show: true,
              };
              setModalValues(modalValues);
            }}
          >
            <Space className={styles.actionItem}>
              <CancelIcon />
              Cancel Duty
            </Space>
          </div>
        ),
      },
    ];

    const items3: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
            }}
          >
            <Space className={styles.actionItem}>
              <EyeIcon />
              Preview duty slip
            </Space>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <EditIcon />
              Edit duty slip
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(
                getVehicle({
                  vehicle_group_id: row?.expand?.vehicle_group_id?.id,
                })
              );
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAllotingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <PrinterIcon />
              Print Duty Slip
            </Space>
          </div>
        ),
      },
    ];

    const items4: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
            }}
          >
            <Space className={styles.actionItem}>
              <EyeIcon />
              View duty
            </Space>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              setOpenModal(true);
              const modalValues: BookingsModalProps = {
                title: "Restore duty",
                desc: "Are you sure you want to restore this duty?",
                handleCTA: () => handleRestoreDuty(row?.id, row.status),
                onClose: handleModalClose,
                actionBtn: "Restore",
                icon: <AlertCircleIcon />,
                show: true,
                actionBtnColor: "#7F56D9",
              };
              setModalValues(modalValues);
            }}
          >
            <Space className={styles.actionItem}>
              <ReverseIcon />
              Restore duty
            </Space>
          </div>
        ),
      },
    ];

    const items5: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              setOpenModal(true);
              const modalValues: BookingsModalProps = {
                title: "Confirm duty",
                desc: "Are you sure you want to confirm this duty?",
                handleCTA: () => handleConfirmDuty(row?.id),
                onClose: handleModalClose,
                actionBtn: "Confirm",
                icon: <AlertCircleIcon />,
                show: true,
                actionBtnColor: "#7F56D9",
              };
              setModalValues(modalValues);
            }}
          >
            <Space className={styles.actionItem}>
              <CheckCircleIcon />
              <div style={{ color: "#079455" }}>Confirm duty</div>
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "2",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
            }}
          >
            <Space className={styles.actionItem}>
              <EyeIcon />
              View duty
            </Space>
          </div>
        ),
      },
      {
        key: "3",
        label: (
          <div
            className={styles.actionItemBox}
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space className={styles.actionItem}>
              <EditIcon />
              Edit duty
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "5",
        label: (
          <div
            className={styles.actionItemBox}
            style={{
              color: "#F04438",
            }}
            onClick={() => {
              setOpenModal(true);
              const modalValues: BookingsModalProps = {
                title: "Cancel duty",
                desc: "Are you sure you want to cancel this duty?",
                handleCTA: () => handleCancelDuty(row?.id),
                onClose: handleModalClose,
                actionBtn: "Cancel",
                icon: <CancelIconFilled />,
                show: true,
              };
              setModalValues(modalValues);
            }}
          >
            <Space className={styles.actionItem}>
              <CancelIcon />
              Cancel Duty
            </Space>
          </div>
        ),
      },
    ];

    switch (row.status) {
      case "Alloted":
        return items2;
      case "Completed":
        return items3;
      case "Cancelled":
        return items4;
      case "Unconfirmed":
        return items5;
      default:
        return items1;
    }
  }

  const columns: TableColumnsType<any> = [
    {
      title: "Duties date",
      dataIndex: "dutiesDate",
      className: "custom-booking-header",
      key: "dutiesDate",
      render: (_, record) => {
        const startDate = dayjs(record?.start_date).format("DD/MM/YYYY");
        const endDate = dayjs(record?.end_date).format("DD/MM/YYYY");

        return (
          <div>
            <span className={styles.start}>{`${startDate} `}</span>
            <span className={styles.end}>{`to ${endDate}`}</span>
          </div>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (_, record) => {
        return <span>{record?.expand?.billed_customer_id?.name}</span>;
      },
    },
    {
      title: "Passenger",
      dataIndex: "passengers",
      key: "passengers",
      render: (_, data: any) => {
        const passengerList = data?.expand?.booking_id?.passengers;
        if (Array.isArray(passengerList)) {
          if (passengerList.length <= 0) {
            return "No passengers data";
          }
          if (passengerList.length == 1) {
            return passengerList[0].name;
          }
          return (
            <Space>
              {passengerList[0].name}
              <Popover
                content={() => {
                  return (
                    <>
                      {passengerList?.map((each, idx) => (
                        <div key={idx}>
                          <p>
                            <UserOutlined /> {each.name}
                          </p>
                          <p>
                            <PhoneOutlined /> {each.phoneNo}
                          </p>
                          <hr />
                        </div>
                      ))}
                    </>
                  );
                }}
                title="Passenger List"
              >
                <div
                  className={styles.driverProfile}
                >{`+${passengerList.length - 1}`}</div>
              </Popover>
            </Space>
          );
        }
      },
    },
    {
      title: "Vehicle",
      dataIndex: "vehicleGroup",
      key: "vehicleGroup",
      render: (_, record) => {
        const vehicleGroupName = record?.expand?.vehicle_group_id?.name;
        return <span>{vehicleGroupName}</span>;
      },
    },
    {
      title: "Duty type",
      dataIndex: "dutyTypeId",
      key: "dutyTypeId",
      render: (_, record) => {
        const name = record?.expand?.duty_type_id?.name;
        return <span>{name}</span>;
      },
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
      render: (_, record) => {
        const name = record?.expand?.driver_id?.name;
        return (
          <span style={{ textAlign: "center", alignItems: "center" }}>
            {name ?? "-"}
          </span>
        );
      },
    },
    {
      title: "Rep. Time",
      dataIndex: "reporting_time",
      key: "reporting_time",
      render: (data) => <div>{dayjs(data).format("HH:mm")}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data: any) => {
        return <BookingDutyStates status={data} />;
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (data: any, row: any) => {
        return (
          <div className={styles.columnsAction}>
            <Dropdown menu={{ items: returnItems(row) }} trigger={["click"]}>
              <MoreOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  function formateData() {
    return data?.map((each: any) => {
      return {
        ...each,
        driver: each.driver,
        passengers: each?.passengers,
        dutyTypeId: each?.dutyTypeId,
        dutyStatus: each.booking_status,
        duration: each.duration,
        to_address_id: each?.to_address_id,
        reporting_address_map_link: each?.reporting_address_map_link,
        id: each.id,
        action: "",
      };
    });
  }

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingsDuties({ bookingId, ...filters }));
    } else {
      dispatch(getBookingsDuties({ ...filters }));
    }
  }, [
    bookingId,
    filters.status,
    debouncedSearch,
    filters.startDate,
    filters.endDate,
  ]);

  const handleSetVehicle = (values: any) => {
    setAllotedVehicleDriver((prev) => ({
      ...prev,
      vehicle_data: values,
    }));
    setVehicle(values);
  };

  const handleSetDriver = (values: any) => {
    setAllotedVehicleDriver((prev) => ({
      ...prev,
      driver_data: values,
    }));
    setDriver(values);
  };

  const primaryBtnText = useMemo(() => {
    if (formStep === 1) {
      return "next";
    } else if (formStep === 2) {
      return "save";
    }
  }, [formStep]);

  const secondaryBtnText = useMemo(() => {
    if (formStep === 1) {
      return "cancel";
    } else if (formStep === 2) {
      return "back";
    }
  }, [formStep]);

  const handleUndoStatus = async (prevStatus: string, dutyId: string) => {
    const resultAction = await dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: prevStatus,
        },
      })
    );
    if (updateBookingDuties.fulfilled.match(resultAction)) {
      notify.success(
        `Duty has been marked as ${prevStatus}`,
        "",
        "",
        <AlertCircleIcon />
      );
    } else {
      notify.success("Failed to update details.");
    }
  };

  const handlePrimaryBtn = async () => {
    // To move forward in the form
    if (formStep === 1) {
      setFormStep(2);
    } else if (formStep === 2) {
      let updatedDuty = {};
      if (allotedVehicleDriver?.driver_data?.id)
        updatedDuty = {
          ...updatedDuty,
          driver_id: allotedVehicleDriver?.driver_data?.id || "",
        };
      if (allotedVehicleDriver?.vehicle_data?.id)
        updatedDuty = {
          ...updatedDuty,
          vehicle_id: allotedVehicleDriver?.vehicle_data?.id || "",
        };
      const resultAction = await dispatch(
        updateBookingDuties({
          id: currentSelectedBookingDuties.id,
          data: updatedDuty,
          bookingId: currentSelectedBookingDuties.booking_id,
        })
      );
      if (updateBookingDuties.fulfilled.match(resultAction)) {
        notify.success(
          "Vehicle and Driver assigned",
          "",
          "",
          <SuccessOutlineIcon />
        );
      } else {
        notify.success("Failed to update details.");
      }
      setFormStep(1);
      dispatch(setIsAllotingDuties(false));
    }
  };

  const handleCloseSidePanel = () => {
    dispatch(setIsAddEditDrawerClose());
    dispatch(setIsEditingBookingDuties(false));
    dispatch(setIsAllotingDuties(false));
    dispatch(clearSelectedVehicleGroup());
    dispatch(clearSelectedDriver());
    setFormStep(1);
    setAllotedVehicleDriver({});
    form.resetFields();
  };

  const handleSecondaryBtn = () => {
    // To move backward in the form
    if (formStep === 1) {
      handleCloseSidePanel();
    } else if (formStep === 2) {
      setFormStep(1);
    }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(currentSelectedBookingDuties).length) {
      form.setFieldsValue(currentSelectedBookingDuties);
    } else {
      form.resetFields();
    }
  }, [currentSelectedBookingDuties]);

  return (
    <>
      <div className={styles.container}>
        <Table
          bordered
          loading={bookingDutiesStates.loading}
          dataSource={formateData()}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <EmptyComponent
                backgroundImageIcon={<SpiralIcon />}
                upperImageIcon={
                  filters.search && filters.search.length > 0 ? (
                    <SearchIcon2 />
                  ) : (
                    <IllustrationIcon />
                  )
                }
                headerText={"No items found"}
                descText={
                  "There is no data in this page Start by clicking the Add button above "
                }
                handleCTA={
                  filters.search && filters.search.length > 0
                    ? () => dispatch(setBookingDutiesFilter({ search: "" }))
                    : null
                }
                btnText={"Clear Search"}
              />
            ),
          }}
          footer={() => (
            <CustomPagination
              total={pagination?.total ?? 0}
              current={pagination?.page ?? 1}
              pageSize={pagination.limit ?? 10}
              onPageChange={(page: number) => {
                dispatch(
                  getSingleBookings({
                    search: filters.search,
                    page: page,
                  })
                );
              }}
            />
          )}
        />
        <Drawer
          destroyOnClose
          width={630}
          size="large"
          closable={false} // Remove the default close button
          mask
          title={
            <div className={styles1.formHeader}>
              <div className={styles1.header}>
                {currentSelectedBookingDuties?.id
                  ? "Edit Booking"
                  : "New Booking"}
              </div>
              <div className={styles1.primaryText}>
                {formStep === 1 && "Select the vehicle"}
                {formStep === 2 && "Select the driver"}
              </div>
            </div>
          }
          footer={
            <div className={styles1.drawerFooter} style={{ height: "72px" }}>
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
          }
          open={isAllotingDuties}
        >
          <button className={styles1.closeBtn} onClick={handleCloseSidePanel}>
            <CrossIcon />
          </button>
          <div>
            {formStep == 1 && (
              <AssignVehicle
                form={form}
                handleSetVehicle={handleSetVehicle}
                vehicle={
                  allotedVehicleDriver && allotedVehicleDriver.vehicle_data
                    ? allotedVehicleDriver.vehicle_data
                    : currentSelectedBookingDuties
                      ? currentSelectedBookingDuties?.expand?.vehicle_id
                      : vehicle
                }
                currentSelectedBookingDuties={currentSelectedBookingDuties}
              />
            )}
            {formStep == 2 && (
              <AssignDriver
                handleSetDriver={handleSetDriver}
                driver={
                  allotedVehicleDriver && allotedVehicleDriver.driver_data
                    ? allotedVehicleDriver.driver_data
                    : currentSelectedBookingDuties
                      ? currentSelectedBookingDuties?.expand?.driver_id
                      : driver
                }
              />
            )}
          </div>
        </Drawer>

        <BookingsModal
          show={openModal}
          onClose={handleModalClose}
          title={modalValues?.title ?? ""}
          desc={modalValues?.desc ?? ""}
          handleCTA={modalValues?.handleCTA ?? null}
          actionBtnColor={modalValues?.actionBtnColor ?? null}
          actionBtn={modalValues?.actionBtn}
          icon={modalValues?.icon ?? null}
        />
      </div>
    </>
  );
};

export default SingleBookingsTable;
