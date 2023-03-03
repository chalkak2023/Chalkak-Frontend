// import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from 'react-bootstrap';
import {
  setShow,
} from '../../store/photospot.slice';

function PhotospotDetailModal() {
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  return (
    <Modal size="lg" show={state.photospotSlice.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{state.photospotSlice.photospot.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detailBox">
          <img src={state.photospotSlice.photospot.imagePath}></img>
          <p className="description">{state.photospotSlice.photospot.description}</p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PhotospotDetailModal;