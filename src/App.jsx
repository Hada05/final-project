import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./layouts/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DaftarPengajuan from "./pages/admin/DaftarPengajuan";
import LaporanKeuangan from "./pages/admin/LaporanKeuangan";
import ProfileAdmin from "./pages/admin/ProfileAdmin";
import ReviewPengajuan from "./pages/admin/ReviewPengajuan";
import DashboardAnggota from "./pages/user/DashboardAnggota";
import AnggotaLayout from "./layouts/AnggotaLayout";
import ProfileAnggota from "./pages/user/ProfileAnggota";
import DetailPengajuan from "./pages/user/DetailPengajuan";
import PengajuanBaru from "./pages/user/PengajuanBaru";
import DaftarUsers from "./pages/admin/DaftarUsers";
import UserDetail from "./pages/admin/UserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="pengajuan" element={<DaftarPengajuan />} />
          <Route path="pengajuan/:id" element={<ReviewPengajuan />} />
          <Route path="laporan" element={<LaporanKeuangan />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="users" element={<DaftarUsers />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>

        {/* Anggota */}
        <Route path="/" element={<AnggotaLayout />}>
          <Route index element={<DashboardAnggota />} />
          <Route path="profile" element={<ProfileAnggota />} />
          <Route path="reimbursements/:id" element={<DetailPengajuan />} />
          <Route path="add" element={<PengajuanBaru />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
