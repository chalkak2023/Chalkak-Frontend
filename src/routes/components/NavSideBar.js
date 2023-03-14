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

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <Offcanvas show={state.nav.show} onHide={handleClose} placement='end' style={{ width: '20vw' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="menu" onClick={()=>{navigate('/'); handleClose();}}>
          <h2>찰칵</h2>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p className="menu" onClick={()=>{navigate('/collections'); handleClose();}}>콜렉션</p>
        <p className="menu" onClick={()=>{navigate('/meetups'); handleClose();}}>같이찍어요</p>
        <p className="menu" onClick={()=>{navigate('/sample'); handleClose();}}>샘플페이지</p>
        <p className="menu" onClick={()=>{navigate('/photospot'); handleClose();}}>포토스팟편집</p>
        <p className="menu" onClick={()=>{navigate('/photospot-view'); handleClose();}}>포토스팟보기</p>
        <p className="menu" onClick={()=>{navigate('/service'); handleClose();}}>서비스 이용안내</p>
        {/* 임시로 관리자 페이지 추가. 나중에 삭제 */}
        <p className="menu" onClick={()=>{navigate('/admin'); handleClose();}}>관리자 페이지</p>
        {
          Object.keys(state.user.data).length > 0 ?
          <>
            {state.user.data.email ? <p className="menu" onClick={()=>{dispatch(setModalName('change-password')); dispatch(setShow(true));}}>비밀번호변경</p> : ''}
            <p className="menu" onClick={()=>{signout(); handleClose();}}>로그아웃</p>
          </> : ''

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
