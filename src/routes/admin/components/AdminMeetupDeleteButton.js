import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../../utils/api-axios";
// import { showModal } from "../../../store/modal.slice";

const AdminMeetupDeleteButtons = ({ id, order, entity, done }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="danger" onClick={(e) => {e.stopPropagation(); deleteMeetup(id);}}>
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
         if (err.response.status === 401) {
          navigate('/admin');
        }
        alert("실패");
      });
  }
};

export default AdminMeetupDeleteButtons;
