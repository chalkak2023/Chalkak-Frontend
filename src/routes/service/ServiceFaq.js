import Accordion from 'react-bootstrap/Accordion';

const ServiceFaq = () => {
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>제목</Accordion.Header>
          <Accordion.Body>
            내용
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>제목</Accordion.Header>
          <Accordion.Body>
            내용
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

export default ServiceFaq;
