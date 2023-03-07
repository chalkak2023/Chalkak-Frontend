import AdminHeader from "../components/AdminHeader";

function AdminPage(MainComponent) {
  return (
    <>
      <AdminHeader />
      <MainComponent />
    </>
  );
}

export default AdminPage;
