import { Button, Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  let navigate = useNavigate();

  return (
    <>
      <Navbar>
        <Container fluid>
          <Navbar.Brand onClick={()=>{navigate('/')}}><h1>찰칵</h1></Navbar.Brand>
          <Button variant="outline-dark">로그인</Button>
        </Container>
      </Navbar>
    </>
  )
};

export default Header;
