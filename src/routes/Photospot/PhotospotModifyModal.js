import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setShow, setPhotospot } from '../../store/photospot.slice';
import apiAxios from '../../utils/api-axios';

const PhotospotModifyModal = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [isPhotoCount, setIsPhotoCount] = useState(true);
  const [isPhoto, setIsPhoto] = useState(true);
  const [index, setIndex] = useState(0);
  const [deletePhotos, setDeletePhotos] = useState([]);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  const handleClose = () => {
    dispatch(setShow(false))
    setIsPhoto(true);
    setIsPhotoCount(true);
    setDeletePhotos([]);
  };

  return (
    <Modal size="lg" show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>포토스팟 수정하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {state.photospot.data.photos.map((photo) => (
            <Carousel.Item key={photo.id} className='photoItem'>
              <div className='deletePhoto' onClick={() => {deletePhoto(photo.id);}}>❌</div>
              <div className='imgBox'>
              <img className="d-block w-100" src={photo.image} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>제목</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              defaultValue={state.photospot.data.title}
              placeholder="Title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>간단 설명</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={state.photospot.data.description}
              placeholder="Description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImageFile">
            <Form.Label>사진 <span style={{color: 'lightgray', fontSize: '12px'}}>- 최대 {Math.abs(5 - state.photospot.data.photos.length)}장을 첨부할 수 있습니다.</span></Form.Label>
            <Form.Control
              type="file"
              placeholder="Image"
              onChange={(e) => {
                setImageFiles(e.target.files);
              }}
              accept="image/png, image/jpeg, image/jpg" multiple/>
          </Form.Group>
          <div
            className="photoCount"
            style={isPhotoCount ? { display: 'none' } : { display: 'block' }}
          >
            사진은 {Math.abs(5 - state.photospot.data.photos.length)}장만 업로드 할 수
            있습니다.
          </div>
          <div
            className="photoCount"
            style={isPhoto ? { display: 'none' } : { display: 'block' }}
          >
            1장 이상의 사진은 있어야합니다.
          </div>
          <div className='PhotospotBtnGroup'>
          <Button
            variant="primary"
            onClick={() => {
              deletePhotospot();
            }}
          >
            삭제
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modifyPhotospot();
            }}
          >
            수정
          </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function deletePhoto(id) {
    if (state.photospot.data.photos.length === 1) {
      setIsPhoto(false);
      return
    }

    const photoItems = document.getElementsByClassName('photoItem');
    setDeletePhotos((prev) => [...prev, id]);

    const photospot = { ...state.photospot.data };
    photospot.photos = photospot.photos.filter((photo) => photo.id !== id);
    dispatch(setPhotospot(photospot));
    if (index === photoItems.length - 1) {
      setIndex(0);
    }

  }

  function modifyPhotospot() {
    

    let modifyTitle = state.photospot.data.title;
    let modifyDesc = state.photospot.data.description;
    const inputImageCount = imageFiles.length;
    if (title.length > 12) {
      alert('제목은 12글자 이하로 입력해주세요.');
      return;
    }

    if (description.length > 200) {
      alert('내용은 200글자 이하로 입력해주세요.');
      return
    }

    if(!window.confirm('수정 하시겠습니까?')) {
      return;
    }

    if (title) {
      modifyTitle = title;
    }

    if (description) {
      modifyDesc = description;
    }

    if (Math.abs(state.photospot.data.photos.length + inputImageCount) > 5) {
      setIsPhotoCount(false);
      return;
    }
    const formData = new FormData();
    
    formData.append('title', modifyTitle);
    formData.append('description', modifyDesc);
    for (let i = 0; i < deletePhotos.length; i++) {
      formData.append('deletePhotos[]', deletePhotos[i])
    }
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('files', imageFiles[i])
    }

    apiAxios
      .put(
        `/api/collections/${state.collection.data.id}/photospots/${state.photospot.data.id}`,
        formData
      )
      .then(() => {
        dispatch(setShow(false));
        setDeletePhotos([]);
        window.location.href = `/collection/${state.collection.data.id}/photospot`;
      })
      .catch(() => {
        navigate(`/collection/${state.collection.data.id}/photospot`);
      });
  }

  function deletePhotospot() {
    if(!window.confirm('삭제 하시겠습니까?')) {
      return;
    }

    apiAxios
      .delete(
        `/api/collections/${state.collection.data.id}/photospots/${state.photospot.data.id}`
      )
      .then(() => {
        dispatch(setShow(false));
        window.location.href = `/collection/${state.collection.data.id}/photospot`;
      })
      .catch(() => {
        navigate(`/collection/${state.collection.data.id}/photospot`);
      });
  }
};

export default PhotospotModifyModal;
