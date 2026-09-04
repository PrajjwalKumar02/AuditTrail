import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_logged_in") === "true"
  );

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("audittrail_logged_in");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage onLogout={handleLogout} />;
}

export default App;