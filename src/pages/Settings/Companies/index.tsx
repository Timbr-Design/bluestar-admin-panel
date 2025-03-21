/* eslint-disable */
import { useState } from "react";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { ReactComponent as PlusIcon } from "../../../icons/plus.svg";
import SearchComponent from "../../../components/SearchComponent";
import { ReactComponent as SearchIcon } from "../../../icons/SearchIcon.svg";
import PrimaryBtn from "../../../components/PrimaryBtn";
import type { TableProps, MenuProps } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import { Table, Dropdown } from "antd";
import Modal from "../../../components/Modal";
import cn from "classnames";
import CompanyForm from "../CompanyForm";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import CustomPagination from "../../../components/Common/Pagination";
import styles from "./index.module.scss";

interface ICompaniesData {
  key: string;
  _id: string;
  companyName: string;
  address: string;
  email: string;
  phone: string;
}

const companiesList = {
  data: [
    {
      _id: "123",
      companyName: "Green Grass",
      address: "21B, Rash Behari Avenue, Goa",
      email: "qcgame2004pc@gmail.com",
      phone: "(907) 248-8330",
    },
    {
      _id: "234",
      companyName: "Green Grass",
      address: "21B, Rash Behari Avenue, Goa",
      email: "qcgame2004pc@gmail.com",
      phone: "(907) 248-8330",
    },
    {
      _id: "567",
      companyName: "Green Grass",
      address: "21B, Rash Behari Avenue, Goa",
      email: "qcgame2004pc@gmail.com",
      phone: "(907) 248-8330",
    },
  ],
};

const Companies = () => {
  const [openSidePanel, setOpenSidePanel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const items: MenuProps["items"] = [
    {
      label: "Edit company",
      key: "1",
      icon: <EditIcon />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
    }
  };

  const handleCloseSidePanel = () => {
    setOpenSidePanel(false);
  };

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteDriver = () => {
    setOpenDeleteModal(false);
  };

  const columns: TableProps<ICompaniesData>["columns"] = [
    {
      title: "Company Name",
      dataIndex: "companyName",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div className={styles.editButton} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setOpenDeleteModal(true);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button className={styles.button} onClick={() => {}}>
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: ICompaniesData[]
  ) => {
    console.log(selectedRowKeys, "selectedRowKeys");
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  const getInitials = (name: string) => {
    const names = name.split(" "); // Split the name by spaces
    const firstInitial = names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
    const lastInitial = names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

    return firstInitial + (lastInitial || ""); // Combine the initials
  };

  const searchHandler = (e: { target: { value: any } }) => {
    console.log(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerText}>
          <div className={styles.headerPrimary}>{"Companies"}</div>
          <div className={styles.headerSecondary}>
            {"Create and manage your companies here"}
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <SearchComponent
              value={""}
              onChange={searchHandler}
              LeadingIcon={SearchIcon}
              placeholder={`Search by company name`}
            />
          </div>
          <PrimaryBtn
            LeadingIcon={PlusIcon}
            btnText={`Add company`}
            onClick={handleOpenSidePanel}
          />
        </div>
      </div>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {},
          };
        }}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
          selectedRowKeys: selectedRowKeys,
        }}
        columns={columns}
        pagination={false}
        scroll={{
          x: 756,
        }}
        dataSource={companiesList?.data?.map((data: any) => {
          return {
            ...data,
            key: data?._id,
            companyName: (
              <div className={styles.compnayNameContainer}>
                <div
                  className={styles.companyProfile}
                >{`${getInitials(data?.companyName)}`}</div>
                <div className={styles.companyName}>{data?.companyName}</div>
              </div>
            ),
          };
        })}
        className={styles.table}
      />
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Remove company</div>
            <div className={styles.secondaryText}>
              Are you sure you want to remove this company?{" "}
              <div className={styles.selectedSecondaryText}>{"XYZ"}</div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteDriver}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
      {openSidePanel && (
        <div className={cn(styles.sidebar, { [styles.open]: openSidePanel })}>
          <button className={styles.closeBtn} onClick={handleCloseSidePanel}>
            <CrossIcon />
          </button>
          <CompanyForm />
        </div>
      )}
    </div>
  );
};

export default Companies;
