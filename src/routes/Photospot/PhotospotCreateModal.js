import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  setShow,
} from '../../store/photospot.slice';
import apiAxios from '../../utils/api-axios';

const PhotospotCreateModal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [isPhotospotEmpty, setIsPhotospotEmpty] = useState(true)
  const [isPhotoCount, setIsPhotoCount] = useState(true)

  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>포토스팟 추가하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>제목</Form.Label>
            <Form.Control size="sm" type="text" placeholder="Title" onChange={(e) => {setTitle(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>간단 설명</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Description" onChange={(e) => {setDescription(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImageFile">
            <Form.Label>사진 <span style={{color: 'lightgray', fontSize: '12px'}}>- 최대 5장을 첨부할 수 있습니다.</span> </Form.Label>
            <Form.Control type="file" placeholder="Image" onChange={(e) => {setImageFiles(e.target.files);}} accept="image/png, image/jpeg, image/jpg" multiple/>
          </Form.Group>
          <div className="photospotEmpty" style={isPhotospotEmpty ? {display: 'none'} : {display: 'block'}}>제목, 설명, 사진을 모두 입력하셔야 합니다.</div>
          <div className="photoCount" style={isPhotoCount ? {display: 'none'} : {display: 'block'}}>사진은 5장만 업로드 할 수 있습니다.</div>
          <div className='PhotospotBtnGroup'>
          <Button variant="primary" onClick={(e) => {createPhotospot(e);}}>
            생성
          </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function createPhotospot(e) {
    e.preventDefault();
    if (!title || !description || !imageFiles.length) {
      setIsPhotospotEmpty(false)
      return;
    }

    if (imageFiles.length > 5) {
      setIsPhotoCount(false)
      return
    }

    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', state.photospot.lat);
    formData.append('longitude', state.photospot.lng);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('files', imageFiles[i])
    }
  
    apiAxios.post(`/api/collections/${state.collection.data.id}/photospots`, formData)
      .then((response) => {
        dispatch(setShow(false));
        window.location.href = `/collection/${state.collection.data.id}/photospot`;
      })
      .catch((response) => {
        dispatch(setShow(false));
      });
  }
};

export default PhotospotCreateModal;
