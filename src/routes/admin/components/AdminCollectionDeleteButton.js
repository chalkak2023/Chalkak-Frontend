import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminCollectionDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="danger" onClick={() => deleteCollection(id)}>
        삭제
      </Button>
    </>
  );

  function deleteCollection(id) {
    apiAxios
      .delete(`/admin/collections/${id}`)
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

export default AdminCollectionDeleteButtons;
