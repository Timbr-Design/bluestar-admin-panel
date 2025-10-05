/* eslint-disable */

import {
  Dropdown,
  MenuProps,
  Popover,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import styles from "./index.module.scss";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";
import useDebounce from "../../hooks/common/useDebounce";
import { ReactComponent as DotsHorizontal } from "../../icons/dots-horizontal.svg";
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg";
import { ReactComponent as EyeIcon } from "../../icons/eye2.svg";
import { ReactComponent as CheckCircleIcon } from "../../icons/checkCircle.svg";
import { ReactComponent as CheckCircleFilledIcon } from "../../icons/check-circle-filled.svg";
import { ReactComponent as TrashIconFilled } from "../../icons/trashIconFilled.svg";
import { ReactComponent as SpiralIcon } from "../../icons/SpiralBg.svg";
import { ReactComponent as SearchIcon2 } from "../../icons/SearchIcon2.svg";
import { ReactComponent as IllustrationIcon } from "../../icons/Illustration.svg";
import { ReactComponent as EditIcon } from "../../icons/edit02Component.svg";
import { ReactComponent as DocumentsIcon } from "../../icons/fileIcon.svg";
import { ReactComponent as TrashIcon } from "../../icons/trash2.svg";
import { ReactComponent as SuccessOutlineIcon } from "../../icons/successOutline.svg";

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
  setBookingFilter,
} from "../../redux/slices/bookingSlice";
import BookingsStates from "../States/BookingsStates";
import { useSelector } from "react-redux";
import { RootState } from "../../types/store";
import { formatEpochToDate, capitalize } from "../../helper";
import CustomPagination from "../Common/Pagination";
import { RouteName } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import {
  setSelectedRowIds,
  setSelectedRowType,
} from "../../redux/slices/databaseSlice";
import dayjs from "dayjs";
import EmptyComponent from "../EmptyComponent/EmptyComponent";
import BookingsModal from "../Modal/BookingsModal";
import { BookingsModalProps } from "../../types/booking";
import useNotification from "../DeleteNotification/useNotification";
import { setBookingId } from "../../redux/slices/bookingDutiesSlice";

