import { Button, Container, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let state = useSelector((state) => state);
  let navigate = useNavigate();

  return (
    <>
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
              <Button vairant="outline-dark">로그아웃</Button>
              ) : (
              <Button vairant="outline-dark">로그인</Button>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
