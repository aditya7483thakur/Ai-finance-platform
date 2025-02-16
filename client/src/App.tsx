import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Navbar from "./components/custom/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
