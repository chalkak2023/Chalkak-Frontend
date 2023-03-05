import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setShow } from '../../store/photospot.slice';
import axios from 'axios';

const PhotospotModifyModal = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState([]);

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal
      size="sm" show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>포토스팟 수정하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>제목</Form.Label>
            <Form.Control size="sm" type="text" defaultValue={state.photospot.data.title} placeholder="Title" onChange={(e) => {setTitle(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>간단 설명</Form.Label>
            <Form.Control as="textarea" rows={3} defaultValue={state.photospot.data.description} placeholder="Description" onChange={(e) => {setDescription(e.target.value);}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImageFile">
            <Form.Label>사진</Form.Label>
            <Form.Control type="file" placeholder="Image" onChange={(e) => {setImageFile(e.target.files);}}/>
          </Form.Group>
          <Button variant="primary" onClick={(e) => {modifyPhotospot();}}>
            수정
          </Button>
          <Button variant="primary" onClick={() => {deletePhotospot();}}>
            삭제
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function modifyPhotospot() {
    let modifyTitle = state.photospot.data.title;
    let modifyDesc = state.photospot.data.description;

    if (title) {
      modifyTitle = title;
    }

    if (description) {
      modifyDesc = description;
    }
    const formData = new FormData();

    formData.append('title', modifyTitle);
    formData.append('description', modifyDesc);
    if (imageFile.length) {
      formData.append('image', imageFile[0]);
    }

    axios({
      method: 'put',
      url: `http://localhost:8080/api/collections/1/photospots/${state.photospot.data.id}`,
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

  function deletePhotospot() {
    axios({
      method: 'delete',
      url: `http://localhost:8080/api/collections/1/photospots/${state.photospot.data.id}`,
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
