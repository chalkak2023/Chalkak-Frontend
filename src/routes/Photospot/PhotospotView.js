import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PhotospotDetailModal from './PhotospotDetailModal';
import apiAxios from '../../utils/api-axios';
import Loading from '../components/loading/Loading';
import { setModalName, setShow, setPhotospot } from '../../store/photospot.slice';
import { setCollection } from '../../store/collection.slice';
import { setIsFooterOn } from '../../store/footer.slice';
import './Photospot.css'
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

const Photospot = () => {
  const { collectionId } = useParams()
  const { kakao } = window;
  const [kakaoMap, setKakaoMap] = useState(null);
  const [photospots, setPhotospots] = useState([]);
  const [loading, setLoading] = useState(false);

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
    alert('PC의 경우 위치가 부정확할 수 있습니다.');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lng = position.coords.longitude; // 경도

        const locPosition = new kakao.maps.LatLng(lat, lng);
        kakaoMap.setCenter(locPosition);
        setLoading(false);
      }, function (err) {
        alert("위치 엑세스가 거부되었습니다.");
        setLoading(false);
      });
    }
  }


  useEffect(() => {
    setKakaoMapping();
    dispatch(setIsFooterOn(false));
    return () => dispatch(setIsFooterOn(true));
  }, []);

  return (
    <>
      { loading && <Loading /> }
      
      {state.photospot.modalName === 'PhotospotDetailModal' && (<PhotospotDetailModal />)}
      
      <div id="map" style={{ width: '100%', height: '90vh' }}>
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

  function addCollectionLike() {
    if (Object.keys(state.user.data).length === 0) {
      return alert('로그인 후 가능합니다.');
    }
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
};

export default Photospot;