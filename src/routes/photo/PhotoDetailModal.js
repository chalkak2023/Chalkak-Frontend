import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Modal } from 'react-bootstrap';
import './Photo.css' 
import { useNavigate } from "react-router-dom";
import apiAxios from "../../utils/api-axios";
import { setPhoto } from "../../store/photo.slice";

function PhotoDetailModal() {
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let navigate = useNavigate();
  let dispatch = useDispatch();

  return (
    <Modal className='recommendModal' size="lg" show={state.modal.show} onHide={handleClose} centered>
      <div className="showCollection" onClick={()=>{showCollection()}}>콜렉션가기</div>
      <img className='userPhoto' src={state.photo.data.userPhoto.image}></img>

      <h3>추천 사진</h3>
      <div className="recommendBox">
      {state.photo.data.recommedPhotos.length > 0 ? (
        state.photo.data.recommedPhotos.map((photo, i) => (
          <img key={i} src={photo.image} onClick={()=>{detailPhoto(photo)}}></img>
        ))
      ) : (
        <h3>데이터가 없습니다.</h3>
      )}
      </div>
    </Modal>
  );

  function showCollection() {
    dispatch(setShow(false))
    navigate(`/collection/${state.photo.data.userPhoto.photospot.collection.id}/photospot-view`)
  }


  async function detailPhoto(photo) {
    apiAxios
      .get(`/api/photospots/photos/${photo.id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const recommedPhotos = data;
          dispatch(setPhoto({ userPhoto: photo, recommedPhotos }));
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      })
  }
}

export default PhotoDetailModal;