import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminUserBlockButton = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="primary" onClick={() => blockUser(id)}>
        블락
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
        navigate('/admin');
        alert("실패");
      });
  }
};

export default AdminUserBlockButton;
