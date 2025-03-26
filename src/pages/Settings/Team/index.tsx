/* eslint-disable */
import { useState, useEffect } from "react";
import { Table, Dropdown, Button, notification } from "antd";
import type { TableProps, MenuProps } from "antd";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { ReactComponent as PlusIcon } from "../../../icons/plus.svg";
import { ReactComponent as SearchIcon } from "../../../icons/SearchIcon.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import { ReactComponent as DeleteIconRed } from "../../../icons/trash-red.svg";
import { ReactComponent as DotsHorizontal } from "../../../icons/dots-horizontal.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-02.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import cn from "classnames";
import { 
  getTeamMembers, 
  getTeamMemberById, 
  deleteTeamMember,
  clearCurrentTeamMember 
} from "../../../redux/slices/teamMemberSlice";
import SearchComponent from "../../../components/SearchComponent";
import PrimaryBtn from "../../../components/PrimaryBtn";
import Modal from "../../../components/Modal";
import CustomPagination from "../../../components/Common/Pagination";
import TeamForm from "../TeamForm";
import styles from "./index.module.scss";

const Team = () => {
  const dispatch = useAppDispatch();
  const { teamMembers, loading, pagination } = useAppSelector((state) => state.teamMember);
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    dispatch(getTeamMembers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteTeamMember(selectedMember._id)).unwrap();
      setOpenDeleteModal(false);
      setSelectedMember(null);
      dispatch(getTeamMembers({ 
        page: pagination.page, 
        limit: pagination.limit 
      }));
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: error.message || 'Failed to delete team member',
      });
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit member",
      key: "1",
      icon: <EditIcon />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      dispatch(getTeamMemberById(selectedMember._id));
      setOpenSidePanel(true);
    }
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: "",
      dataIndex: "action",
      className: "action-column",
      render: (_, record) => (
        <div className={styles.editButton}>
          <button
            onClick={() => {
              setSelectedMember(record);
              setOpenDeleteModal(true);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon />
          </button>
          <Dropdown 
            menu={{ 
              items, 
              onClick: (e) => handleMenuClick(e) 
            }} 
            trigger={["click"]}
          >
            <button className={styles.button} onClick={()=> {
              setSelectedMember(record);
            }}>
              <DotsHorizontal />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(getTeamMembers({ 
      page: 1, 
      limit: pagination.limit,
      search: value 
    }));
  };

  const searchHandler = (e: { target: { value: any } }) => {
    console.log(e.target.value);
  };

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.tableHeader}>
        <div className={styles.headerText}>
          <div className={styles.headerPrimary}>{"Team Member"}</div>
          <div className={styles.headerSecondary}>
            {"Manage who has access to this workspace"}
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
            onClick={()=> {
              dispatch(clearCurrentTeamMember());
              setOpenSidePanel(true);
            }}
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
        loading={loading}
        columns={columns}
        dataSource={teamMembers}
        pagination={false}
        scroll={{
          x: 756,
        }}
        rowSelection={{
          type: "checkbox",
          onChange: onChange,
          selectedRowKeys: selectedRowKeys,
        }}
        className={styles.table}
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {}}
          />
        )}
      />

      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>{`Remove User?`}</div>
            <div className={styles.secondaryText}>
              {`Are you sure you want to remove this user?`}
              <div className={styles.selectedSecondaryText}>
                {selectedMember?.fullName || ""}
              </div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </button>
            <button 
              className={styles.deleteBtn} 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {openSidePanel && (
        <div className={cn(styles.sidebar, { [styles.open]: openSidePanel })}>
          <button 
            className={styles.closeBtn} 
            onClick={() => {
              setOpenSidePanel(false);
              dispatch(clearCurrentTeamMember());
            }}
          >
            <CrossIcon />
          </button>
          <TeamForm handleCloseSidePanel={() => {
            setOpenSidePanel(false);
            dispatch(clearCurrentTeamMember());
          }} />
        </div>
      )}
    </div>
  );
};

export default Team;
