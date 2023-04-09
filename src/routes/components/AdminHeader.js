import { useEffect } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setAdmin, setAdminLogin } from '../../store/admin.slice';
import { setModalName, setShow } from "../../store/modal.slice";
import apiAxios from "../../utils/api-axios";
import { clearAdminLoginCookie } from "../../utils/controlCookie";
import AdminSigninModal from "../admin/modals/AdminSigninModal";
import './AdminHeader.css'

const AdminHeader = () => {
  let state = useSelector((state) => state);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    let signoutTimeout;
    if (state.admin.loginState && state.admin.data?.iat) {
      signoutTimeout = setTimeout(() => {
        alert('오랫동안 활동을 하지 않아 관리자 로그아웃되었습니다.')
        dispatch(setAdminLogin(false));
        dispatch(setAdmin({}))
        clearAdminLoginCookie()
      }, (state.admin.data.iat + 60 * 60 * 3) * 1000 - Date.now());
    }

    return () => {
      clearTimeout(signoutTimeout)
    }
  }, [state.admin.data, state.admin.loginState])

  return (
    <>
       { state.modal.modalName === 'admin-signin' && <AdminSigninModal /> }

      <Navbar>
        <Container fluid>
          <Navbar.Brand
            onClick={() => {
              navigate("/admin");
            }}
            style={{ cursor: "pointer" }}
          >
            <h1>찰칵 관리자 페이지</h1>
          </Navbar.Brand>
          <div>
            {state.admin.loginState ? (
              <h3>{state.admin.data.account}</h3>
            ) : (
              <h3>로그인이 필요합니다.</h3>
            )}
          </div>
        </Container>
      </Navbar>
      <Navbar className="bg-black">
        <Container fluid>
          <div>
            <Button className="header-link" variant="link" active={location.pathname === '/admin/users'} onClick={() => navigate("/admin/users")}>유저 관리</Button>
            <Button className="header-link" variant="link" active={location.pathname === '/admin/meetups'} onClick={() => navigate("/admin/meetups")}>모임 관리</Button>
            <Button className="header-link" variant="link" active={location.pathname.startsWith('/admin/collections')} onClick={() => navigate("/admin/collections")}>콜렉션 관리</Button>
            <Button className="header-link" variant="link" active={location.pathname === '/admin/faqs'} onClick={() => navigate("/admin/faqs")}>자주찾는질문 관리</Button>
            <Button className="header-link" variant="link" active={location.pathname === '/admin/accounts'} onClick={() => navigate("/admin/accounts")}>관리자 계정관리</Button>
          </div>
          <div class="d-flex gap-2">
            {state.admin.loginState ? (
              <Button variant="dark" onClick={signout}>로그아웃</Button>
              ) : (
              <Button variant="dark" onClick={() => showModal('admin-signin')}>로그인</Button>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function signout() {
    apiAxios
      .post("/admin/auth/signout")
      .then(({ status, data }) => {
        alert("로그아웃 완료");

        dispatch(setAdmin({}));
        dispatch(setAdminLogin(false));
        navigate("/admin");
      })
      .catch((err) => {
        if (err.response) {
          alert("로그인된 상태가 아닙니다.");
        }
        dispatch(setAdmin({}));
        dispatch(setAdminLogin(false));
      });
  }
};

export default AdminHeader;
