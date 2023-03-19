import { useEffect, useState } from "react";
import { Row, Col, Card, Container, Stack, Button, Badge } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiAxios from '../../utils/api-axios';

const MainCollections = () => {
  let state = useSelector((state) => state);
  let navigate = useNavigate();

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <>
      <Container style={{ marginBottom: '100px'}}>
        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2>최근 생성된 콜렉션</h2>
          <Button className="ms-auto ChalkakBtn" variant="outline-dark" onClick={() => {navigate('/collections');}}>보러가기</Button>
        </Stack>
        <Row xs={1} md={3} className="g-4 mb-3">
          {
            collections.length > 0 ?
            collections.map((collection, i) => (
              <Col key={i} onClick={() => { photospot(collection.id) }} style={{ cursor: "pointer" }}>
                <Card border="dark">
                    <Card.Header>{collection.title}</Card.Header>
                    <Card.Body style={{ height: "10rem" }}>
                    <Card.Title>{collection.description}</Card.Title>
                    <Card.Text className="TagList">{collection.collection_keywords.map((obj, index) => index < 5 ? (<Badge bg="secondary" className="tagKeyword">{obj.keyword}</Badge>) : '')}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )) :
            <h3>데이터가 없습니다.</h3>
          }
        </Row>
      </Container>
    </>
  )

  function photospot(id) {
    const result = collections.find((collection) => collection.id === id);
    navigate(
      result.userId === state.user.data.id ? 
      `/collection/${result.id}/photospot` : `/collection/${result.id}/photospot-view`
    );
  }

  function getCollections() {
    apiAxios
      .get(`/api/collections?p=1`)
      .then(({ status, data }) => {
        if (status === 200) {
          let tempArr = [];
          if (data.length < 6) {
            for (let i = 0; i < data.length; i++ ) {
              tempArr.push(data[i]);
            }
          } else {
            for (let i = 0; i < 6; i++ ) {
              tempArr.push(data[i]);
            }
          }
          setCollections(tempArr);
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
};

export default MainCollections;
