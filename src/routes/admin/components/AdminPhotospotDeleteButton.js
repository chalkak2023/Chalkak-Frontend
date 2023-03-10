import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminPhotospotDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="primary" onClick={() => deletePhotospot(entity.collectionId, id)}>
        삭제
      </Button>
    </>
  );

  function deletePhotospot(collectionId, id) {
    apiAxios
      .delete(`/admin/${collectionId}/photospots/${id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          alert("성공");
          done();
        }
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
        alert("실패");
      });
  }
};

export default AdminPhotospotDeleteButtons;
