import Header from '../routes/components/Header'
import NavSideBar from '../routes/components/NavSideBar';
import Footer from '../routes/components/Footer'

function UserPage({ MainComponent }) {
  return (
    <>
      <Header />
      <NavSideBar />
      <MainComponent />
      <Footer />
    </>
  );
}

export default UserPage;
