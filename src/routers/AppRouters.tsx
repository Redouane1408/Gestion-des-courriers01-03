import Page from "@/pages/Dashboard";
import Login from "@/pages/Login";
import UsersPage from "@/pages/Users";
import DocumentsPage from "@/pages/Documents"
import { Routes, Route } from "react-router-dom";


function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Page />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;