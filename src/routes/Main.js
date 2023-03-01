import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/user.slice';

const Main = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  return (
    <>
      <Button variant="primary" onClick={()=>{navigate('/sample')}}>샘플페이지</Button>
      <Button variant="primary" onClick={()=>{navigate('/meetups')}}>모임</Button>
      <Button variant="primary" onClick={()=>{signout()}}>로그아웃</Button>
    </>
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

export default Main;
