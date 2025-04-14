import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashBoardLayout from "./layout/DashboardLayout";
import Transaction from "./pages/Transaction";
import AddTransaction from "./pages/AddTransaction";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions/:accountId" element={<Transaction />} />
            <Route path="add-transaction" element={<AddTransaction />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
