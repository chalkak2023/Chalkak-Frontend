import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiAxios from "../../utils/api-axios";
import Accordion from "react-bootstrap/Accordion";

const GuideFaq = () => {
  let state = useSelector((state) => state);
  const [guideFaq, setGuideFaq] = useState([]);

  useEffect(() => {
    getFaqList();
  }, []);

  return (
    <Accordion>
      {guideFaq.map((data) => (
        <Accordion.Item eventKey={data.id} key={data.id}>
          <Accordion.Header>{data.title}</Accordion.Header>
          <Accordion.Body>{data.content}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )

  function getFaqList() {
    apiAxios
      .get('/api/guide/faq')
      .then(({ data }) => {
        setGuideFaq((prev) => [...prev, ...data]);
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      })
  }
};

export default GuideFaq;
