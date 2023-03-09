import { Button } from "react-bootstrap";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminUserBlockButton = ({ id, order, entity, done }) => {
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
        console.log(err);
        alert("실패");
      });
  }
};

export default AdminUserBlockButton;
