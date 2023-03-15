import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import apiAxios from "../../utils/api-axios";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminCollectionDeleteButtons from "./components/AdminCollectionDeleteButton";
import AdminPhotospotDeleteButtons from "./components/AdminPhotospotDeleteButton";
import AdminSearch from "./components/AdminSearch";

const AdminPhotospot = () => {
  const {
    ko: koName,
    getItemPath,
    header,
    width,
    transform,
    itemPerPage,
  } = adminEnvironments["photospot"];
  const { collectionId } = useParams()

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [search, setSearch] = useState("");
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(1);

  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    goSearch();
  }, [page]);

  return (
    <>
      <h3>{koName} 관리 (콜렉션 ID: {collectionId})</h3>
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
        TableButtons={[AdminPhotospotDeleteButtons]}
      />
    </>
  );

  function goSearch() {
    apiAxios
      .get(getItemPath(collectionId), { params: { search, p: page } })
      .then(({ status, data: items }) => {
        const mappingData = items.map((item) =>
          transform.map((fn) => fn(item))
        );
        setTotal(total);
        setOriginal(items);
        setData(mappingData);
      })
      .catch((err) => {
        console.log(err.response.status)
        if (err.response.status === 401) {
          navigate('/admin');
        }
       if (err.response) {
          alert("포토스팟들을 가져오지 못 했습니다.");
        }
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
};

export default AdminPhotospot;
