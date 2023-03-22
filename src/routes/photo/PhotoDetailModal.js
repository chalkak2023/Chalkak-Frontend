import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Modal } from 'react-bootstrap';
import { useEffect } from "react";
import './Photo.css' 

function PhotoDetailModal() {
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  return (
    <Modal className='recommendModal' size="lg" show={state.modal.show} onHide={handleClose} centered>
      <img className='userPhoto' src={state.photo.data.userPhoto.image}></img>

      <h3>추천 사진</h3>
      <div className="recommendBox">
      {state.photo.data.recommedPhotos.length > 0 ? (
        state.photo.data.recommedPhotos.map((photo, i) => (
          <img key={i} src={photo.image}></img>
        ))
      ) : (
        <h3>데이터가 없습니다.</h3>
      )}
      </div>
    </Modal>
  );
}

export default PhotoDetailModal;