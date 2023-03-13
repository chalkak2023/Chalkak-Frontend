// import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { Button, Carousel, Modal } from 'react-bootstrap';
import {
  setShow,
} from '../../store/photospot.slice';

function PhotospotDetailModal() {
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  return (
    <Modal size="lg" show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{state.photospot.data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detailBox">
        <Carousel>
        {state.photospot.data.photos.map((photo) => (
            <Carousel.Item key={photo.id}>
              <img
                className="d-block w-100"
                src={photo.image}
              />
            </Carousel.Item>
          ))}
        </Carousel>
          <p className="description">{state.photospot.data.description}</p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PhotospotDetailModal;