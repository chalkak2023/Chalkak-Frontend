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
        <Modal.Title style={{fontWeight: 'bold' }}>{state.photospot.data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detailBox">
        <Carousel>
        {state.photospot.data.photos.map((photo) => (
            <Carousel.Item key={photo.id} className='photoItem'>
              <div className='imgBox'>
              <img className="d-block w-100" src={photo.image} />
            </div>
          </Carousel.Item>
          ))}
        </Carousel>
        <div className='photospotDesc'>
          <div style={{marginTop: '25px', paddingBottom: '5px', borderBottom: '1px solid #b7b7b7', color: '#b7b7b7'}}>간단 설명</div>
          <p className="description">{state.photospot.data.description}</p>
        </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PhotospotDetailModal;