const BookingsTable = () => {
  const {
    currentSelectedBooking,
    bookings,
    bookingStates,
    pagination,
    filters,
  } = useSelector((state: RootState) => state.booking);
  const [selectedBooking, setSelectedBooking] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalValues, setModalValues] = useState<BookingsModalProps | null>(
    null
  );

  const dispatch = useAppDispatch();
  const notify = useNotification();

  const handleUndoStatus = async (bookingId: string) => {};

  const handleDelete = async () => {
    handleCloseBookingModal();
    const resultAction = await dispatch(
      deleteBooking({ id: selectedBooking.id })
    );

    if (deleteBooking.fulfilled.match(resultAction)) {
      notify.success("Booking has been deleted", "", "", null, true, () =>
        handleUndoStatus(selectedBooking.id)
      );
    } else {
      notify.success("Failed to update details.");
    }
  };

  function returnItems(row: any) {
    const deleteBookingItem = {
      key: "5",
      label: (
        <div className={styles.popoverContainer}>
          <TrashIcon />
          <div style={{ color: "#F04438" }}>Delete Booking</div>
        </div>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation();
        setSelectedBooking(row);
        setOpenModal(true);
        const modalValues: BookingsModalProps = {
          title: "Delete booking",
          desc: `Are you sure you want to delete this booking? Booking ID: ${row?.booking_id}`,
          handleCTA: handleDelete,
          onClose: handleCloseBookingModal,
          actionBtn: "Delete",
          icon: <TrashIconFilled />,
          show: true,
        };
        setModalValues(modalValues);
      },
    };

    const viewBookingItem = {
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
    };

    const editBookingItem = {
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
    };
    const allotItem = {
      key: "6",
      label: (
        <div className={styles.popoverContainer}>
          <DocumentsIcon />
          <div style={{ color: "#344054" }}>Allot all duties</div>
        </div>
      ),
    };
    const confirmItem = {
      key: "1",
      label: (
        <div className={styles.popoverContainer}>
          <CheckCircleIcon />
          <div style={{ color: "#079455" }}>Confirm booking</div>
        </div>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation();
        setOpenModal(true);
        const modalValues: BookingsModalProps = {
          title: "Confirm booking",
          desc: `Are you sure you want to confirm this booking? Booking ID: ${row?.booking_id}`,
          handleCTA: handleConfirmBooking,
          onClose: handleCloseBookingModal,
          actionBtn: "Confirm",
          icon: <CheckCircleFilledIcon />,
          show: true,
          actionBtnColor: "#7F56D9",
        };
        setModalValues(modalValues);
        setSelectedBooking(row);
      },
    };
    const generateItem = {
      key: "4",
      label: (
        <div className={styles.popoverContainer}>
          <DocumentsIcon />
          <div style={{ color: "#344054" }}>Generate invoice</div>
        </div>
      ),
    };

    const items1: MenuProps["items"] = [
      viewBookingItem,
      editBookingItem,
      { type: "divider" },
      allotItem,
      generateItem,
      { type: "divider" },
      deleteBookingItem,
    ];

    const items2: MenuProps["items"] = [
      confirmItem,
      { type: "divider" },
      viewBookingItem,
      editBookingItem,
      { type: "divider" },
      generateItem,
      { type: "divider" },
      deleteBookingItem,
    ];

    return row.is_confirmed ? items1 : items2;
  }

  const columns: TableColumnsType<any> = [
    {
      title: "Start date",
      dataIndex: "start_date",
      className: "custom-booking-header",
      key: "start_date",
      render: (_, record) => {
        const start_date = dayjs(record?.start_date).format("DD/MM/YYYY");
        const endDate = dayjs(record?.end_date).format("DD/MM/YYYY");

        return (
          <div>
            <span className={styles.start}>{`${start_date} `}</span>
            <br></br>
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
                >{`+${passenger.length - 1}`}</div>
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
      title: "Duties",
      dataIndex: "duties",
      key: "duties",
      render: (_, record) => {
        const name = record?.dutyStats
          ? `${record?.dutyStats?.completed}/${record?.dutyStats?.total}`
          : "0/0";
        return <span>{name}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "is_confirmed",
      key: "bookingStatus",
      render: (_, record) => {
        const status = record?.booking_status;
        return (
          <BookingsStates status={status} isConfirmed={record?.is_confirmed} />
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
                setOpenModal(true);
                const modalValues: BookingsModalProps = {
                  title: "Delete booking",
                  desc: `Are you sure you want to delete this booking? Booking ID: ${row?.booking_id}`,
                  handleCTA: handleDelete,
                  onClose: handleCloseBookingModal,
                  actionBtn: "Delete",
                  icon: <TrashIconFilled />,
                  show: true,
                };
                setModalValues(modalValues);

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
        vehicle_groupid: each.vehicle_groupid,
        id: each.id,
        action: "",
      };
    });
  }

  const onChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    dispatch(setSelectedRowType("bookings"));
    dispatch(setSelectedRowIds(selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };

  function handleCloseBookingModal() {
    setOpenModal(false);
    dispatch(clearCurrentSelectedBooking());
  }

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getBookings({
        ...filters,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch, filters.status]);

  useEffect(() => {
    dispatch(setSelectedRowIds([]));
    dispatch(setSelectedRowType(""));
  }, []);

  let navigate = useNavigate();

  const handleConfirmBooking = async () => {
    const bookingId = currentSelectedBooking?.id;
    const isConfirmed = currentSelectedBooking?.is_confirmed;

    const resultAction = await dispatch(
      updateBooking({
        id: bookingId,
        body: {
          is_confirmed: !isConfirmed,
        },
      })
    );

    if (updateBooking.fulfilled.match(resultAction)) {
      notify.success(
        "Booking confirmed successfully!",
        `Booking ID: #${bookingId}`,
        "",
        <SuccessOutlineIcon />
      );
    } else {
      notify.success("Failed to confirm booking.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Table
          rowKey={"id"}
          rowSelection={{
            type: "checkbox",
            onChange: onChange,
            selectedRowKeys: selectedRowKeys,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                dispatch(setBookingId(record.booking_id));
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
                    ? () => dispatch(setBookingFilter({ search: "" }))
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
      <BookingsModal
        show={openModal}
        onClose={handleCloseBookingModal}
        title={modalValues?.title ?? ""}
        desc={modalValues?.desc ?? ""}
        handleCTA={modalValues?.handleCTA ?? null}
        actionBtnColor={modalValues?.actionBtnColor ?? null}
        actionBtn={modalValues?.actionBtn}
        icon={modalValues?.icon ?? null}
      />
    </>
  );
};

export default BookingsTable;
