/* eslint-disable */

import {
  Badge,
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
import {
  CarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PhoneOutlined,
  RedoOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import { ReactComponent as SpiralIcon } from "../../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../../icons/SearchIcon2.svg";
import { ReactComponent as IllustrationIcon } from "../../../icons/Illustration.svg";
import {
  clearSelectedDriver,
  clearSelectedVehicleGroup,
  getVehicle,
} from "../../../redux/slices/databaseSlice";
import SecondaryBtn from "../../SecondaryBtn";
import AssignDriver from "../../Bookings/AssignDriver";
import EmptyComponent from "../../EmptyComponent/EmptyComponent";
import BookingsStates from "../../States/BookingsStates";
import { normalizeBookingStatus } from "../../../helper";

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

  useEffect(() => {
    if (vehicleList) setVehicle(vehicleList);
    if (driverList) setDriver(driverList);
  }, [vehicleList, driverList]);

  const handleUnconfirmDuty = (dutyId: string) => {
    dispatch(
      updateBookingDuties({
        id: dutyId,
        bookingId: bookingId,
        data: {
          status: "Unconfirmed",
        },
      })
    );
  };

  const handleCancelDuty = (dutyId: string) => {
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

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
            }}
          >
            <Space>
              <EyeOutlined />
              View Duty
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
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
            }}
          >
            <Space>
              <EditOutlined twoToneColor="#52c41a" />
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
            <Space>
              <CarOutlined />
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
          <div onClick={() => handleUnconfirmDuty(row.id)}>
            <Space>
              <RedoOutlined />
              Unconfirm Duty
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
            style={{
              color: "#F04438",
            }}
            onClick={() => handleCancelDuty(row?.id)}
          >
            <Space>
              <DeleteOutlined />
              Cancel Duty
            </Space>
          </div>
        ),
      },
    ];
    return items;
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
        return <BookingsStates status={normalizeBookingStatus(data)} />;
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

  useEffect(() => {
    console.log(allotedVehicleDriver, "ALLOTED");
  }, [allotedVehicleDriver]);

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
      dispatch(
        updateBookingDuties({
          id: currentSelectedBookingDuties.id,
          data: updatedDuty,
          bookingId: currentSelectedBookingDuties.booking_id,
        })
      );
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
            <div
              className={`${styles1.bottomContainer}`}
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
      </div>
    </>
  );
};

export default SingleBookingsTable;
