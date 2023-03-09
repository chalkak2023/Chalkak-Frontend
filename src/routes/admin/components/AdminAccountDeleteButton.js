import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminAccountDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="primary" onClick={() => deleteAccount(id)}>
        삭제
      </Button>
    </>
  );

  function deleteAccount(id) {
    apiAxios
      .delete(`/admin/auth/${id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          alert("성공");
          done(order);
        }
      })
      .catch((err) => {
        navigate('/admin');
        alert("실패");
      });
  }
};

export default AdminAccountDeleteButtons;
