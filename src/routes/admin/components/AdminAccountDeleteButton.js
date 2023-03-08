import { Button } from "react-bootstrap";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminAccountDeleteButtons = ({ id, order, entity, done }) => {
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
        console.log(err);
        alert("실패");
      });
  }
};

export default AdminAccountDeleteButtons;
