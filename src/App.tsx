/* eslint-disable */
import Routes from "./routes";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Sidebar from "../src/components/Sidebar";
import { RouteName } from "../src/constants/routes";
import "./styles/index.scss";
import { ConfigProvider } from "antd";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === RouteName.LOGIN;

  return (
    <div className={`App`}>
      {!isLoginPage && <Sidebar />}
      <Routes />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#7F56D9",
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </Router>
  );
}

export default App;
