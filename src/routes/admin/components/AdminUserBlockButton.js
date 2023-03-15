import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminUserBlockButton = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant={entity.isBlock ? 'primary' : 'danger'} onClick={(e) => {e.stopPropagation(); blockUser(id);}}>
        {entity.isBlock ? '취소' : '블락'}
      </Button>
    </>
  );

  function blockUser(id) {
    apiAxios
      .put(`/admin/users/${id}`, {isBlock: entity.isBlock})
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

export default AdminUserBlockButton;
