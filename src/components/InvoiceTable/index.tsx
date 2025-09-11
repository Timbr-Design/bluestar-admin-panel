/* eslint-disable */

import {
  Table,
  TableColumnsType,
  Button,
  Popconfirm,
  Space,
  MenuProps,
  Dropdown,
} from "antd";
import { useEffect, useState } from "react";
import InvoicesStates from "../States/InvoicesStates";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  getInvoices,
  deleteInvoice,
  setCurrentSelectedInvoice,
} from "../../redux/slices/invoiceSlice";
import { RootState } from "../../types/store";
import { formatDateFull } from "../../utils/date";
import CustomPagination from "../Common/Pagination";
import { DeleteOutlined } from "@ant-design/icons";
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg";
import { ReactComponent as CrossIcon } from "../../icons/x.svg";
import { ReactComponent as EyeIcon } from "../../icons/eye.svg";
import styles from "./index.module.scss";
import { ReactComponent as DotsHorizontal } from "../../icons/dots-horizontal.svg";
import useDebounce from "../../hooks/common/useDebounce";
import { ReactComponent as EditIcon } from "../../icons/edit02Component.svg";
import { useNavigate } from "react-router-dom";
import { RouteName } from "../../constants/routes";
import CustomerForm from "../DatabaseTable/CustomerTable/CustomerForm";
import {
  setOpenSidePanel,
  setSelectedCustomer,
} from "../../redux/slices/databaseSlice";
import classNames from "classnames";
import styles1 from "../../pages/Database/index.module.scss";

const InvoiceTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openCustomerForm, setOpenCustomerForm] = useState(false);
  const navigate = useNavigate();
  const { pagination, invoices, invoiceStates } = useAppSelector(
    (state: RootState) => state.invoice
  );
  const { filters } = useAppSelector((state: RootState) => state.billing);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // if (e.key === "1") {
    //   dispatch(getAllowanceById({ id: allowanceId }));
    //   handleOpenSidePanel();
    // } else if (e.key === "2") {
    //   dispatch(
    //     updateAllowance({
    //       payload: { isActive: allowance?.isActive ? false : true },
    //       id: allowance?._id,
    //     })
    //   );
    // }

    if (e.key === "4") {
      setOpenCustomerForm(true);
      const wrapWithData = (obj: object) => ({ data: obj });
      console.log(invoices[0].customer);
      dispatch(setSelectedCustomer(invoices[0].customer));
      // console.log(invoices[0].customer)
      // dispatch(setOpenSidePanel(true));
    }

    if (e.key === "2") {
      navigate(RouteName.CREATE_INVOICE);
      dispatch(setCurrentSelectedInvoice(invoices[0])); // change idx
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "View invoice",
      key: "1",
      icon: <EyeIcon />,
    },
    {
      label: "Edit invoice",
      key: "2",
      icon: <EditIcon />,
    },
    {
      type: "divider",
    },
    {
      label: "Print/Download PDF",
      key: "3",
      icon: <EditIcon />,
    },
    {
      label: "View customer",
      key: "4",
      icon: <EditIcon />,
    },
    {
      label: "Export invoice duties",
      key: "5",
      icon: <EditIcon />,
    },
    {
      type: "divider",
    },
    {
      label: "Cancel Invoice",
      key: "6",
      icon: <EditIcon />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const dispatch = useAppDispatch();
  const columns: TableColumnsType<any> = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Invoice date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Booking ID",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Total amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Amount paid",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Outstanding",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            // setAllowance(record);
          }}
        >
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button
              className={styles.button}
              // onClick={() => setAllowanceId(record._id)}
            >
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space>
    //       <Popconfirm
    //         title="Delete Invoice"
    //         description="Are you sure you want to delete this invoice?"
    //         onConfirm={() => handleDelete(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button
    //           type="text"
    //           danger
    //           icon={<DeleteOutlined />}
    //           title="Delete"
    //         />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getInvoices({
        ...filters,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

  const handleDelete = (id: string) => {
    dispatch(deleteInvoice({ id }));
  };

  const populateData = () => {
    return invoices?.map((data) => {
      return {
        ...data,
        invoiceNumber: data?.invoiceNumber,
        customer: data?.customer?.name,
        amount: `₹${data?.amount || 0}`,
        invoiceDate: formatDateFull(data?.invoiceDate),
        dueDate: formatDateFull(data?.dueDate),
        status: <InvoicesStates status={data.status} />,
        key: data?._id,
        id: data?._id,
      };
    });
  };

  useEffect(() => {
    dispatch(getInvoices({ page: 1, limit: 10 }));
  }, []);

  return (
    <div className={classNames("container", styles1.container)}>
      <Table
        bordered
        columns={columns}
        dataSource={populateData()}
        pagination={false}
        loading={invoiceStates?.loading}
        footer={() => (
          <CustomPagination
            total={pagination?.totalDocuments ?? 0}
            current={pagination?.currentPage ?? 1}
            pageSize={10}
            onPageChange={(page: number) => {
              dispatch(
                getInvoices({
                  page: page,
                  limit: 10,
                })
              );
            }}
          />
        )}
      />
      {openCustomerForm && (
        <div
          className={classNames(styles1.sidebar, {
            [styles1.open]: openCustomerForm,
          })}
        >
          <button
            className={styles1.closeBtn}
            onClick={() => {
              setOpenCustomerForm(false);
              dispatch(setSelectedCustomer(null));
            }}
          >
            <CrossIcon />
          </button>
          <CustomerForm
            handleCloseSidePanel={() => {
              setOpenCustomerForm(false);
              dispatch(setSelectedCustomer(null));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
