import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SampleModal from './Modal';
import { setModalName, setShow } from '../../store/modal.slice';
import { useNavigate } from 'react-router-dom';

const SampleList = () => {
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <>
      { state.modal.modalName === 'sample' && <SampleModal /> }

      <Button variant="primary" onClick={()=>{navigate('/')}}>메인</Button>
      <Button variant="primary" onClick={()=>{showModal('sample')}}>모달띄우기</Button>
    </>
  )

  function showModal(modalName){
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
};

export default SampleList;
