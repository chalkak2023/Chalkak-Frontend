import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import AdminHeader from "../routes/components/AdminHeader";

function AdminPage({ MainComponent }) {
  const admin = useSelector((state) => state.admin);

  return (
    <>
      <AdminHeader />
      <main className="mt-4">
        <Container>
          {admin.loginState ? <MainComponent /> : <p>로그인이 필요합니다.</p>}
        </Container>
      </main>
    </>
  );
}

export default AdminPage;