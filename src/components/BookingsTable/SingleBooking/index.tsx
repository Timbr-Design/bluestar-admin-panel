/* eslint-disable */

import {
  Badge,
  Dropdown,
  MenuProps,
  Popover,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import styles from "../index.module.scss";
import { formatEpochToDate, capitalize } from "../../../helper";
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
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../../types/store";
import CustomPagination from "../../Common/Pagination";
import { useAppDispatch } from "../../../hooks/store";
import { getSingleBookings } from "../../../redux/slices/bookingSlice";
import { useParams } from "react-router-dom";
import {
  getBookingsDuties,
  setCurrentSelectedBookingDuties,
  setIsAddEditDrawerOpen,
  setIsEditingBookingDuties,
} from "../../../redux/slices/bookingDutiesSlice";
import { formatDateFull } from "../../../utils/date";

const SingleBookingsTable = () => {
  let { bookingId } = useParams();
  const { data, pagination, filters, bookingDutiesStates } = useSelector(
    (state: RootState) => state.bookingDuties
  );

  const dispatch = useAppDispatch();

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={() => {
              dispatch(setCurrentSelectedBookingDuties(row));
              dispatch(setIsAddEditDrawerOpen());
              dispatch(setIsEditingBookingDuties(false));
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
          <div onClick={() => {}}>
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
          <div>
            <Space>
              <RedoOutlined />
              Un confirm Duty
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
        const startDate = formatEpochToDate(record?.durationDetails?.startDate);
        const endDate = formatEpochToDate(record?.durationDetails?.endDate);

        return (
          <div>
            <span className={styles.start}>{`${startDate} `}</span>
            <span className={styles.end}>{`to ${endDate}`}</span>
          </div>
        );
      },
    },
    {
      title: "Passenger",
      dataIndex: "passengers",
      key: "passengers",
      render: (data: any) => {
        if (Array.isArray(data)) {
          if (data.length <= 0) {
            return "No passengers data";
          }
          if (data.length == 1) {
            return data[0].name;
          }
          return (
            <Space>
              {data[0].name}

              <Popover
                content={() => {
                  return (
                    <>
                      {data?.map((each) => (
                        <div>
                          <p>
                            <UserOutlined /> {each.name}
                          </p>
                          <p>
                            <PhoneOutlined /> {each.phoneNumber}
                          </p>
                          <hr />
                        </div>
                      ))}
                    </>
                  );
                }}
                title="Passenger List"
              >
                <Badge color="yellow" count={`+${data.length - 1}`} />
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
        const vehicleGroupName = record?.vehicleGroup?.name;
        return <span>{vehicleGroupName}</span>;
      },
    },
    {
      title: "Duty type",
      dataIndex: "dutyTypeId",
      key: "dutyTypeId",
      render: (_, record) => {
        const dutyTypeName = record?.dutyType?.name;
        return <span>{dutyTypeName}</span>;
      },
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (data) => <div>{"Date"}</div>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (data) => {
        return (
          <>
            <a href={data?.dropAddress} target="_blank">
              Drop address
            </a>
            <br />
            <a href={data?.reportingAddress} target="_blank">
              Reporting address
            </a>
          </>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "dutyStatus",
      key: "dutyStatus",
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
            <Dropdown menu={{ items: returnItems(row) }}>
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
        passengers: each.bookingId.passengers,
        vehicleGroupId: each?.vehicleGroupId,
        dutyTypeId: each?.dutyTypeId,
        dutyStatus: each.dutyStatus,
        duration: each.duration,
        address: {
          dropAddress: each?.dropAddress,
          reportingAddress: each?.reportingAddress,
        },
        id: each._id,
        action: "",
      };
    });
  }

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingsDuties({ bookingId, ...filters }));
    } else {
      dispatch(getBookingsDuties({ ...filters }));
    }
  }, [
    bookingId,
    filters.status,
    filters.search,
    filters.startDate,
    filters.endDate,
  ]);

  console.log("Single Booking")

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
      </div>
    </>
  );
};

export default SingleBookingsTable;
