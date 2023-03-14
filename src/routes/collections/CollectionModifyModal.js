import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setShow } from '../../store/photospot.slice';
import { setCollection } from '../../store/collection.slice';
import styled from "styled-components";
import apiAxios from '../../utils/api-axios';

const CollectionModifyModal = () => {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const tempKeyword = state.collection.data.collection_keywords.map((keywordObj) => keywordObj.keyword);
  const [keywordTag, setKeywordTag] = useState('')
  const [keyword, setKeyword] = useState(tempKeyword || [])

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal
      size="sm" show={state.photospot.show} onHide={handleClose} centered>
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
                {keyword.map((keywordTag, index) => {
                  return (
                    <KeywordTag key={index}>
                      <KeywordTagText>{keywordTag}</KeywordTagText>
                      <KeywordButton onClick={deleteKeywordTag}>X</KeywordButton>
                    </KeywordTag>
                  )
                })}
                <KeywordInput
                  type='text'
                  placeholder='태그 작성 후 Enter 입력'
                  tabIndex={2}
                  onChange={e => setKeywordTag(e.target.value)}
                  value={keywordTag}
                  onKeyUp={pressEnterHandler} 
                  onKeyDown={pressEnterHandler} 
                />
              </KeywordBox>
            </WholeBox>

          </Form.Group>
          <Button variant="primary" onClick={() => {modifyCollection();}}>수정</Button>
          <Button variant="primary" onClick={() => {deleteCollection();}}>삭제</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  function pressEnterHandler(e) {
    if(e.target.value.length !== 0 && e.key === 'Enter') {
      e.preventDefault()
    submitKeywordTag();
    }
  }

  function submitKeywordTag() {
    let updatedKeyword = [...keyword]
    updatedKeyword.push(keywordTag)
    setKeyword(prev => [...new Set ([...prev, keywordTag])])
    setKeywordTag('')
  }

  function deleteKeywordTag(e) {
    e.preventDefault()
    const deleteKeywordTag = e.target.parentElement.firstChild.innerText
    const filteredKeyword = keyword.filter(keywordTag => keywordTag !== deleteKeywordTag)
    setKeyword(filteredKeyword)
  }


  function modifyCollection() {
    let modifyCollection = {...state.collection.data}
    if (title) { modifyCollection.title = title }
    if (description) { modifyCollection.description = description }
    if (keyword) { modifyCollection.keyword = keyword }
    
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
          collection_keywords: modifyCollection.keyword.map(text=> ({keyword: text, userId: state.collection.data.userId, 
            collectionId: state.collection.data.collectionId}))}
          ))
        window.location.href = `/photospot`;
      })
      .catch(() => {
        navigate(`/photospot`);
      });
  }

  function deleteCollection() {
    apiAxios.delete(`/api/collections/${state.collection.data.id}`)
      .then(() => {
        dispatch(setShow(false));
        window.location.href = '/collections';
      })
      .catch(() => {
        navigate('/photospot');
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

const KeywordButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  background-color: white;
  border-radius: 50%;
  color: grey;
`

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