import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiAxios from "../../utils/api-axios";
import Accordion from "react-bootstrap/Accordion";

const ServiceFaq = () => {
  let state = useSelector((state) => state);
  const [serviceFaq, setServiceFaq] = useState([]);

  useEffect(() => {
    getFaqList();
  }, []);

  return (
  <Accordion>
  {serviceFaq.map((data) => (
    <Accordion.Item eventKey={data.id} key={data.id}>
      <Accordion.Header>{data.title}</Accordion.Header>
      <Accordion.Body>{data.content}</Accordion.Body>
    </Accordion.Item>
  ))}
</Accordion>
  )
    
function getFaqList() {
  apiAxios
    .get('/api/service/faq')
    .then(({ data }) => {
      setServiceFaq((prev) => [...prev, ...data]);
    }).catch((e) => {
      console.log('axios 통신실패');
      console.log(e);
    })
  }
};

export default ServiceFaq;
