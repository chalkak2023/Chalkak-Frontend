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
          alert(`해당 유저를 ${entity.isBlock ? '블락 취소' : '블락'}했습니다.`);
          done();
        }
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert(`해당 유저를 ${entity.isBlock ? '블락 취소' : '블락'}하는데 실패했습니다.`);
        }
      });
  }
};

export default AdminUserBlockButton;
