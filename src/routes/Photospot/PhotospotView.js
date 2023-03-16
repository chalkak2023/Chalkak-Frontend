import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PhotospotDetailModal from './PhotospotDetailModal';
import {
  setModalName,
  setShow,
  setPhotospot,
} from '../../store/photospot.slice';
import { setCollection } from '../../store/collection.slice';
import './Photospot.css'
import apiAxios from '../../utils/api-axios';

const Photospot = () => {
  const { collectionId } = useParams()
  const { kakao } = window;
  const [kakaoMap, setKakaoMap] = useState(null);
  const [photospots, setPhotospots] = useState([]);

  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  async function setKakaoMapping() {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
      level: 3,
    };
    let map = new kakao.maps.Map(container, options);
    setKakaoMap(map)
    await getPhotospots();

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);

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

  function photospotDetail(modalName, id) {
    const result = photospots.find((photospot) => photospot.id === id);
    kakaoMap.setCenter(
      new kakao.maps.LatLng(result.latitude, result.longitude)
    );
    dispatch(setPhotospot(result));
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function myLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lng = position.coords.longitude; // 경도

        const locPosition = new kakao.maps.LatLng(lat, lng);
        kakaoMap.setCenter(locPosition);
      }, function (err) {
        alert("위치 엑세스가 거부되었습니다.");
      });
    }
  }


  useEffect(() => {
    setKakaoMapping();
  }, []);

  return (
    <>
      {state.photospot.modalName === 'PhotospotDetailModal' && (<PhotospotDetailModal />)}
      
      <div id="map" style={{ width: '100%', height: '800px' }}>
        <div className='myLocation' onClick={()=>{myLocation()}}>나의 위치</div>

        <Card className='collectionBox'>
          <Card.Body className='collectionInfo'>
            <Card.Title className='collectionTitle textOverflow'>{state.collection.data.title}</Card.Title>
          </Card.Body>
        </Card>
        <div className='photospotList' style={!photospots.length ? {display: 'none'} : {display: 'block'}}>
        {photospots.map((photospot) => (
            <Card key={photospot.id} className="photospot" onClick={() => {photospotDetail('PhotospotDetailModal', photospot.id)}}>
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
};

export default Photospot;