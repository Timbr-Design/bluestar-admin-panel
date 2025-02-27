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
import axios from "axios";
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
  setCurrentSelectedBooking,
  getBookings,
  setIsEditingBooking,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import BookingsStates from "../States/BookingsStates";
import { useSelector } from "react-redux";
import { RootState } from "../../types/store";
import apiClient from "../../utils/configureAxios";
import { formatEpochToDate, capitalize } from "../../helper";
import CustomPagination from "../Common/Pagination";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import row from "antd/es/row";

const BookingsTable = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [conformedBookingModal, setConformedBookingModal] = useState(false);
  const {
    isAddEditDrawerOpen,
    currentSelectedBooking,
    bookings,
    bookingStates,
    pagination,
    filters,
  } = useSelector((state: RootState) => state.booking);
  const [currentSelectedBookingId, setCurrentBookingId] = useState("");

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
          // setCurrentSelectedBooking(row);
          e.domEvent.stopPropagation();
          setCurrentBookingId(row?._id);
          dispatch(setCurrentSelectedBooking(row));
          setConformedBookingModal(true);
        },
      },
      {
        key: "2",
        onClick: (e) => {
          e.domEvent.stopPropagation();
          dispatch(setCurrentSelectedBooking(row));
          dispatch(setIsEditingBooking(true));
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
          dispatch(setCurrentSelectedBooking(row));
          dispatch(setIsEditingBooking(false));
          dispatch(setIsAddEditDrawerOpen());
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
          dispatch(setCurrentSelectedBooking(row));
        },
      },
    ];
    return items;
  }

  const getCustomer = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/database/customer/${id}`
      );
      return response.data.data.name;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getCustomerName = async (id: string) => {
    const customer = await getCustomer(id);
    return customer;
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Start date",
      dataIndex: "startDate",
      className: "custom-booking-header",
      key: "startDate",
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
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (_, record) => {
        // const [name, setName] = useState("");

        // getCustomerName(record?.customerId)
        //   .then((ele) => {
        //     setName(ele);
        //   })
        //   .catch((err) => console.error(err));

        return <span>{record?.customerId}</span>;
      },
    },
    // {
    //   title: "Alternate option",
    //   dataIndex: "assignAlternateVehicles",
    //   key: "assignAlternateVehicles",
    //   render: (each: any) => (each === false ? "No" : "Yes"),
    // },
    // {
    //   title: "Customer",
    //   dataIndex: "customerId",
    //   key: "customerId",
    //   render: (each: any) => {
    //     return <span>{each.name}</span>;
    //   },
    // },
    // {
    //   title: "Booked By",
    //   dataIndex: "bookedBy",
    //   key: "bookedBy",
    //   width: "200px",
    //   render: (each: any) => {
    //     return (
    //       <div>
    //         <p>
    //           <UserOutlined /> {each.name}
    //         </p>
    //         <p>
    //           <PhoneOutlined /> {each.phoneNumber}
    //         </p>
    //         <p>
    //           <MailOutlined /> {each.email}
    //         </p>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Passenger",
      dataIndex: "passengers",
      key: "passengers",
      render: (_, record) => {
        const passenger = record?.passenger;

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
        const vehicleGroupId = record?.vehicleGroupId[0];

        return <span>{vehicleGroupId}</span>;
      },
    },
    {
      title: "Duty type",
      dataIndex: "dutyTypeId",
      key: "dutyTypeId",
      render: (_, record) => {
        const dutyTypeId = record?.dutyTypeId;
        return <span>{dutyTypeId}</span>;
      },
    },
    {
      title: "Duties",
      dataIndex: "duties",
      key: "duties",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //   render: (data) => {
    //     return (
    //       <div onClick={(event) => event.stopPropagation()}>
    //         <a href={data?.dropAddress} target="_blank">
    //           <PushpinOutlined /> Drop address
    //         </a>
    //         <br />
    //         <a href={data?.reportingAddress} target="_blank">
    //           <PushpinOutlined /> Reporting address
    //         </a>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Airport Booking",
    //   dataIndex: "isAirportBooking",
    //   key: "isAirportBooking",
    //   render: (each: any) => (each === false ? "No" : "yes"),
    // },
    // {
    //   title: "Confirmed Status",
    //   dataIndex: "isUnconfirmed",
    //   key: "isUnconfirmed",
    //   render: (each: any) => (each === false ? "Yes" : "No"),
    // },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      // render: (data: any) => {
      //   return <BookingsStates status={data.toLowerCase()} />;
      // },
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
                dispatch(setCurrentSelectedBooking(row));
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
              <button className={styles.button}>
                <DotsHorizontal />
              </button>
            </Dropdown>
          </div>

          // <div className={styles.columnsAction}>
          //   <DeleteOutlined
          //     onClick={(e) => {
          // console.log(row, "row");
          // e.stopPropagation();
          // setDeleteModal(true);
          // dispatch(setCurrentSelectedBooking(row));
          //     }}
          //     className={styles.deleteIcon}
          //   />
          //   <Dropdown menu={{ items: returnItems(row) }}>
          //     <MoreOutlined />
          //   </Dropdown>
          // </div>
        );
      },
    },
  ];

  function formateData() {
    return bookings?.map((each: any) => {
      return {
        ...each,
        address: {
          dropAddress: each?.dropAddress,
          reportingAddress: each?.reportingAddress,
        },
        // startDate: dayjs(each.duration.startTime).format("DD,MMM YYYY hh:mm A"),
        vehicleGroupId: each.vehicleGroupId,
        id: each._id,
        action: "",
      };
    });
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: any) => ({
      // disabled: record.name === "Disabled User", // Column configuration not to be checked
      // name: record.name,
    }),
  };

  function handleCloseModal() {
    setDeleteModal(false);
    dispatch(setCurrentSelectedBooking({}));
  }
  function handleCloseBookingModal() {
    setConformedBookingModal(false);
    dispatch(setCurrentSelectedBooking({}));
  }

  useEffect(() => {
    dispatch(getBookings({ ...filters }));
  }, [filters.search, filters.status]);
  let navigate = useNavigate();

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
                navigate(`${RouteName.BOOKINGS}/${record._id}`);
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
              {`Are you sure you want to delete this booking? Booking ID: ${currentSelectedBooking?.id}`}
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => {
                dispatch(deleteBooking({ id: currentSelectedBooking._id }));
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
              {`Are you sure you want to confirm this booking? Booking ID: ${currentSelectedBookingId}`}
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
              onClick={() => {
                handleCloseBookingModal();
              }}
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
