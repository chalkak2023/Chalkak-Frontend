import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../../store/modal.slice";
import adminEnvironments from "../../environments/admin";
import apiAxios from "../../utils/api-axios";
import AdminTable from "./AdminTable";
import AdminSearch from "./components/AdminSearch";
import AdminCreateAccountModal from "./modals/AdminCreateAccountModal";
import AdminAccountDeleteButtons from "./components/AdminAccountDeleteButton";

const AdminAccount = () => {
  const { header, width, transform } = adminEnvironments["account"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [keyword, setkeyword] = useState("");
  let [page, setPage] = useState(1);

  let state = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    goSearch();
  }, [page]);

  return (
    <>
      {state.modal.modalName === "admin-signup" && <AdminCreateAccountModal />}

      <h3>관리자 계정관리</h3>
      <AdminSearch
        onClick={goSearch}
        onChange={(e) => setkeyword(e.target.value)}
      />
      <AdminTable
        header={header}
        width={width}
        data={data}
        original={original}
        done={done}
        TableButtons={[AdminAccountDeleteButtons]}
      />
      <Button variant="primary" onClick={adminSignup}>추가</Button>
    </>
  );

  function goSearch() {
    apiAxios
      .get("/admin/auth", { params: { keyword, p: page } })
      .then(({ status, data }) => {
        const { data: accounts, total, page, lastPage } = data;
        const mappingData = accounts.map((account) =>
          transform.map((fn) => fn(account))
        );
        setOriginal(accounts);
        setData(mappingData);
      })
      .catch((err) => {
        console.log(err);
        alert("실패");
      });
  }

  function done(order) {
    if (!order) {
      goSearch();
    } else {
      setData([...data.filter((value, index) => index !== order)]);
      setOriginal([...original.filter((value, index) => index !== order)]);
      console.log(data.length, original.length);
    }
  }

  function adminSignup() {
    dispatch(setModalName("admin-signup"));
    dispatch(setShow(true));
    setPage(1);
    goSearch();
  }
};

export default AdminAccount;
