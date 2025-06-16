/* eslint-disable */
import cn from "classnames";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import styles from "./index.module.scss";
import SearchComponent from "../../components/SearchComponent";
import { ReactComponent as SearchIcon } from "../../icons/SearchIcon.svg";
import { ReactComponent as PlusIcon } from "../../icons/plus.svg";
import { Button, Form } from "antd";
import DriverFilter from "../../components/DriverFilter";
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
  const dispatch = useAppDispatch();
  const { filters } = useSelector((state: RootState) => state.vehicleTracker);

  return (
    <div className={styles.tabs}>
      {tab?.map((item) => (
        <Button
          key={item.type}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isFocused, setIsFocused] = useState(false);

  const { filters } = useSelector((state: RootState) => state.vehicleTracker);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const addSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const unique = prev.filter((t) => t !== term);
      const updated = [term, ...unique].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setVehicleTrackerFilter({ search: value }));

    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(
      setTimeout(() => {
        addSearchToHistory(value);
      }, 1000)
    );
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(setVehicleTrackerFilter({ search: searchTerm }));
      addSearchToHistory(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(setVehicleTrackerFilter({ search: "" }));
  };

  const handleSuggestionClick = (value: string) => {
    setSearchTerm(value);
    dispatch(setVehicleTrackerFilter({ search: value }));
    addSearchToHistory(value);
  };

  const [form] = Form.useForm();

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
            <div className={styles.searchWrapper}>
              <div className={styles.inputWithIcon}>
                <SearchComponent
                  value={searchTerm}
                  onChange={searchHandler}
                  LeadingIcon={SearchIcon}
                  placeholder={`Search by car`}
                  suggestions={recentSearches}
                  suggestionsVisible={isFocused && recentSearches.length > 0}
                  onSuggestionClick={handleSuggestionClick}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                />
              </div>
            </div>

            {(filters.currentTab === "expense" ||
              filters.currentTab === "fuel") && (
              <PrimaryBtn
                LeadingIcon={PlusIcon}
                btnText={`Add ${
                  filters.currentTab.charAt(0).toUpperCase() +
                  filters.currentTab.slice(1)
                }`}
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
