import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashBoardLayout from "./layout/DashboardLayout";
import Transaction from "./pages/Transaction";
import AddTransaction from "./pages/AddTransaction";
import AskBudgetly from "./pages/AskBudgetly";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { transactionsHref } from "./lib/dashboard-chrome";

const LegacyTransactionRedirect = () => {
  const { accountId } = useParams();
  return <Navigate to={transactionsHref(accountId)} replace />;
};

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
            <Route path="transactions" element={<Transaction />} />
            <Route
              path="transactions/:accountId"
              element={<LegacyTransactionRedirect />}
            />
            <Route path="add-transaction" element={<AddTransaction />} />
            <Route path="ask" element={<AskBudgetly />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
