import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setShow } from '../../store/photospot.slice';
import { setCollection } from '../../store/collection.slice';
import styled from "styled-components";
import apiAxios from '../../utils/api-axios';
import './Collection.css';

const CollectionModifyModal = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const handleClose = () => dispatch(setShow(false));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywordArr, setKeywordArr] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');

  useEffect(() => {
    if (state.collection.data.collectionKeywords) {
      const tempKeywordArr = state.collection.data.collectionKeywords.map((keywordObj) => keywordObj.keyword);
      setKeywordArr(tempKeywordArr);
    }
    setTitle(state.collection.data.title);
    setDescription(state.collection.data.description);
  }, [state.collection.data]);

  return (
    <Modal show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>콜렉션 수정하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control id="title" className='mb-2' type="text" placeholder='제목을 입력해주세요' defaultValue={state.collection.data.title} autoFocus onChange={(e) => { setTitle(e.target.value); }} />
            <Form.Control id="description" className='mb-2' as="textarea" rows={3} placeholder='콜렉션에 대한 간단한 설명을 입력해주세요' defaultValue={state.collection.data.description} onChange={(e) => { setDescription(e.target.value); }} />
            <KeywordTag key={i}>
              <KeywordTagText>{keywordArr_one}</KeywordTagText>
              <div className="keywordBtn" onClick={(e) => { deleteKeywordArr(e) }}>X</div>
            </KeywordTag>
            )
                  })
                }
            <KeywordInput
              type='text'
              placeholder='태그 작성 후 Enter 또는 ,(쉼표) 입력'
              onChange={(e) => { setInputKeyword(e.target.value) }}
              value={inputKeyword}
              onKeyUp={pressEnterHandler}
              style={{ width: '100%' }}
            />
          </KeywordBox>
        </WholeBox>

      </Form.Group>
      <div className='PhotospotBtnGroup'>
        <Button variant="primary" onClick={() => { deleteCollection(); }}>삭제</Button>
        <Button variant="primary" onClick={() => { modifyCollection(); }}>수정</Button>
      </div>
    </Form>
      </Modal.Body >
    </Modal >
  );

function pressEnterHandler(e) {
  if (e.target.value.length !== 0 && ['Enter', ','].includes(e.key)) {
    if (e.target.value.length > 8) {
      alert('키워드는 8자 이하로 입력해주세요.');
      return false;
    } else if (keywordArr.length >= 6) {
      alert('키워드는 6개까지 등록 가능합니다.');
      return false;
    }
    addKeywordArr();
  }
}

function addKeywordArr() {
  if (keywordArr.indexOf(inputKeyword) < 0) {
    setKeywordArr((prev) => [...prev, inputKeyword.replace(',', '')]);
  }
  setInputKeyword('');
}

function deleteKeywordArr(e) {
  const targetKeyword = e.target.parentElement.firstChild.innerText;
  const newKeywordArr = keywordArr.filter((x) => x !== targetKeyword);
  setKeywordArr(newKeywordArr);
}

function modifyCollection() {
  if (!inputValidator()) {
    return;
  }
  if (!window.confirm('수정하시겠습니까?')) {
    return;
  }

  apiAxios.put(`/api/collections/${state.collection.data.id}`, {
    title, description, keyword: keywordArr
  })
    .then(() => {
      dispatch(setShow(false));
      dispatch(setCollection({
        ...state.collection.data,
        title, description, collectionKeywords: keywordArr.map(text => ({
          keyword: text,
          userId: state.collection.data.userId,
          collectionId: state.collection.data.collectionId
        }))
      }
      ))
    })
    .catch(() => {
      alert('콜렉션 수정에 실패하셨습니다.');
      dispatch(setShow(false));
    });
}

function deleteCollection() {
  if (!window.confirm('삭제하시겠습니까?')) {
    return;
  }

  apiAxios.delete(`/api/collections/${state.collection.data.id}`)
    .then(() => {
      dispatch(setShow(false));
      window.location.href = '/collections';
    })
    .catch(() => {
      navigate(`/api/collections/${state.collection.data.id}`);
    });
}

function inputValidator() {
  if (title.length === 0) {
    alert('제목을 입력해주세요.');
    document.querySelector('#title').focus();
    return false;
  } else if (title.length > 20) {
    alert('제목은 20자 이하로 입력해주세요.');
    document.querySelector('#title').focus();
    return false;
  } else if (description.length === 0) {
    alert('내용을 입력해주세요.');
    document.querySelector('#description').focus();
    return false;
  } else if (description.length > 100) {
    alert('내용은 100자 이하로 입력해주세요.');
    document.querySelector('#description').focus();
    return false;
  } else if (keywordArr.length === 0) {
    alert('키워드를 입력해주세요.');
    return false;
  } return true;
}
};

export default CollectionModifyModal;

const WholeBox = styled.div`
  width: 100%;
`

const KeywordBox = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 50px;
  padding: 0 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  &:focus-within {
    border-color: grey;
  }
`

const KeywordTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: grey;
  border-radius: 5px;
  color: white;
  font-size: 15px;
`

const KeywordTagText = styled.span``

const KeywordInput = styled.input`
  display: inline-flex;
  min-width: 150px;
  background: transparent;
  border: none;
  outline: none;
  cursor: text;
`

const ModifyBtn = styled.input`
  align-items: center;
`