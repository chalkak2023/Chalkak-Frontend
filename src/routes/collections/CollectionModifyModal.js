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
    const tempKeywordArr = state.collection.data.collection_keywords.map((keywordObj) => keywordObj.keyword);
    setKeywordArr(tempKeywordArr);
  }, []);

  return (
    <Modal show={state.photospot.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>콜렉션 수정하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group className="mb-3">
            <Form.Control className='mb-2' type="text" placeholder='제목' defaultValue={state.collection.data.title} autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
            <Form.Control className='mb-2' as="textarea" rows={2} placeholder='내용' defaultValue={state.collection.data.description} onChange={(e) => { setDescription(e.target.value); }}/>

            <WholeBox>
              <KeywordBox>
                {
                  keywordArr.map((keywordArr_one, i) => {
                    return (
                      <KeywordTag key={i}>
                        <KeywordTagText>{keywordArr_one}</KeywordTagText>
                        <div className="keywordBtn" onClick={(e)=>{deleteKeywordArr(e)}}>X</div>
                      </KeywordTag>
                    )
                  })
                }
                <KeywordInput
                  type='text'
                  placeholder='태그 작성 후 Enter 입력'
                  // tabIndex={2}
                  onChange={(e)=>{setInputKeyword(e.target.value)}}
                  value={inputKeyword}
                  onKeyUp={pressEnterHandler} 
                  style={{ width: '100%' }}
                />
              </KeywordBox>
            </WholeBox>

          </Form.Group>
          <div className='PhotospotBtnGroup'>
          <Button variant="primary" onClick={() => {deleteCollection();}}>삭제</Button>
          <Button variant="primary" onClick={() => {modifyCollection();}}>수정</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function pressEnterHandler(e) {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      if (keywordArr.length >= 5) {
        alert('키워드는 다섯개 까지 등록 가능합니다.');
        return;
      }
      addKeywordArr();
    }
  }

  function addKeywordArr() {
    if (keywordArr.indexOf(inputKeyword) < 0) {
      setKeywordArr((prev) => [...prev, inputKeyword]);
    }
    setInputKeyword('');
  }

  function deleteKeywordArr(e) {
    const targetKeyword = e.target.parentElement.firstChild.innerText;
    const newKeywordArr = keywordArr.filter((x) => x !== targetKeyword );
    setKeywordArr(newKeywordArr);
  }

  function modifyCollection() {
    if(!window.confirm('수정 하시겠습니까?')) {
      return;
    }

    let modifyCollection = {...state.collection.data}
    if (title) { modifyCollection.title = title }
    if (description) { modifyCollection.description = description }
    if (keywordArr) { modifyCollection.keyword = keywordArr }
    
    dispatch(setCollection(modifyCollection))
    apiAxios.put(`/api/collections/${state.collection.data.id}`, {
        title: modifyCollection.title,
        description: modifyCollection.description,
        keyword: modifyCollection.keyword
      })
      .then(() => {
        dispatch(setShow(false));
        dispatch(setCollection({...state.collection.data, 
          title: modifyCollection.title, 
          description: modifyCollection.description, 
          collection_keywords: modifyCollection.keyword.map(text=> ({
            keyword: text, 
            userId: state.collection.data.userId, 
            collectionId: state.collection.data.collectionId}))}
          ))
      })
      .catch(() => {
        alert('콜렉션 수정을 실패 하셨습니다.');
        dispatch(setShow(false));
      });
    } 

  function deleteCollection() {
    if(!window.confirm('삭제 하시겠습니까?')) {
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