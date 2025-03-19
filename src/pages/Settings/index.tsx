/* eslint-disable */
import { useState } from "react";
import cn from "classnames";
import Team from "./Team";
import Account from "./Account";
import Companies from "./Companies";
import styles from "./index.module.scss";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`${styles.tab} ${isActive ? styles.active : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Account");
  const tabs = ["Account", "Team members", "Companies"];
  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div className={styles.header}>
          <div className={styles.heading}>Settings</div>
          <div className={styles.text}>
            Manage your account settings and preferences from here
          </div>
        </div>
        <nav className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </nav>
      </div>
      {activeTab === "Account" && <Account />}
      {activeTab === "Team members" && <Team />}
      {activeTab === "Companies" && <Companies />}
    </div>
  );
};

export default Settings;
