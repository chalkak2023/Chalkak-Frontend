import { useEffect } from "react";
import { useSelector } from "react-redux";
import AdminHeader from "../routes/components/AdminHeader";

function AdminPage({ MainComponent }) {
  const admin = useSelector((state) => state.admin);

  return (
    <>
      <AdminHeader />
      {admin.loginState ? <MainComponent /> : <p>로그인이 필요합니다.</p>}
    </>
  );
}

export default AdminPage;