import axios from "axios";
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin, setAdminLogin } from '../../store/admin.slice';
import { setModalName, setShow } from "../../store/modal.slice";
import AdminSigninModal from "../admin/modals/AdminSigninModal";

const AdminHeader = () => {
  let state = useSelector((state) => state);
  let navigate = useNavigate();
  let dispatch = useDispatch();

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
      <Navbar>
        <Container fluid>
          <div>
            <Button variant="link" onClick={() => navigate('/admin/users')}>유저 관리</Button>
            <Button variant="link" onClick={() => navigate('/admin/collections')}>콜렉션 관리</Button>
            <Button variant="link" onClick={() => navigate('/admin/meetups')}>모임 관리</Button>
            <Button variant="link" onClick={() => navigate('/admin/faqs')}>자주찾는질문 관리</Button>
            <Button variant="link" onClick={() => navigate('/admin/accounts')}>관리자 계정관리</Button>
          </div>
          <div>
            {state.admin.loginState ? (
              <Button vairant="outline-dark" onClick={signout}>로그아웃</Button>
              ) : (
              <Button vairant="outline-dark" onClick={() => showModal('admin-signin')}>로그인</Button>
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
    axios
      .post("http://localhost:8080/admin/auth/signout", null, {
        withCredentials: true,
      })
      .then(({ status, data }) => {
        alert("로그아웃 완료");
        // TODO: 쿠키를 클라이언트에서 없애려면 여기서 해야함
        dispatch(setAdmin({}));
        dispatch(setAdminLogin(false));
        navigate("/");
      })
      .catch((err) => {
        alert("로그인된 상태가 아닙니다.");
        dispatch(setAdmin({}));
      });
  }
};

export default AdminHeader;
