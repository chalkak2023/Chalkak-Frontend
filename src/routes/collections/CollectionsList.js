import { useEffect, useRef, useState } from "react";
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack, ToggleButton, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../../store/modal.slice";
import Loading from "../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import CollectionsCreateModal from "./CollectionsCreateModal";
import apiAxios from "../../utils/api-axios";
import './Collection.css';

const CollectionsList = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [checkedMine, setCheckedMine] = useState(false);
  const [tempCollections, setTempCollections] = useState([]);
  const target = useRef(null);
  const page = useRef(1);
  const search = useRef("");

  useEffect(() => {
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (checkedMine) {
      const myCollections = collections.filter((collection) => {
        return collection.userId === state.user.data.id;
      });
      setTempCollections(collections);
      setCollections(myCollections);
      document.querySelector('#scrollEnd').hidden = true;
    } else if (!checkedMine) {
      setCollections(tempCollections);
      setTimeout(() => {
        document.querySelector('#scrollEnd').hidden = false;
      }, 500);
    }
  }, [checkedMine])

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (loading) return;
      getCollections(page.current, search.current);
      page.current += 1;
    });
  });

  return (
    <>
      {loading && <Loading />}
      {state.modal.modalName === "create" && <CollectionsCreateModal />}

      <Container>
        <div className="d-flex align-items-center flex-column ChalkakSearch"><h2 className="ChalkakH2" onClick={() => { window.location.reload() }} style={{ cursor: "pointer" }}>콜렉션</h2>
          <InputGroup className="mb-5" style={{ width: "25rem" }}>
            <Form.Control type="text" className="searchInputForm" placeholder="키워드를 검색해보세요." onChange={(e) => { setInputSearch(e.target.value) }} onKeyDown={pressEnterHandler}/>
            <Button className="searchInputFormBtn" variant="outline-dark" onClick={goSearch}>검색</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2># {search.current === "" ? "전체" : search.current}</h2>
          {Object.keys(state.user.data).length > 0 ? 
          <>
              <ToggleButton className={checkedMine ? 'ms-auto ActiveChalkakBtn' : 'ms-auto ChalkakBtn'} id="toggle-check" type="checkbox" variant="outline-dark"
                checked={checkedMine} onChange={(e) => setCheckedMine(e.currentTarget.checked)}>마이 콜렉션</ToggleButton>
              <Button className="ChalkakBtn" variant="outline-dark" onClick={() => { showModal("create") }}>콜렉션 등록</Button>
            </> : ""
          }
        </Stack>

        <Row xs={1} md={3} className="g-4 mb-3">
          {
            collections.length > 0 ?
            collections.map((collection, i) => (
            <Col key={i} onClick={() => { photospot(collection.id) }} style={{ cursor: "pointer" }}>
              <Card border="dark">
                  <Card.Header className="collectionTitle"><b>{collection.title}</b></Card.Header>
                  <Card.Body style={{ height: "10rem" }}>
                  <Card.Title className='collectionDescription'>{collection.description}</Card.Title>
                  <Card.Text className="tagList">
                    { 
                      collection.collection_keywords.map((obj, i) => 
                        i < 6 ? 
                        <Badge bg="secondary" className="tagKeyword" key={i}>{ obj.keyword }</Badge> : 
                        ''
                      )
                    }
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )) :
          <h3>데이터가 없습니다.</h3>
         } 
        </Row>
        <div id="scrollEnd" style={{ height: "1px" }} ref={target}></div>
      </Container>
    </>
  );

  function pressEnterHandler(e) {
    if (e.key === "Enter") { 
      goSearch() 
    }
  }

    async function goSearch() {
    search.current = inputSearch;
    page.current = 2;
    document.querySelector("#scrollEnd").hidden = false;
    resetCollections();
  }

  function makeCollectionURI(p, search, checkedMine) {
    const signinedUserId = state.user.data.id;
    const collectionListURI = `/api/collections?p=${p}&`;

    if (search && checkedMine) { 
      return collectionListURI + `search=${search.current}&userId=${signinedUserId}`;
    } else if (!search && checkedMine) { 
      return collectionListURI + `userId=${signinedUserId}`;
    } else if (search && !checkedMine) { 
      return collectionListURI + `search=${search.current}`;
    } else { 
      return collectionListURI;
    }
  }

  async function resetCollections() {
    let arr = [];
    for (let i = 1; i < page.current; i++) {
      const searchData = await apiAxios.get(
        makeCollectionURI(i, search, checkedMine)
      );
      const searchResult = searchData.data;
      arr = [...arr, ...searchResult];
    }
    setCollections(arr);
  }

  function photospot(id) {
    const result = collections.find((collection) => collection.id === id);
    navigate(
      result.userId === state.user.data.id ? 
      `/collection/${result.id}/photospot` : `/collection/${result.id}/photospot-view`
    );
  }
  
    function getCollections(p, search) {
    setLoading(true);
    console.log(`page: ${p}, search: ${search}`);
    apiAxios
      .get(makeCollectionURI(p, search, checkedMine))
      .then(({ status, data }) => {
        if (status === 200) {
          if (data.length === 0) {
            console.log('더 불러올 데이터가 없습니다.');
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setCollections((prev) => [...prev, ...data]);
          }
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      }).finally(() => {
        setLoading(false);
      })
    }

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default CollectionsList;
