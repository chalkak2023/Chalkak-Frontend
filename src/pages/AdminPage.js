import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSignin from "../routes/admin/AdminSignin";
import AdminHeader from "../routes/components/AdminHeader";

function AdminPage({ MainComponent }) {
  const admin = useSelector((state) => state.admin);
  let navigate = useNavigate();

  useEffect(() => {
    if (!admin.loginState) {
      navigate('/admin')
    }
  }, [admin.loginState])

  return (
    <>
      {admin.loginState ? (
        <>
          <AdminHeader />
          <main className="mt-4">
            <Container>
              <MainComponent />
            </Container>
          </main>
        </>
      ) : (
        <AdminSignin />
      )}
    </>
  );
}

export default AdminPage;