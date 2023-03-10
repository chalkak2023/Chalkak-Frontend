import { Button, Form, InputGroup } from "react-bootstrap";

const AdminSearch = ({onClick, onChange}) => {
  return (
    <InputGroup className="mb-5" style={{ width: "25rem" }}>
      <Form.Control
        type="text"
        placeholder="키워드를 검색해보세요."
        onChange={onChange}
        onKeyUp={pressEnterHandler}
      />
      <Button variant="outline-dark" onClick={onClick}>
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
