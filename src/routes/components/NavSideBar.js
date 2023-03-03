import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNavShow } from '../../store/nav.slice';
import './NavSideBar.css';
import { setUser } from '../../store/user.slice';

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
        <p className="menu" onClick={()=>{navigate('/'); handleClose();}}>마이콜렉션</p>
        <p className="menu" onClick={()=>{navigate('/meetups'); handleClose();}}>같이찍어요</p>
        <p className="menu" onClick={()=>{navigate('/'); handleClose();}}>자주하는질문</p>
        <p className="menu" onClick={()=>{navigate('/'); handleClose();}}>개인정보처리방침</p>
        <p className="menu" onClick={()=>{navigate('/'); handleClose();}}>이용약관</p>
        <p className="menu" onClick={()=>{navigate('/sample'); handleClose();}}>샘플페이지</p>
        {
          Object.keys(state.user.data).length > 0 ?
          <>
            <p className="menu" onClick={()=>{navigate('/'); handleClose();}}>비밀번호변경</p>
            <p className="menu" onClick={()=>{signout(); handleClose();}}>로그아웃</p>
          </> : ''

        }
      </Offcanvas.Body>
    </Offcanvas>
  )

  function signout() {
    // TODO: 백엔드 서버에 signout API를 통해 캐시(or Redis)에 저장된
    // refreshToken 지우는 작업 필요. 
    // 위 요청 성공 시 아래 함수들 실행하게 변경 필요.
    alert("로그아웃 완료");
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    dispatch(setUser({}));
    // TODO: 로그아웃 시 비회원이 볼 수 없는 페이지에 있는 상황에 대한 조치 필요
  };
  
  function deleteCookie(key) {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
};

export default NavSideBar;