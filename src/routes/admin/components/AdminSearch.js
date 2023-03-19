import { Button, Form, InputGroup } from "react-bootstrap";

const AdminSearch = ({onClick, onChange}) => {
  return (
    <InputGroup className="mt-3 mb-5" style={{ width: "25rem" }}>
      <Form.Control
        type="text"
        className='searchInputForm' 
        placeholder="키워드를 검색해보세요."
        onChange={onChange}
        onKeyUp={pressEnterHandler}
      />
      <Button className='searchInputFormBtn' variant="outline-dark" onClick={onClick}>
        검색
      </Button>
    </InputGroup>
  );

  function pressEnterHandler(e) {
    if(e.key === 'Enter') {
      onClick();
    }
  }
};

export default AdminSearch;
