import { Button, Navbar, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthSigninModal from '../auth/AuthSigninModal';
import AuthSignupModal from '../auth/AuthSignupModal';
import { setModalName, setShow } from '../../store/modal.slice';

const Header = () => {
  let state = useSelector((state)=> state );
  let navigate = useNavigate();
  let dispatch = useDispatch();

  return (
    <>
      { state.modal.modalName === 'signin' && <AuthSigninModal /> }
      { state.modal.modalName === 'signup' && <AuthSignupModal /> }

      <Navbar>
        <Container fluid>
          <Navbar.Brand onClick={()=>{navigate('/')}} style={{ cursor: 'pointer' }}>
            <h1>찰칵</h1>
          </Navbar.Brand>
          {
            state.user.data.email ?
            <h3>{state.user.data.email.split('@')[0]}</h3> : 
            <Button variant="outline-dark" onClick={()=>{showModal('signin')}}>로그인</Button>
          }
        </Container>
      </Navbar>
    </>
  )

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default Header;
