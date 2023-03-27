import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Card, InputGroup, ToastContainer, Toast } from 'react-bootstrap';
import PhotospotCreateModal from './PhotospotCreateModal';
import PhotospotModifyModal from './PhotospotModifyModal';
import CollectionModifyModal from '../collections/CollectionModifyModal'
import apiAxios from '../../utils/api-axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/loading/Loading';
import { setModalName, setShow, setLat, setLng, setPhotospot } from '../../store/photospot.slice';
import { setCollection } from '../../store/collection.slice';
import { setIsFooterOn } from '../../store/footer.slice';
import { setPhotospotTipShow } from "../../store/photospotTip.slice";
import './Photospot.css'
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

const Photospot = () => {
  const { collectionId } = useParams()
  const { kakao } = window;
  const [keyword, setKeyword] = useState(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [photospots, setPhotospots] = useState([]);
  const [loading, setLoading] = useState(false);

  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const toggleShowTip = () => dispatch(setPhotospotTipShow(false));

  async function setKakaoMapping() {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    setKakaoMap(map)
    await getPhotospots();

    const marker = new kakao.maps.Marker();
    marker.setMap(map);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);


    kakao.maps.event.addListener(map, 'click', function (e) {
      const latlng = e.latLng;
      marker.setPosition(latlng);
    });

    kakao.maps.event.addListener(marker, 'click', function () {
      clickMarker(
        'PhotospotCreateModal',
        marker.getPosition().getLat(),
        marker.getPosition().getLng()
      );
    });

    async function getPhotospots() {
      apiAxios
        .get(`/api/collections/${collectionId}`)
        .then((response) => {
          if (response.status === 200) {
            const photospots = response.data.photospots;
            if (photospots.length > 0) {
              map.setCenter(
                new kakao.maps.LatLng(
                  photospots[0].latitude,
                  photospots[0].longitude
                )
              );

              setPhotospots(photospots);
              photospots.forEach((element) => {
                const tempHtml = `<div class="customoverlay"><span class="title">${element.title}</span></div>`;
                const position = new kakao.maps.LatLng(
                  element.latitude,
                  element.longitude
                );
                new kakao.maps.Marker({
                  map: map, // 마커를 표시할 지도
                  position: position, // 마커를 표시할 위치
                });

                let CustomOverlay = new kakao.maps.CustomOverlay({
                  map: map, // 인포윈도우가 표시될 지도
                  position: position,
                  content: tempHtml,
                  yAnchor: 1,
                });

                CustomOverlay.setMap(map);
              });
            }
            dispatch(setCollection(response.data));
          }
        })
        .catch((response) => {
          alert('해당 콜렉션을 찾을 수 없습니다.');
          navigate('/collections');
        });
    }
  }

  function searchKeyword(keyword) {
    var ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {

        kakaoMap.setCenter(
          new kakao.maps.LatLng(data[0].y, data[0].x)
        );

      //   var bounds = new kakao.maps.LatLngBounds();
        

      //   for (var i = 0; i < data.length; i++) {
      //     bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      //   }
      //   kakaoMap.setBounds(bounds);
      }
    }
  }

  function photospotModify(modalName, id) {
    const result = photospots.find((photospot) => photospot.id === id);
    kakaoMap.setCenter(
      new kakao.maps.LatLng(result.latitude, result.longitude)
    );
    dispatch(setPhotospot(result));
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function collectionModify(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function myLocation() {
    alert('PC의 경우 위치가 부정확할 수 있습니다.');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude; // 위도
          const lng = position.coords.longitude; // 경도

          const locPosition = new kakao.maps.LatLng(lat, lng);
          kakaoMap.setCenter(locPosition);
          setLoading(false);
        },
        function (err) {
          alert('위치 엑세스가 거부되었습니다.');
          setLoading(false);
        }
      );
    }
  }

  useEffect(() => {
    setKakaoMapping();
    dispatch(setIsFooterOn(false));
    return () => dispatch(setIsFooterOn(true));
  }, []);

  return (
    <>
      <ToastContainer className="p-3" position="middle-center">
        <Toast show={state.photospotTip.show} onClose={toggleShowTip}>
          <Toast.Header>
            <strong className="me-auto">사용 팁!</strong>
          </Toast.Header>
          <Toast.Body>지도를 클릭하여 마커 생성 후 <br/>마커를 클릭해서 포토스팟을 만들 수 있습니다.</Toast.Body>
        </Toast>
      </ToastContainer>

      { loading && <Loading /> }

      {state.photospot.modalName === 'PhotospotCreateModal' && (<PhotospotCreateModal />)}
      {state.photospot.modalName === 'PhotospotModifyModal' && (<PhotospotModifyModal />)}
      {state.photospot.modalName === 'CollectionModifyModal' && (<CollectionModifyModal />)}
      
        <div id="map" style={{ width: '100%', height: '90vh' }}>
        <Form className='keywordSearch'>
        <InputGroup className="mb-5" style={{ width: '17rem' }}>
          <Form.Control type='text' className='searchInputForm-2' placeholder='장소를 검색하세요.' onChange={(e) => {setKeyword(e.target.value);}} onKeyDown={(e)=> {
            if (e.code === "Enter") {
              e.preventDefault()
              searchKeyword(keyword)
            }
            }}/>
          <Button className="searchInputFormBtn-2" onClick={()=>{searchKeyword(keyword)}}>검색</Button>
        </InputGroup>
        </Form>
        <div className='myLocation' onClick={()=>{myLocation()}}>나의 위치</div>

        <Card className='collectionBox' style={{ boxShadow: 'none' }}>
          <Card.Body className='collectionInfo'>
            <div>
              {
                !_.isNil(state.collection.data.collectionLikes.find((cl) => cl.userId === state.user.data.id)) ?
                <FaHeart onClick={removeCollectionLike} size={18} style={{ cursor: 'pointer', color: '#fc4850', marginRight: 10 }}/> :
                <FiHeart onClick={addCollectionLike} size={18} style={{ cursor: 'pointer', marginRight: 10 }}/>
              }
              <b>{state.collection.data.collectionLikes.length}</b>
            </div>
            <Card.Title className='collectionTitle textOverflow'>{state.collection.data.title}</Card.Title>
              <Button variant="light" style={{backgroundColor: '#7e7e7e', color: 'white'}} onClick={() => {collectionModify('CollectionModifyModal')}}>수정</Button>
          </Card.Body>
        </Card>
        <div className='photospotList' style={!photospots.length ? {display: 'none'} : {display: 'block'}}>

        {photospots.map((photospot) => (
            <Card key={photospot.id} className="photospot" onClick={() => {photospotModify('PhotospotModifyModal', photospot.id)}}>
            <div className='photospotBox'>
            <div className='thumbBox'>
            <img className='imageSize' src={photospot.photos[0].image} alt=""/>
            </div>
            <Card.Body>
              <Card.Title className='textOverflow'>{photospot.title}</Card.Title>
              <Card.Text className='textOverflow'>
                {photospot.description}
              </Card.Text>
            </Card.Body>
            </div>
          </Card>
          ))}
        </div>
      </div>
    </>
  );

  function addCollectionLike() {
    apiAxios
      .post(`/api/collections/${collectionId}/like`)
      .then(({ status }) => {
        if (status === 201) {
          getPhotospots();
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }

  function removeCollectionLike() {
    apiAxios
      .delete(`/api/collections/${collectionId}/like`)
      .then(({ status }) => {
        if (status === 200) {
          getPhotospots();
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  async function getPhotospots() {
    apiAxios
      .get(`/api/collections/${collectionId}`)
      .then(({ status, data }) => {
        if (status === 200) {
          dispatch(setCollection(data));
        }
      })
      .catch((err) => {
        alert('해당 콜렉션을 찾을 수 없습니다.');
        navigate('/collections');
      });
  }

  function clickMarker(modalName, lat, lng) {
    dispatch(setLat(lat));
    dispatch(setLng(lng));
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default Photospot;