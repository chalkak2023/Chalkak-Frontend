import Header from '../routes/components/Header'
import NavSideBar from '../routes/components/NavSideBar';
import Footer from '../routes/components/Footer'
import { useSelector } from 'react-redux';

function UserPage({ MainComponent }) {
  const state = useSelector((state) => state);

  return (
    <>
      <Header />
      <NavSideBar />
      <MainComponent />
      {
        state.footer.isFooterOn ?
        <Footer /> : ''
      }
    </>
  );
}

export default UserPage;
