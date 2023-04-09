import { useNavigate } from 'react-router-dom';
import github_logo from './github_logo.png';

const Footer = () => {
  let navigate = useNavigate();

  return (
    <>
      <footer className="d-flex flex-wrap justify-content-between align-items-center" style={{ color: 'white', padding: '10px', marginTop: '200px' }}>
        <p className="col-md-4 mb-0">&copy; 2023 Chalkak, Inc</p>

        <a href="https://github.com/chalkak2023/Chalkak-Backend" target={'_blank'} className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <img className="bi me-2" width="32" height="32" src={github_logo} alt="GitHub Logo" />
        </a>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item"><a style={{ color: 'white', cursor: 'pointer' }} onClick={() => { navigate('/guide'); }} className="nav-link px-2">서비스 이용안내</a></li>
        </ul>
      </footer>
    </>
  )
};

export default Footer;
