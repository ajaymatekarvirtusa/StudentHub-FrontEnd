import { useState } from "react";
import { useAuth } from "./auth/useAuth.js";
import AppHeader from "./components/AppHeader.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import CountriesPage from "./pages/CountriesPage.jsx";

// Screens in the top menu. Add a new master here (e.g. States) when it is built.
const PAGES = [
  { id: "students", label: "Students", component: StudentsPage },
  { id: "countries", label: "Countries", component: CountriesPage },
];

function App() {
  const { isAuthenticated } = useAuth();
  const [current, setCurrent] = useState("students");

  if (!isAuthenticated) return <LoginPage />;

  const Page = PAGES.find((p) => p.id === current)?.component ?? StudentsPage;

  return (
    <div className="app">
      <AppHeader pages={PAGES} current={current} onNavigate={setCurrent} />
      <Page />
    </div>
  );
}

export default App;
