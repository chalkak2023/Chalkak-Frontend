import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Card } from 'react-bootstrap';
import PhotospotCreateModal from './PhotospotCreateModal';
import PhotospotModifyModal from './PhotospotModifyModal';
import {
  setModalName,
  setShow,
  setLat,
  setLng,
  setPhotospot
} from '../../store/photospot.slice';
import './Photospot.css'
import CollectionModifyModal from '../collections/CollectionModifyModal'
import apiAxios from '../../utils/api-axios';

const Photospot = () => {
  const { kakao } = window;
  const [keyword, setKeyword] = useState(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [photospots, setPhotospots] = useState([]);

  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  async function setKakaoMapping() {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    setKakaoMap(map)
    await getPhotospots();

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lng = position.coords.longitude; // 경도

        const locPosition = new kakao.maps.LatLng(lat, lng);
        map.setCenter(locPosition);
      });
    } else {
      const locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      map.setCenter(locPosition);
    }
    // 지도 중심좌표를 접속위치로 변경합니다

    const marker = new kakao.maps.Marker();

    marker.setMap(map);

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
      apiAxios.get(`/api/collections/${state.collection.data.id}/photospots`)
        .then((response) => {
          if (response.status === 200) {
            const photospots = response.data;
            map.setCenter(
              new kakao.maps.LatLng(
                photospots[0].latitude,
                photospots[0].longitude
              )
            );
            setPhotospots(response.data);
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
            })
          }
        })
        .catch((response) => {
          console.log('axios 통신실패');
          console.log(response);
        });
    }
  }

  function searchKeyword(keyword) {
    var ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        kakaoMap.setBounds(bounds);
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

  useEffect(() => {
    setKakaoMapping();
  }, []);

  return (
    <>
      {state.photospot.modalName === 'PhotospotCreateModal' && (<PhotospotCreateModal />)}
      {state.photospot.modalName === 'PhotospotModifyModal' && (<PhotospotModifyModal />)}
      {state.photospot.modalName === 'CollectionModifyModal' && (<CollectionModifyModal />)}
      
      <div id="map" style={{ width: '100%', height: '800px' }}>
        <Form className='keywordSearch'>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>장소를 검색하세요</Form.Label>
            <Form.Control size="sm" type="text" placeholder="Title" onChange={(e) => {setKeyword(e.target.value);}} onKeyDown={(e)=> {
              if (e.code === "Enter") {
                e.preventDefault()
                searchKeyword(keyword)
              }
              }}/>
          </Form.Group>
          <Button variant="primary" onClick={()=>{searchKeyword(keyword)}}>검색</Button>
        </Form>

        <Card className='collectionBox'>
          <Card.Body className='collectionInfo'>
            <Card.Title className='collectionTitle textOverflow'>콜렉션 {state.collection.data.title}</Card.Title>
              <Button variant="light" onClick={() => {collectionModify('CollectionModifyModal')}}>수정</Button>
          </Card.Body>
        </Card>
        <div className='photospotList' style={!photospots.length ? {display: 'none'} : {display: 'block'}}>

        {photospots.map((photospot) => (
            <Card key={photospot.id} className="photospot" onClick={() => {photospotModify('PhotospotModifyModal', photospot.id)}}>
            <div className='photospotBox'>
            <img className='imageSize' src={photospot.photos[0].image} alt=""/>
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

  function clickMarker(modalName, lat, lng) {
    dispatch(setLat(lat));
    dispatch(setLng(lng));
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default Photospot;