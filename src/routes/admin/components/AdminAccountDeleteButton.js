import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminAccountDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      {entity.account !== "master" ? (
        <Button variant="danger" onClick={(e) => {e.stopPropagation(); deleteAccount(id)}}>
          삭제
        </Button>
      ) : (
        ""
      )}
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
         if (err.response.status === 401) {
          navigate('/admin');
        }
        alert("실패");
      });
  }
};

export default AdminAccountDeleteButtons;
