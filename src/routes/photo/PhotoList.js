import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import apiAxios from '../../utils/api-axios';
import Loading from '../components/loading/Loading';
import {setShow, setModalName} from '../../store/modal.slice';
import {setPhoto} from '../../store/photo.slice';
import { useDispatch, useSelector } from 'react-redux';
import PhotoDetailModal from './PhotoDetailModal';


const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  let state = useSelector((state)=> state );
  const dispatch = useDispatch();

  const target = useRef(null);
  const page = useRef(1);

  useEffect(() => {
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (loading) return;

      getAllPhoto(page.current);
      page.current += 1;
    });
  });

  return (
    <>
      { loading && <Loading /> }

      { state.modal.modalName === 'photoDetail' && <PhotoDetailModal /> }

      <Container>
        <Row xs={1} md={3} className="g-4 mb-3">
          {
            photos.length > 0 ?
            photos.map((photo, i) => (
              <Col key={i} onClick={()=>{getPhotoDetail(photo.id)}} style={{ cursor: 'pointer' }}>
                <Card border="dark" className='photo'>
                  <img src={photo.image}></img>
                </Card>
              </Col>
            )) :
            <h3>데이터가 없습니다.</h3>
          }
        </Row>
        <div id="scrollEnd" style={{ height: "1px" }} ref={target}></div>
      </Container>
    </>
  )
  function getPhotoDetail(id) {
    const userPhoto = photos.find((photo) => photo.id === id);
    apiAxios
      .get(`/api/photospots/photos/${id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const recommedPhotos = data;
          dispatch(setPhoto({ userPhoto, recommedPhotos }));
          dispatch(setModalName('photoDetail'));
          dispatch(setShow(true));
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getAllPhoto(p) {
    apiAxios
      .get(`/api/photospots/photos?p=${p}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const photos = data;
          if (photos.length === 0) {
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setPhotos((prev) => [...prev, ...photos]);
          }
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }
};

export default PhotoList;