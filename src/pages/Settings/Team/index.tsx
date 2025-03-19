/* eslint-disable */
import { ReactComponent as PlusIcon } from "../../../icons/plus.svg";
import SearchComponent from "../../../components/SearchComponent";
import PrimaryBtn from "../../../components/PrimaryBtn";
import styles from "./index.module.scss";

const Team = () => {
  const searchHandler = (e: { target: { value: any } }) => {
    console.log(e.target.value);
  };

  const handleOpenSidePanel = () => {};

  return (
    <div className={styles.container}>
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
              LeadingIcon={SearchComponent}
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
    </div>
  );
};

export default Team;
