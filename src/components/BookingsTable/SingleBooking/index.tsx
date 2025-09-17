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
  setCurrentSelectedBookingDuties,
  setIsAddEditDrawerClose,
  setIsAddEditDrawerOpen,
  setIsEditingBookingDuties,
  updateBookingDuties,
} from "../../../redux/slices/bookingDutiesSlice";
import dayjs from "dayjs";
import useDebounce from "../../../hooks/common/useDebounce";
import AssignVehicle from "../../Bookings/AssignVehicle";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import {
  clearSelectedDriver,
  clearSelectedVehicleGroup,
  getVehicle,
} from "../../../redux/slices/databaseSlice";
import SecondaryBtn from "../../SecondaryBtn";
import AssignDriver from "../../Bookings/AssignDriver";

const SingleBookingsTable = () => {
  let { bookingId } = useParams();
  const {
    data,
    pagination,
    filters,
    bookingDutiesStates,
    isEditingBookingDuties,
  } = useSelector((state: RootState) => state.bookingDuties);

  const { vehicleList, driverList } = useSelector(
    (state: RootState) => state.database
  );

  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState<any>({});
  const [driver, setDriver] = useState<any>({});
  const [formStep, setFormStep] = useState(1);
  const [currentSelectedDuty, setCurrentSelectedDuty] = useState({});

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
              dispatch(setIsEditingBookingDuties(false));
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
              setCurrentSelectedDuty(row);
              dispatch(
                getVehicle({
                  vehicle_group_id: row?.expand?.vehicle_group_id?.id,
                })
              );
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(true));
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
                <Badge color="yellow" count={`+${passengerList.length - 1}`} />
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
        return data;
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

  // useEffect(() => {
  //   dispatch(
  //     getAllDutyTypes({ page: "1", search: debouncedSearch ?? "", limit: 10 })
  //   );
  // }, [debouncedSearch]);

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
    setVehicle(values);
  };

  const handleSetDriver = (values: any) => {
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

  const handlePrimaryBtn = async () => {
    // To move forward in the form
    if (formStep === 1) {
      try {
        await form.validateFields();
        form.submit();
        setFormStep(2);
      } catch (error) {
        // Form validation failed
      }
    } else if (formStep === 2) {
      console.log("DATA");
    }
  };

  const handleCloseSidePanel = () => {
    dispatch(setIsAddEditDrawerClose());
    dispatch(setIsEditingBookingDuties(false));
    dispatch(clearSelectedVehicleGroup());
    dispatch(clearSelectedDriver());
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
    if (Object.keys(currentSelectedDuty).length) {
      form.setFieldsValue(currentSelectedDuty);
    } else {
      form.resetFields();
    }
  }, [form]);

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
            <div className={styles.formHeader}>
              {/* <div className={styles.header}>
              {isEditable
                ? currentSelectedBooking?.id
                  ? "Edit Booking"
                  : "New Booking"
                : "Booking Details"}
            </div> */}
              <div className={styles.primaryText}>
                {formStep === 1 && "Select the vehicle"}
                {formStep === 2 && "Select the driver"}
              </div>
            </div>
          }
          footer={
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
          }
          open={false}
        >
          <button className={styles.closeBtn} onClick={handleCloseSidePanel}>
            <CrossIcon />
          </button>
          <div>
            {/* {formStep == 1 && (
              <AssignVehicle
                form={form}
                handleSetVehicle={handleSetVehicle}
                vehicle={vehicle}
              />
            )} */}
            {formStep == 2 && (
              <AssignDriver handleSetDriver={handleSetDriver} driver={driver} />
            )}
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default SingleBookingsTable;
