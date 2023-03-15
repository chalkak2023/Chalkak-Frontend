import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import { setModalName, setShow } from "../../store/modal.slice";
import apiAxios from "../../utils/api-axios";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminAccountDeleteButtons from "./components/AdminAccountDeleteButton";
import AdminSearch from "./components/AdminSearch";
import AdminCreateAccountModal from "./modals/AdminCreateAccountModal";

const AdminAccount = () => {
  const { ko: koName, getItemPath, header, width, transform, itemPerPage } =
    adminEnvironments["account"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(1);
  let [lastPage, setLastPage] = useState(1);

  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    goSearch();
  }, [page]);

  return (
    <>
      {state.modal.modalName === "admin-signup" && <AdminCreateAccountModal />}

      <h3>{koName} 관리</h3>
      <AdminSearch
        onClick={goSearch}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AdminTable
        header={header}
        width={width}
        data={data}
        original={original}
        done={done}
        TableButtons={[AdminAccountDeleteButtons]}
      />
      <PaginationButtonList
        current={page}
        total={total}
        lastPage={lastPage}
        changePage={setPage}
      />
      <Button variant="primary" onClick={adminSignup}>
        추가
      </Button>
    </>
  );

  function goSearch() {
    apiAxios
      .get(getItemPath, { params: { search, p: page } })
      .then(({ status, data }) => {
        const { data: items, total, lastPage } = data;
        const mappingData = items.map((item) =>
          transform.map((fn) => fn(item))
        );
        setTotal(total);
        setOriginal(items);
        setLastPage(lastPage);
        setData(mappingData);
      })
      .catch((err) => {
        navigate('/admin')
        alert("실패");
      });
  }

  function done(order) {
    if (!order) {
      goSearch();
    } else {
      setData(data.filter((value, index) => index !== order));
      setOriginal(original.filter((value, index) => index !== order));
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
