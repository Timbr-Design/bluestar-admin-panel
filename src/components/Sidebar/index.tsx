/* eslint-disable */
import { Link, useLocation } from "react-router-dom";
import { Tooltip, Popover, Button } from "antd";
import cn from "classnames";
import { ReactComponent as FileIcon } from "../../icons/file.svg";
import { ReactComponent as Database } from "../../icons/database.svg";
import { ReactComponent as Drivers } from "../../icons/drivers.svg";
import { ReactComponent as BookingsIcon } from "../../icons/bookings.svg";
import { ReactComponent as VehicleRename } from "../../icons/VehicleRename.svg";
import { ReactComponent as Availability } from "../../icons/Availability.svg";
import { ReactComponent as Logo } from "../../icons/TempLogo.svg";
import { ReactComponent as Settings } from "../../icons/settings.svg";
import { RouteName } from "../../constants/routes";
import styles from "./index.module.scss";
import { getCookie } from "../../helper/getCookie";
import { useAppDispatch } from "../../hooks/store";
import { logout } from "../../redux/slices/loginSlice";

const getInitials = (name: string) => {
  const names = name.split(" "); // Split the name by spaces
  const firstInitial = names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
  const lastInitial = names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

  return firstInitial + (lastInitial || ""); // Combine the initials
};

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const fullName = getCookie("fullName") || "";
  const initials = getInitials(fullName);

  const handleLogout = () => {
    dispatch(logout());
  };

  const content = (
    <div className={styles.popoverContent}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{fullName}</div>
        <div className={styles.userEmail}>{getCookie("email")}</div>
      </div>
      <Button 
        type="text" 
        danger 
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </Button>
    </div>
  );

  return (
    <div className={styles.container}>
      <Link to={RouteName.HOME}>
        <div className={styles.logo}>
          <Logo />
        </div>
      </Link>
      <div className={styles.iconsContainer}>
        <Tooltip placement="right" title={"Bookings"}>
          <Link to={RouteName.BOOKINGS}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.BOOKINGS
                ),
              })}
            >
              <BookingsIcon className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
        <Tooltip placement="right" title={"Billing"}>
          <Link to={RouteName.BILLINGS}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.BILLINGS
                ),
              })}
            >
              <FileIcon className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
        <Tooltip placement="right" title={"Database"}>
          <Link to={`${RouteName.DATABASE}/duty_types`}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.DATABASE
                ),
              })}
            >
              <Database className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
        <Tooltip placement="right" title={"Drivers attendance & Payroll"}>
          <Link to={RouteName.DRIVERS}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.DRIVERS
                ),
              })}
            >
              <Drivers className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
        <Tooltip placement="right" title={"Vehicle Expense"}>
          <Link to={RouteName.VEHICLE_TRACKER}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.VEHICLE_TRACKER
                ),
              })}
            >
              <VehicleRename className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
        <Tooltip placement="right" title={"Availability"}>
          <Link to={RouteName.AVAILABILITY}>
            <div
              className={cn(styles.icon, {
                [styles.selected]: location.pathname.startsWith(
                  RouteName.AVAILABILITY
                ),
              })}
            >
              <Availability className={styles.svgIcon} />
            </div>
          </Link>
        </Tooltip>
      </div>
      <div className={styles.settings}>
        <Link to={RouteName.SETTINGS}>
          <Settings />
        </Link>
      </div>
      <div className={styles.profileContainer}>
        <Popover 
          content={content} 
          placement="right"
          trigger="click"
          overlayClassName={styles.profilePopover}
        >
          <div className={styles.profileCircle}>
            {initials}
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Sidebar;
