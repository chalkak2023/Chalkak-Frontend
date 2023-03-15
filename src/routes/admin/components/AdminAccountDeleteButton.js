import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminAccountDeleteButtons = ({ id, order, entity, changeList }) => {
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
          alert("해당 관리자 계정을 삭제했습니다.");
          changeList(order);
        }
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert("해당 관리자 계정을 삭제하는데 실패했습니다.");
        }
      });
  }
};

export default AdminAccountDeleteButtons;
