/* eslint-disable */
import cn from "classnames";
import { ChangeEvent, useState } from "react";
import styles from "./index.module.scss";
import SearchComponent from "../../components/SearchComponent";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { ReactComponent as SearchIcon } from "../../icons/SearchIcon.svg";
import { ReactComponent as PlusIcon } from "../../icons/plus.svg";
import { Button, Form } from "antd";
import DriverFilter from "../../components/DriverFilter";
import { ReactComponent as CrossIcon } from "../../icons/x.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../types/store";
import { useAppDispatch } from "../../hooks/store";
import PrimaryBtn from "../../components/PrimaryBtn";
import {
  setIsViewDrawerOpen,
  setVehicleTrackerFilter,
} from "../../redux/slices/vehicleTrackerSlice";
import FuelForm from "./FuelForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "../../components/VehicleTracker/tables/Expense";
import FuelsTable from "../../components/VehicleTracker/tables/Fuels";
import LoansTable from "../../components/VehicleTracker/tables/Loans";
import AverageTable from "../../components/VehicleTracker/tables/Average";

const tab = [
  {
    name: "Expense",
    type: "expense",
    desc: "Create and manage your vehicle expenses here",
  },
  {
    name: "Fuel",
    type: "fuel",
    desc: "Create and manage your vehicle fuel expenses here",
  },
  {
    name: "Loans",
    type: "loans",
    desc: "Ongoing loans for all your vehicles",
  },
  {
    name: "Average",
    type: "average",
    desc: "Fuel average for all your vehicles",
  },
];
const VehicleTabs = ({ setDescVal }: any) => {
  // const [filter, setFilter] = useState("");
  const dispatch = useAppDispatch();
  const { filters } = useSelector((state: RootState) => state.vehicleTracker);

  return (
    <div className={styles.tabs}>
      {tab?.map((item) => (
        <Button
          style={{
            border: "0px",
            boxShadow: "0 0 0 rgb(0, 0, 0)",
            padding: "1.5rem",
            fontWeight: "700",
            fontSize: "1rem",
            background: filters.currentTab === item.type ? "#F9F5FF" : "",
            color: filters.currentTab === item.type ? "#6941C6" : "",
          }}
          onClick={() => {
            dispatch(setVehicleTrackerFilter({ currentTab: item.type }));
            setDescVal(item.desc);
          }}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

const VehicleTrackerPage = () => {
  const dispatch = useAppDispatch();
  const [desc, setDesc] = useState(tab[0].desc);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openFuelForm, setOpenFuelForm] = useState(false);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setSearchTerm(value);
    dispatch(setVehicleTrackerFilter({ search: value }));
  };

  const { filters, isViewDrawerOpen } = useSelector(
    (state: RootState) => state.vehicleTracker
  );

  const [form] = Form.useForm();

  const renderBtnText = () => {
    if (filters.currentTab === "expense") {
    } else if (filters.currentTab === "") {
    }
  };

  const handleSidePanelForm = () => {
    if (filters.currentTab === "expense") {
      setOpenExpenseForm(true);
    } else if (filters.currentTab === "fuel") {
      setOpenFuelForm(true);
    }
  };

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div>
          <div className={styles.heading}>Vehicle Tracker</div>
          <div className={styles.text}>
            {"Manage your vehicle’s expenses and average here"}
          </div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <VehicleTabs setDescVal={(val: string) => setDesc(val)} />

        <div className={styles.searchContainer}>
          <div className={styles.header}>
            <div className={styles.tabHeading}>{filters.currentTab}</div>
            <div className={styles.descText}>{desc}</div>
          </div>
          <div className={styles.inputContainer}>
            <SearchComponent
              value={""}
              onChange={searchHandler}
              LeadingIcon={SearchIcon}
              placeholder={`Search by car`}
            />
            {(filters.currentTab === "expense" ||
              filters.currentTab === "fuel") && (
              <PrimaryBtn
                LeadingIcon={PlusIcon}
                btnText={`Add ${filters.currentTab.charAt(0).toUpperCase() + filters.currentTab.slice(1)}`}
                onClick={handleSidePanelForm}
              />
            )}
            {filters.currentTab === "average" && <DriverFilter />}
          </div>
        </div>

        {filters.currentTab === "expense" && (
          <ExpenseTable handleOpenSidePanel={() => {}} />
        )}
        {filters.currentTab === "fuel" && (
          <FuelsTable handleOpenSidePanel={() => {}} />
        )}
        {filters.currentTab === "loans" && (
          <LoansTable handleOpenSidePanel={() => {}} />
        )}
        {filters.currentTab === "average" && (
          <AverageTable handleOpenSidePanel={() => {}} />
        )}
      </div>
      <FuelForm open={openFuelForm} onClose={() => setOpenFuelForm(false)} />
      <ExpenseForm
        open={openExpenseForm}
        onClose={() => setOpenExpenseForm(false)}
      />
    </div>
  );
};

export default VehicleTrackerPage;
