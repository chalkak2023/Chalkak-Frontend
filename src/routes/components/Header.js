import { Button, Navbar, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthSigninModal from '../auth/AuthSigninModal';
import AuthSignupModal from '../auth/AuthSignupModal';
import { setModalName, setShow } from '../../store/modal.slice';
import { setNavShow } from '../../store/nav.slice';
import NavSideBar from './NavSideBar';
import { useEffect } from 'react';
import { setLogin, setUser } from '../../store/user.slice';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { clearLoginCookie } from '../../utils/controlCookie';

const Header = () => {
  let state = useSelector((state)=> state );
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    let signoutTimeout;
    if (state.user.loginState && state.user.data?.iat) {
      signoutTimeout = setTimeout(() => {
        alert('오랫동안 활동을 하지 않아 로그아웃되었습니다.')
        dispatch(setLogin(false));
        dispatch(setUser({}))
        clearLoginCookie()
      }, (state.user.data.iat + 60 * 60 * 3) * 1000 - Date.now());
    }

    return () => {
      clearTimeout(signoutTimeout)
    }
  }, [state.user.data, state.user.loginState])

  return (
    <>
      { state.modal.modalName === 'signin' && <AuthSigninModal /> }
      { state.modal.modalName === 'signup' && <AuthSignupModal /> }
      { state.modal.modalName === 'change-password' && <ChangePasswordModal /> }

      <Navbar>
        <Container fluid>
          <Navbar.Brand onClick={()=>{navigate('/')}} style={{ cursor: 'pointer' }}>
            <h1>찰칵</h1>
          </Navbar.Brand>
          <div>
            {
              Object.keys(state.user.data).length > 0 ?
              <h3>{state.user.data.username}</h3> : 
              <Button className='ChalkakBtn me-1' onClick={()=>{showModal('signin')}}>로그인</Button>
            }
            <Button className='ChalkakBtn' onClick={()=>{showNav()}}>nav</Button>
          </div>
        </Container>
      </Navbar>
      <NavSideBar />
    </>
  )

  function showNav() {
    dispatch(setNavShow(true));
  }

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default Header;
