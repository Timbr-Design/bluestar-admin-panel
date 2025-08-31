/* eslint-disable */

import {
  Badge,
  Dropdown,
  MenuProps,
  Popover,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { ReactComponent as DeleteIconRed } from "../../icons/trash-red.svg";
import styles from "./index.module.scss";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  HeatMapOutlined,
  MailOutlined,
  MoreOutlined,
  PhoneOutlined,
  PushpinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import useDebounce from "../../hooks/common/useDebounce";
import { ReactComponent as DotsHorizontal } from "../../icons/dots-horizontal.svg";
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg";
import { ReactComponent as EyeIcon } from "../../icons/eye2.svg";
import { ReactComponent as CheckCircleIcon } from "../../icons/checkCircle.svg";
import { ReactComponent as EditIcon } from "../../icons/edit02Component.svg";
import { ReactComponent as DocumentsIcon } from "../../icons/fileIcon.svg";
import { ReactComponent as TrashIcon } from "../../icons/trash2.svg";

import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useAppDispatch } from "../../hooks/store";
import {
  setIsAddEditDrawerOpen,
  getBookings,
  setIsEditingBooking,
  deleteBooking,
  clearCurrentSelectedBooking,
  getBookingById,
  updateBooking,
} from "../../redux/slices/bookingSlice";
import BookingsStates from "../States/BookingsStates";
import { useSelector } from "react-redux";
import { RootState } from "../../types/store";
import { formatEpochToDate, capitalize } from "../../helper";
import CustomPagination from "../Common/Pagination";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const BookingsTable = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [conformedBookingModal, setConformedBookingModal] = useState(false);
  const {
    currentSelectedBooking,
    bookings,
    bookingStates,
    pagination,
    filters,
  } = useSelector((state: RootState) => state.booking);
  const [selectedBooking, setSelectedBooking] = useState<any>({});

  const dispatch = useAppDispatch();

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div className={styles.popoverContainer}>
            <CheckCircleIcon />
            <div style={{ color: "#079455" }}>Confirm booking</div>
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
          setConformedBookingModal(true);
          setSelectedBooking(row);
        },
      },
      {
        key: "2",
        onClick: (e) => {
          e.domEvent.stopPropagation();
          dispatch(setIsEditingBooking(false));
          dispatch(setIsAddEditDrawerOpen());
        },
        label: (
          <div className={styles.popoverContainer}>
            <EyeIcon />
            <div style={{ color: "#344054" }}>View booking</div>
          </div>
        ),
      },
      {
        key: "3",
        label: (
          <div className={styles.popoverContainer}>
            <EditIcon />
            <div style={{ color: "#344054" }}>Edit booking</div>
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
          dispatch(setIsEditingBooking(true));
          dispatch(setIsAddEditDrawerOpen());
          dispatch(getBookingById({ id: row.id }));
        },
      },
      {
        key: "4",
        label: (
          <div className={styles.popoverContainer}>
            <DocumentsIcon />
            <div style={{ color: "#344054" }}>Generate invoice</div>
          </div>
        ),
      },
      {
        key: "5",
        label: (
          <div className={styles.popoverContainer}>
            <TrashIcon />
            <div style={{ color: "#F04438" }}>Delete Booking</div>
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
          setDeleteModal(true);
        },
      },
    ];

    // Filter out the confirm booking option if isConfirmed is true
    return items.filter((item) => !(item.key === "1" && row.is_confirmed));
  }

  const columns: TableColumnsType<any> = [
    {
      title: "Start date",
      dataIndex: "start_date",
      className: "custom-booking-header",
      key: "start_date",
      render: (_, record) => {
        const start_date = formatEpochToDate(
          new Date(record?.start_date).getTime()
        );
        const endDate = formatEpochToDate(new Date(record?.end_date).getTime());

        return (
          <div>
            <span className={styles.start}>{`${start_date} `}</span>
            <span className={styles.end}>{`to ${endDate}`}</span>
          </div>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: ["expand", "customer_id", "name"],
      key: "customer",
    },
    {
      title: "Passenger",
      dataIndex: "passengers",
      key: "passengers",
      render: (_, record) => {
        const passenger = record?.passengers;

        if (!passenger || passenger.length <= 0) {
          return "No passengers data";
        }

        if (Array.isArray(passenger)) {
          if (passenger.length <= 0) {
            return "No passengers data";
          }
          if (passenger.length == 1) {
            return capitalize(passenger[0].name);
          }
          return (
            <Space>
              {capitalize(passenger[0].name)}

              <Popover
                content={() => {
                  return (
                    <>
                      {passenger?.map((each) => (
                        <div>
                          <p className={styles.passengerName}>
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
                <Badge color="yellow" count={`+${passenger.length - 1}`} />
              </Popover>
            </Space>
          );
        }
      },
    },
    {
      title: "Vehicle group",
      dataIndex: "vehicleGroupId",
      key: "vehicleGroupId",
      render: (_, record) => {
        const vehicleGroupName = record?.expand?.vehicle_group_id?.name;

        return <span>{vehicleGroupName}</span>;
      },
    },
    {
      title: "Duty type",
      dataIndex: "dutyType",
      key: "dutyType",
      render: (_, record) => {
        const name = record?.expand?.duty_type_id
          ? record?.expand?.duty_type_id?.name
          : "";
        return <span style={{}}>{name}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "is_confirmed",
      key: "bookingStatus",
      render: (_, record) => {
        const status = record?.is_confirmed;
        return (
          <BookingsStates
            status={status ? "completed" : "unconfirmed"}
            isConfirmed={record?.is_confirmed}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      className: "custom-column",
      render: (data: any, row: any) => {
        return (
          <div
            className={styles.editButton}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal(true);
                setSelectedBooking(row);
              }}
              className={styles.deleteBtn}
            >
              <DeleteIcon />
            </button>
            <Dropdown
              onOpenChange={() => {}}
              menu={{
                items: returnItems(row),
              }}
              trigger={["click"]}
            >
              <button
                className={styles.button}
                onClick={() => {
                  setSelectedBooking(row);
                  dispatch(getBookingById({ id: row?.id }));
                }}
              >
                <DotsHorizontal />
              </button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  function formateData() {
    return bookings?.map((each: any) => {
      return {
        ...each,
        // address: {
        //   dropAddress: each?.dropAddress,
        //   reportingAddress: each?.reportingAddress,
        // },
        // start_date: dayjs(each.duration.startTime).format("DD,MMM YYYY hh:mm A"),
        vehicle_groupid: each.vehicle_groupid,
        id: each.id,
        action: "",
      };
    });
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
    getCheckboxProps: (record: any) => ({
      // disabled: record.name === "Disabled User", // Column configuration not to be checked
      // name: record.name,
    }),
  };

  function handleCloseModal() {
    setDeleteModal(false);
    dispatch(clearCurrentSelectedBooking());
  }
  function handleCloseBookingModal() {
    setConformedBookingModal(false);
    dispatch(clearCurrentSelectedBooking());
  }

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getBookings({
        ...filters,
        search: debouncedSearch,
      })
    );
  }, [debouncedSearch, filters.status]);

  let navigate = useNavigate();

  const handleConfirmBooking = () => {
    handleCloseBookingModal();
    const tempObj = _.omit(currentSelectedBooking, ["id"]);

    const bookingDataUpdate = {
      ...tempObj,
      is_confirmed: true,
      customer_id: currentSelectedBooking?.customer_id,
      booked_by_name: _.omit(currentSelectedBooking?.booked_by_name, ["id"]),
      passengers: currentSelectedBooking?.passengers.map(
        (ele: { name: string; phoneNo: string; email: string }) => ({
          name: ele.name,
          phoneNo: ele.phoneNo,
          email: ele.email,
        })
      ),
      duty_type_id: currentSelectedBooking?.duty_type_id,
      vehicle_group_id: [currentSelectedBooking?.vehicle_group_id],
      vehicleId:
        currentSelectedBooking?.vehicle !== undefined
          ? currentSelectedBooking?.vehicle?.id
          : null,
      driver_id: currentSelectedBooking?.driver_id,
      durationDetails: _.omit(currentSelectedBooking?.durationDetails, ["id"]),
      pricingDetails: _.omit(currentSelectedBooking?.pricingDetails, [
        "company",
      ]),
    };

    dispatch(
      updateBooking({
        id: currentSelectedBooking?.id,
        body: _.omit(bookingDataUpdate, [
          "isActive",
          "customer",
          "dutyType",
          "vehicleGroup",
          "vehicle",
          "driver",
        ]),
      })
    );
  };

  return (
    <>
      <div className={styles.container}>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate(`${RouteName.BOOKINGS}/${record.id}`);
              },
            };
          }}
          bordered
          loading={bookingStates.loading}
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
                  getBookings({
                    search: filters.search,
                    page: page,
                  })
                );
              }}
            />
          )}
        />
      </div>
      {/* delete booking */}
      <Modal show={deleteModal} onClose={() => handleCloseModal()}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete booking</div>
            <div className={styles.secondaryText}>
              {`Are you sure you want to delete this booking? Booking ID: ${selectedBooking?.booking_id}`}
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => {
                dispatch(deleteBooking({ id: selectedBooking.id }));
                handleCloseModal();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      {/* confirmed booking */}
      <Modal
        show={conformedBookingModal}
        onClose={() => handleCloseBookingModal()}
      >
        <div className={styles.modalContainer}>
          <div className={styles["check-icon-container"]}>
            <CheckCircleIcon />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Confirm booking</div>
            <div className={styles.secondaryText}>
              {`Are you sure you want to confirm this booking? Booking ID: ${selectedBooking?.booking_id}`}
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button
              className={styles.cancelBtn}
              onClick={handleCloseBookingModal}
            >
              Cancel
            </button>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirmBooking}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingsTable;
