import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}} fluid>
        <div style={{translate: '0 -50%'}}>
          <h1>404: 페이지를 찾을 수 없음</h1>
          <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
          <Button variant="primary" style={{width: '100%'}} onClick={() => {navigate('/')}}>메인으로 되돌아가기</Button>
        </div>
      </Container>
    </>
  )
};

export default NotFound;
