import { useEffect, useRef, useState } from "react";
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack, ToggleButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../../store/modal.slice";
import { setCollection } from "../../store/collection.slice";
import Loading from "../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import CollectionsCreateModal from "./CollectionsCreateModal";
import apiAxios from "../../utils/api-axios";

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
        <div><h2 onClick={() => { window.location.reload() }} style={{ cursor: "pointer" }}>?????????</h2>
          <InputGroup className="mb-5" style={{ width: "25rem" }}>
            <Form.Control type="text" placeholder="???????????? ??????????????????." onChange={(e) => { setInputSearch(e.target.value) }} onKeyDown={pressEnterHandler}/>
            <Button variant="outline-dark" onClick={goSearch}>??????</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2># {search.current === "" ? "??????" : search.current}</h2>
          {Object.keys(state.user.data).length > 0 ? 
          <>
              <ToggleButton className="ms-auto" id="toggle-check" type="checkbox" variant="outline-dark" 
                checked={checkedMine} onChange={(e) => setCheckedMine(e.currentTarget.checked)}>?????? ?????????</ToggleButton>
              <Button variant="outline-dark" onClick={() => { showModal("create") }}>????????? ??????</Button>
            </> : ""
          }
        </Stack>

        <Row xs={1} md={3} className="g-3 mb-3">
          {
            collections.length > 0 ?
            collections.map((collection, i) => (
            <Col key={i} onClick={() => { photospot(collection.id) }} style={{ cursor: "pointer" }}>
              <Card border="dark">
                  <Card.Header>{collection.title}</Card.Header>
                  <Card.Body style={{ height: "8rem" }}>
                  <Card.Title>{collection.description}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )) :
          <h3>???????????? ????????????.</h3>
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
    let signinedUserId = state.user.data.id
    let collectionListURI;
    let allCollectionListURI = `/api/collections`
    let searchCollectionURI = `/api/collections?p=${p}&search=${search.current}`
    let myCollectionURI = `/api/collections?p=${p}&userId=${signinedUserId}`
    let searchMyCollectionURI = `/api/collections?p=${p}&search=${search.current}&userId=${signinedUserId}`

    if (!search && !checkedMine) { collectionListURI = allCollectionListURI }
    else if (search && !checkedMine) { collectionListURI = searchCollectionURI } 
    else if (!search && checkedMine) { collectionListURI = myCollectionURI } 
    else { collectionListURI = searchMyCollectionURI }

    return collectionListURI;
  }

  async function resetCollections() {
    let arr = [];
    for (let i = 1; i < page.current; i++) {
      const searchData = await apiAxios.get(
        makeCollectionURI(i, search, checkedMine)
      );
      const searchResult = searchData.data.data;
      arr = [...arr, ...searchResult];
    }
    setCollections(arr);
  }

  function photospot(id) {
    const result = collections.find((collection) => collection.id === id);
    dispatch(setCollection(result));
    navigate(
      result.userId === state.user.data.id ? "/photospot" : "/photospot-view"
    );
  }
  
    function getCollections(p, search) {
    setLoading(true);
    console.log(`page: ${p}, search: ${search}`);
    apiAxios
      .get(makeCollectionURI(p, search, checkedMine))
      .then(({ status, data }) => {
        if (status === 200) {
          const newCollections = data.data;
          if (newCollections.length === 0) {
            console.log('??? ????????? ???????????? ????????????.');
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setCollections((prev) => [...prev, ...newCollections]);
          }
        }
      }).catch((e) => {
        console.log('axios ????????????');
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
