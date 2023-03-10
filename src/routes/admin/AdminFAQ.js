import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import { setModalName, setShow } from "../../store/modal.slice";
import apiAxios from "../../utils/api-axios";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminSearch from "./components/AdminSearch";
import AdminCreateFAQModal from "./modals/AdminCreateFAQModal";
import AdminPutFAQModal from "./modals/AdminPutFAQModal";

const AdminFAQ = () => {
  const { ko: koName, getItemPath, header, width, transform, itemPerPage } =
    adminEnvironments["faq"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(1);
  let [prev, setPrev] = useState({});

  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    goSearch();
  }, [page]);

  return (
    <>
      {state.modal.modalName === "admin-create-faq" && <AdminCreateFAQModal done={done} />}
      {state.modal.modalName === "admin-put-faq" && <AdminPutFAQModal prev={prev} done={done} />}

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
        TableButtons={[]}
        onClick={clickTable}
      />
      <PaginationButtonList
        current={page}
        total={total}
        itemPerPage={itemPerPage}
        changePage={setPage}
      />
      <Button variant="primary" onClick={createFAQ}>
        추가
      </Button>
    </>
  );

  function goSearch() {
    apiAxios
      .get(getItemPath, { params: { search, p: page } })
      .then(({ status, data }) => {
        const { data: items, total } = data;
        const mappingData = items.map((item) =>
          transform.map((fn) => fn(item))
        );
        setTotal(total);
        setOriginal(items);
        setData(mappingData);
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
        alert("실패");
      });
  }

  function done(id) {
    if (!id) {
      goSearch();
    } else {
      setData(data.filter((value, index) => index !== id));
      setOriginal(original.filter((value, index) => index !== id));
    }
  }

  function createFAQ() {
    dispatch(setModalName("admin-create-faq"));
    dispatch(setShow(true));
    setPage(1);
    goSearch();
  }

  function clickTable(entity) {
    return function (e) {
      setPrev(entity)
      dispatch(setModalName('admin-put-faq'))
      dispatch(setShow(true))
    }
      
  }
};

export default AdminFAQ;
