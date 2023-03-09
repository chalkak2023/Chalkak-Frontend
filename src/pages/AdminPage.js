import AdminHeader from "../routes/components/AdminHeader";

function AdminPage({ MainComponent }) {
  return (
    <>
      <AdminHeader />
      <MainComponent />
    </>
  );
}

export default AdminPage;
