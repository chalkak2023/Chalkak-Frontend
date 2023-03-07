import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setModalName, setShow } from '../../store/modal.slice';
import { setCollection } from '../../store/collection.slice';
import Loading from '../components/loading/Loading';

const CollectionsList = () => {
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputKeyword, setInputKeyword] = useState('');
  const target = useRef(null);
  const page = useRef(1);
  const keyword = useRef('');

  useEffect(() => {
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (loading) return;
      getCollections(page.current);
      page.current += 1;
    });
  });
 
  return (
    <>
      { loading && <Loading /> }

      <Container>
        <div>
          <h2 onClick={()=>{window.location.reload()}} style={{ cursor: 'pointer' }}>콜렉션</h2>
          <InputGroup className="mb-5" style={{ width: '25rem' }}>
            <Form.Control type='text' placeholder='키워드를 검색해보세요.' onChange={(e)=>{setInputKeyword(e.target.value)}} onKeyUp={pressEnterHandler}/>
            <Button variant="outline-dark" onClick={goSearch}>검색</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2># {keyword.current === '' ? '전체' : keyword.current}</h2>
          {
            Object.keys(state.user.data).length > 0 ?
            <>
              <Button className="ms-auto" variant="outline-dark">마이 콜렉션</Button>
            </> : ''
          }
        </Stack>

        <Row xs={1} md={3} className="g-3 mb-3">
          {collections.map((collection, i) => (
            <Col key={i} onClick={()=>{getCollectionDetail(collection.id)}} style={{ cursor: 'pointer' }}>
              <Card border="dark">
              <Card.Body style={{ height: '8rem' }}>
                <Card.Header>{collection.title}</Card.Header>
                  <Card.Title>{collection.description}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div id="scrollEnd" style={{ height: "1px" }} ref={target}></div>
        </Container>
    </>
  )
  
  function pressEnterHandler(e) {
    if(e.key === 'Enter') {
      goSearch();
    }
  }

  async function goSearch() {
    keyword.current = inputKeyword;
    page.current = 2;
    document.querySelector('#scrollEnd').hidden = false;
    resetCollections();
  }

  async function resetCollections() {
    let arr = [];
    for (let i = 1; i < page.current; i++) {
      console.log(`page: ${i}, keyword: ${keyword.current}`);

      const searchData = await axios.get(`http://localhost:8080/api/collections?p=${i}&keyword=${keyword.current}`);
      const searchResult = searchData.data.data
      arr = [...arr, ...searchResult];
    }
    setCollections(arr);
  }

  function getCollections(p, k) {
    setLoading(true);
    console.log(`page: ${p}, keyword: ${k}`);
    axios
      .get(`http://localhost:8080/api/collections?p=${p}&keyword=${keyword.current}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const newCollections = data.data;
          if (newCollections.length === 0) {
            console.log('더 불러올 데이터가 없습니다.');
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setCollections((prev) => [...prev, ...newCollections]);
          }
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      }).finally(() => {
        setLoading(false);
      })
  }

  function getCollectionDetail(collectionId) {
    axios
      .get(`http://localhost:8080/api/collections/${collectionId}`)
      .then((response) => {
        if (response.status === 200) {
          const collection = response.data;
          dispatch(setCollection(collection));
          dispatch(setModalName('detail'));
          dispatch(setShow(true));
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
}

export default CollectionsList;