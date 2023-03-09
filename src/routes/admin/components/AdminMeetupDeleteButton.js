import { Button } from "react-bootstrap";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminMeetupDeleteButtons = ({ id, order, entity, done }) => {
  return (
    <>
      <Button variant="primary" onClick={() => deleteMeetup(id)}>
        삭제
      </Button>
    </>
  );

  function deleteMeetup(id) {
    apiAxios
      .delete(`/admin/meetups/${id}`)
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

export default AdminMeetupDeleteButtons;
