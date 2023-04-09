import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNavShow } from '../../store/nav.slice';
import './NavSideBar.css';
import { setLogin, setUser } from '../../store/user.slice';
import apiAxios from "../../utils/api-axios";
import { setModalName, setShow } from "../../store/modal.slice";

const NavSideBar = () => {
  const handleClose = () => dispatch(setNavShow(false));

  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <Offcanvas show={state.nav.show} onHide={handleClose} placement='end' style={{ width: '20vw', minWidth: '200px' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="menu" onClick={() => { navigate('/'); handleClose(); }}>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h4 className="menu mb-3" onClick={() => { navigate('/collections'); handleClose(); }}>콜렉션</h4>
        <h4 className="menu mb-3" onClick={() => { navigate('/meetups'); handleClose(); }}>같이찍어요</h4>
        {
          Object.keys(state.user.data).length > 0 ?
            <>
              <h4 className="menu mb-3" onClick={() => { navigate('/chat'); handleClose(); }}>채팅</h4>
              <h4 className="menu mb-3" onClick={() => { navigate('/photos'); handleClose(); }}>사진 모아보기</h4>
              <h4 className="menu mb-3" onClick={() => { navigate('/guide'); handleClose(); }}>서비스 이용안내</h4>
              {state.user.data.email ? <h4 className="menu mb-3" onClick={() => { dispatch(setModalName('change-password')); dispatch(setShow(true)); }}>비밀번호변경</h4> : ''}
              <h4 className="menu mb-3" onClick={() => { signout(); handleClose(); }}>로그아웃</h4>
            </> :
            <>
              <h4 className="menu mb-3" onClick={() => { navigate('/photos'); handleClose(); }}>사진 모아보기</h4>
              <h4 className="menu mb-3" onClick={() => { navigate('/guide'); handleClose(); }}>서비스 이용안내</h4>
            </>
        }
      </Offcanvas.Body>
    </Offcanvas>
  )

  function signout() {
    apiAxios
      .post("/api/auth/signout")
      .then((response) => {
        alert("로그아웃 완료");
        dispatch(setUser({}));
        dispatch(setLogin(false));
        navigate('/');
      })
      .catch((err) => {
        alert("로그인된 상태가 아닙니다.");
        dispatch(setUser({}));
        dispatch(setLogin(false));
      });

    // TODO: 로그아웃 시 비회원이 볼 수 없는 페이지에 있는 상황에 대한 조치 필요
  };
};

export default NavSideBar;
