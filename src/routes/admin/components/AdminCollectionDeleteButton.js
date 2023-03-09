import { Button } from "react-bootstrap";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminCollectionDeleteButtons = ({ id, order, entity, done }) => {
  return (
    <>
      <Button variant="primary" onClick={() => deleteCollection(id)}>
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
        console.log(err);
        alert("실패");
      });
  }
};

export default AdminCollectionDeleteButtons;
