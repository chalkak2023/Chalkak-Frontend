import Header from '../routes/components/Header'
import NavSideBar from '../routes/components/NavSideBar';

function UserPage({ MainComponent }) {
  return (
    <>
      <Header />
      <NavSideBar />
      <MainComponent />
    </>
  );
}

export default UserPage;
