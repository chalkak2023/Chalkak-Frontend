import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiAxios from "../../../utils/api-axios";


const AdminAccountDeleteButtons = ({ id, order, entity, changeList }) => {
  const navigate = useNavigate();
  let state = useSelector((state) => state);

  return (
    <>
      {entity.account !== "master" && state.admin.data.account === "master" ? (
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
          navigate('/admin/accounts');
        }
       if (err.response) {
          alert("해당 권한이 없습니다.");
        }
      });
  }
};

export default AdminAccountDeleteButtons;
