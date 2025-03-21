/* eslint-disable */
import { Table, Button, Space, MenuProps, Dropdown } from "antd";
import { useState } from "react";
import cn from "classnames";
import Modal from "../../../components/Modal";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as PlusIcon } from "../../../icons/plus.svg";
import { ReactComponent as SearchIcon } from "../../../icons/SearchIcon.svg";
import styles from "./index.module.scss";
import SearchComponent from "../../../components/SearchComponent";
import PrimaryBtn from "../../../components/PrimaryBtn";
import TeamForm from "../TeamForm";
const data = [
  {
    key: "1",
    name: "John Doe",
    role: "Admin",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
  },
  {
    key: "2",
    name: "Jane Smith",
    role: "Manager",
    email: "jane.smith@example.com",
    phone: "+91 98765 43211",
  },
  // Add more mock data as needed
];

const Teams = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openSidePanel, setOpenSidePanel] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const getInitials = (name: string) => {
    const names = name.split(" "); // Split the name by spaces
    const firstInitial = names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
    const lastInitial = names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

    return firstInitial + (lastInitial || ""); // Combine the initials
  };

  const items: MenuProps["items"] = [
    {
      label: "Remove User",
      key: "1",
      icon: <DeleteIcon />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      setOpenDeleteModal(true);
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

  const handleRemoveTeamMember = () => {
    setOpenDeleteModal(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record: any) => (
        <div className={styles.compnayNameContainer}>
          <div
            className={styles.companyProfile}
          >{`${getInitials(record?.name)}`}</div>
          <div className={styles.companyName}>{record?.name}</div>
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div className={styles.editButton} onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <button className={styles.button} onClick={() => {}}>
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    console.log("Edit:", record);
  };

  const onChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  const searchHandler = (e: { target: { value: any } }) => {
    console.log(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerText}>
          <div className={styles.headerPrimary}>{"Team Members"}</div>
          <div className={styles.headerSecondary}>
            {"Manage your team members and their roles"}
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <SearchComponent
              value={""}
              onChange={searchHandler}
              LeadingIcon={SearchIcon}
              placeholder={`Search team member`}
            />
          </div>
          <PrimaryBtn
            LeadingIcon={PlusIcon}
            btnText={`Add Team member`}
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
          onChange: (selectedKeys) => {
            console.log("Selected:", selectedKeys);
          },
          selectedRowKeys: [],
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          x: 756,
        }}
        className={styles.table}
      />
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Remove User?</div>
            <div className={styles.secondaryText}>
              Are you sure you want to remove this user?{" "}
              <div className={styles.selectedSecondaryText}>{"XYZ"}</div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleRemoveTeamMember}
            >
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
          <TeamForm />
        </div>
      )}
    </div>
  );
};

export default Teams;
