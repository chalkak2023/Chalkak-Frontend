import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import styled from "styled-components";
import apiAxios from '../../utils/api-axios';
import './Collection.css';

function CollectionsCreateModal(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywordArr, setKeywordArr] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');

  let state = useSelector((state)=> state);
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal show={state.modal.show} dialogClassName="modal-90w" onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>콜렉션 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control className='mb-2' type="text" placeholder='제목' autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
            <Form.Control className='mb-2' as="textarea" rows={2} placeholder='내용' onChange={(e) => { setDescription(e.target.value); }}/>
            <div style={{ width: '100%' }}>
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
            </div>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={()=>{ createCollection(); }} style={{ width: '100%' }}>등록하기</Button>
      </Modal.Body>
    </Modal>
  )

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

  function createCollection() {
    apiAxios
      .post("/api/collections", { title, description, keywords: keywordArr })
      .then((response) => {
        const statusCode = response.status;
        if (statusCode === 201) {
          handleClose();
          navigate(`/collection/${response.data.id}/photospot`);
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        console.log(e);
      });
  }
}

export default CollectionsCreateModal;

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