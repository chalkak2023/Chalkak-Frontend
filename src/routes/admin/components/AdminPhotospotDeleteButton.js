import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminPhotospotDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="danger" onClick={(e) => {e.stopPropagation(); deletePhotospot(entity.collectionId, id);}}>
        삭제
      </Button>
    </>
  );

  function deletePhotospot(collectionId, id) {
    apiAxios
      .delete(`/admin/${collectionId}/photospots/${id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          alert("해당 포토스팟을 삭제했습니다.");
          done();
        }
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert("해당 포토스팟을 삭제하는데 실패했습니다.");
        }
      });
  }
};

export default AdminPhotospotDeleteButtons;
