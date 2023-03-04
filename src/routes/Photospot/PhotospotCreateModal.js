import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  setShow,
} from '../../store/photospot.slice';
import axios from 'axios';

const PhotospotCreateModal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState([]);

  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal
      size="sm"
      show={state.photospotSlice.show}
      onHide={handleClose}
      centered
    >
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
            <Form.Label>사진</Form.Label>
            <Form.Control type="file" placeholder="Image" onChange={(e) => {setImageFile(e.target.files);}}/>
          </Form.Group>
          <Button variant="primary" onClick={() => {createPhotospot(title, description, imageFile, state.photospotSlice.lat, state.photospotSlice.lng);}}>
            생성
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function createPhotospot(title, description, imageFile, lat, lng) {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('image', imageFile[0]);

    axios({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'post',
      url: 'http://localhost:8080/api/collections/1/photospots',
      data: formData,
      withCredentials: true,
    })
      .then((response) => {
        dispatch(setShow(false));
        window.location.href = "/photospot";
      })
      .catch((response) => {
        navigate('/photospot');
      });
  }
};

export default PhotospotCreateModal;
