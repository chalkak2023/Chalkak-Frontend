import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import { setModalName, setShow } from "../../store/modal.slice";
import apiAxios from "../../utils/api-axios";
import Loading from "../components/loading/Loading";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminSearch from "./components/AdminSearch";
import AdminCreateFAQModal from "./modals/AdminCreateFAQModal";
import AdminPutFAQModal from "./modals/AdminPutFAQModal";

const AdminFAQ = () => {
  const { ko: koName, getItemPath, header, transform } =
    adminEnvironments["faq"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [prev, setPrev] = useState({});
  let [lastPage, setLastPage] = useState(1);
  let [loading, setLoading] = useState(false);
  let keyword = useRef('');

  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, [page]);

  return (
    <>
      {state.modal.modalName === "admin-create-faq" && <AdminCreateFAQModal changeList={changeList} />}
      {state.modal.modalName === "admin-put-faq" && <AdminPutFAQModal prev={prev} changeList={changeList} />}

      <h3>{koName} 관리</h3>
      <AdminSearch
        onClick={() => {goSearch()}}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading || (
        <>
          <div className="mb-2" style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2>
              # {keyword.current === "" ? "전체" : keyword.current} {total > 0 ? ` (${total})` : ""}
            </h2>
            <Button className="ChalkakBtn" variant="primary" onClick={createFAQ}>자주찾는질문 작성</Button>
          </div>
          <AdminTable header={header} data={data} original={original} changeList={changeList} TableButtons={[]}onClick={clickTable} />
          <PaginationButtonList current={page} total={total} lastPage={lastPage} changePage={setPage} />
        </>
      )}
    </>
  );

  function getList() {
    setLoading(true);
    apiAxios
      .get(getItemPath, { params: { search: keyword.current, p: page } })
      .then(({ status, data }) => {
        const { data: items, total, lastPage } = data;
        const mappingData = items.map((item) =>
          transform.map((fn) => fn(item))
        );
        setTotal(total);
        setOriginal(items);
        setLastPage(lastPage)
        setData(mappingData);
      })
      .catch((err) => {
         if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert("자주 찾는 질문을 가져오지 못했습니다.");
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function goSearch() {
    setPage(1);
    keyword.current = search;
    getList();
  }

  function changeList(id) {
    if (!id) {
      getList();
    } else {
      setData(data.filter((value, index) => index !== id));
      setOriginal(original.filter((value, index) => index !== id));
    }
  }

  function createFAQ() {
    dispatch(setModalName("admin-create-faq"));
    dispatch(setShow(true));
    setPage(1);
    getList();
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
