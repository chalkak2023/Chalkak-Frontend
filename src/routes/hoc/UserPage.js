import Header from '../components/Header'
import NavSideBar from '../components/NavSideBar';

function UserPage(MainComponent) {
  return (
    <>
      <Header />
      <NavSideBar />
      <MainComponent />
    </>
  );
}

export default UserPage;
