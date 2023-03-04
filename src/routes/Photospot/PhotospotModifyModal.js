import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  setModalName,
  setShow,
} from '../../store/photospot.slice';
import axios from 'axios';

const PhotospotModifyModal = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [title, setTitle] = useState(state.photospotSlice.photospot.title);
  const [description, setDescription] = useState(state.photospotSlice.photospot.description);
  const [imageFile, setImageFile] = useState([]);

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal
      size="sm" show={state.photospotSlice.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>포토스팟 추가하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>제목</Form.Label>
            <Form.Control size="sm" type="text" value={title} placeholder="Title" onChange={(e) => {setTitle(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>간단 설명</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} placeholder="Description" onChange={(e) => {setDescription(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImageFile">
            <Form.Label>사진</Form.Label>
            <Form.Control type="file" placeholder="Image" onChange={(e) => {setImageFile(e.target.files);}}/>
          </Form.Group>
          <Button variant="primary" onClick={() => {modifyPhotospot(title, description, imageFile, state.photospotSlice.photospot.id);}}>
            수정
          </Button>
          <Button variant="primary" onClick={() => {deletePhotospot(state.photospotSlice.photospot.id);}}>
            삭제
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function modifyPhotospot(title, description, imageFile, id) {
    const formData = new FormData();
    console.log(title, description, imageFile, id);
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile.length) {
      formData.append('image', imageFile[0]);
    }

    axios({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'put',
      url: `http://localhost:8080/api/collections/1/photospots/${id}`,
      data: formData,
      withCredentials: true,
    })
      .then(() => {
        dispatch(setShow(false));
        window.location.href = '/photospot';
      })
      .catch(() => {
        navigate('/photospot');
      });
  }

  function deletePhotospot(id) {
    axios({
      method: 'delete',
      url: `http://localhost:8080/api/collections/1/photospots/${id}`,
      withCredentials: true,
    })
      .then(() => {
        dispatch(setShow(false));
        window.location.href = '/photospot';
      })
      .catch(() => {
        navigate('/photospot');
      });
  }
};

export default PhotospotModifyModal;
