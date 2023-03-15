import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import { setModalName, setShow } from "../../store/modal.slice";
import apiAxios from "../../utils/api-axios";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminCollectionDeleteButtons from "./components/AdminCollectionDeleteButton";
import AdminSearch from "./components/AdminSearch";

const AdminCollection = () => {
  const {
    ko: koName,
    getItemPath,
    header,
    width,
    transform,
    itemPerPage,
  } = adminEnvironments["collection"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(1);
  let [lastPage, setLastPage] = useState(1);
  let keyword = useRef('');

  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, [page]);
 
  return (
    <>
      <h3>{koName} 관리</h3>
      <AdminSearch
        onClick={() => {goSearch()}}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2># {keyword.current === '' ? '전체' : keyword.current}</h2>
      <AdminTable
        header={header}
        width={width}
        data={data}
        original={original}
        changeList={changeList}
        TableButtons={[AdminCollectionDeleteButtons]}
        onClick={clickTable}
      />
      <PaginationButtonList
        current={page}
        total={total}
        lastPage={lastPage}
        changePage={setPage}
      />
    </>
  );

  function getList() {
    apiAxios
      .get(getItemPath, { params: { search, p: page } })
      .then(({ status, data }) => {
        keyword.current = search;
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
        console.log(err.response.status)
        if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert("콜렉션들을 가져오지 못했습니다.");
        }
      });
  }

  function goSearch() {
    setPage(1);
    getList();
  }

  function changeList(order) {
    if (!order) {
      getList();
    } else {
      setData(data.filter((value, index) => index !== order));
      setOriginal(original.filter((value, index) => index !== order));
    }
  }
  
  function clickTable(entity) {
    return function (e) {
      navigate(`/admin/collections/${entity.id}/photospots`)
    }
  }
};

export default AdminCollection;
