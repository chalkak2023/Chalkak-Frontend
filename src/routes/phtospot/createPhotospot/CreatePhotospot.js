import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import PhotospotModal from './PhotospotModal';
import {
  setModalName,
  setShow,
  setLat,
  setLng,
} from '../../../store/createPhotospot/photospot.slice';
import './CreatePhotospot.css'

const CreatePhtospot = () => {
  const { kakao } = window;
  let [keyword, setKeyword] = useState(null);
  let [kakaoMap, setKakaoMap] = useState(null);
  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  function setKakaoMapping() {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    setKakaoMap(map)
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

    const marker = new kakao.maps.Marker({
      position: map.getCenter(),
      clickable: true,
    });

    marker.setMap(map);

    kakao.maps.event.addListener(map, 'click', function (e) {
      const latlng = e.latLng;
      console.log(e);
      marker.setPosition(latlng);
    });

    kakao.maps.event.addListener(marker, 'click', function () {
      clickMarker(
        'photospotModal',
        marker.getPosition().getLng(),
        marker.getPosition().getLat()
      );
    });
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

  useEffect(() => {
    setKakaoMapping()
  }, []);

  return (
    <>
      {state.photospotModal.modalName === 'photospotModal' && (<PhotospotModal />)}
      
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

export default CreatePhtospot;
