import { useEffect, useRef, useState } from 'react';
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack, ToggleButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import MeetupsCreateModal from './MeetupsCreateModal';
import MeetupsDetailModal from './MeetupsDetailModal';
import { setModalName, setShow } from '../../store/modal.slice';
import { setMeetup } from '../../store/meetup.slice';
import Loading from '../components/loading/Loading';
import apiAxios from '../../utils/api-axios';

const MeetupsList = () => {
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputKeyword, setInputKeyword] = useState('');
  const [checkedMine, setCheckedMine] = useState(false);
  const [tempMeetups, setTempMeetups] = useState([]);

  const target = useRef(null);
  const page = useRef(1);
  const keyword = useRef('');

  useEffect(() => {
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (checkedMine) {
      const myMeetups = meetups.filter((meetup) => {
        return meetup.userId === state.user.data.id;
      });
      setTempMeetups(meetups);
      setMeetups(myMeetups);
      document.querySelector('#scrollEnd').hidden = true;
    } else if (!checkedMine) {
      setMeetups(tempMeetups);
      setTimeout(() => {
        document.querySelector('#scrollEnd').hidden = false;
      }, 500);
    }
  }, [checkedMine])

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (loading) return;

      getMeetups(page.current, keyword.current);
      page.current += 1;
    });
  });

  return (
    <>
      { loading && <Loading /> }

      { state.modal.modalName === 'create' && <MeetupsCreateModal /> }
      { state.modal.modalName === 'detail' && 
        <MeetupsDetailModal 
          getMeetupDetail={getMeetupDetail} 
          resetMeetups={resetMeetups}
        /> 
      }
      <Container>
        <div>
          <h2 onClick={()=>{window.location.reload()}} style={{ cursor: 'pointer' }}>?????? ?????????</h2>
          <InputGroup className="mb-5" style={{ width: '25rem' }}>
            <Form.Control type='text' placeholder='???????????? ??????????????????.' onChange={(e)=>{setInputKeyword(e.target.value)}} onKeyUp={pressEnterHandler}/>
            <Button variant="outline-dark" onClick={goSearch}>??????</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2># {keyword.current === '' ? '??????' : keyword.current}</h2>
          {
            Object.keys(state.user.data).length > 0 ?
            <>
              <ToggleButton className="ms-auto" id="toggle-check" type="checkbox" variant="outline-dark" checked={checkedMine} onChange={(e) => setCheckedMine(e.currentTarget.checked)}>?????? ??????</ToggleButton>
              <Button variant="outline-dark" onClick={()=>{showModal('create')}}>?????? ??????</Button>
            </> : ''
          }
        </Stack>

        <Row xs={1} md={3} className="g-3 mb-3">
          {
            meetups.length > 0 ?
            meetups.map((meetup, i) => (
              <Col key={i} onClick={()=>{getMeetupDetail(meetup.id)}} style={{ cursor: 'pointer' }}>
                <Card border="dark">
                  <Card.Header>{meetup.title} ({meetup.joins.length}/{meetup.headcount})</Card.Header>
                  <Card.Body style={{ height: '8rem' }}>
                  <Card.Text>?????????: {meetup.user.username}</Card.Text>
                    <Card.Title>{meetup.content}</Card.Title>
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
  )

  function pressEnterHandler(e) {
    if(e.key === 'Enter') {
      goSearch();
    }
  }

  async function goSearch() {
    setCheckedMine(false);
    keyword.current = inputKeyword;
    page.current = 2;
    document.querySelector('#scrollEnd').hidden = false;
    resetMeetups();
  }

  async function resetMeetups() {
    let arr = [];
    for (let i = 1; i < page.current; i++) {
      console.log(`page: ${i}, keyword: ${keyword.current}`);
      const { data } = await apiAxios.get(`/api/meetups?p=${i}&keyword=${keyword.current}`);
      arr = [...arr, ...data];
    }
    setMeetups(arr);
  }

  function getMeetups(p, k) {
    setLoading(true);
    console.log(`page: ${p}, keyword: ${k}`);
    apiAxios
      .get(`/api/meetups?p=${p}&keyword=${keyword.current}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const newMeetups = data;
          if (newMeetups.length === 0) {
            console.log('??? ????????? ???????????? ????????????.');
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setMeetups((prev) => [...prev, ...newMeetups]);
          }
        }
      }).catch((e) => {
        console.log('axios ????????????');
        console.log(e);
      }).finally(() => {
        setLoading(false);
      })
  }

  function getMeetupDetail(meetupId) {
    apiAxios
      .get(`/api/meetups/${meetupId}`)
      .then((response) => {
        if (response.status === 200) {
          const meetup = response.data;
          dispatch(setMeetup(meetup));
          dispatch(setModalName('detail'));
          dispatch(setShow(true));
        }
      })
      .catch((e) => {
        console.log('axios ????????????');
        console.log(e);
      });
  }

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
}

export default MeetupsList;