import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminEnvironments from "../../environments/admin";
import apiAxios from "../../utils/api-axios";
import PaginationButtonList from "../components/PaginationButtonList";
import AdminTable from "./AdminTable";
import AdminMeetupDeleteButtons from "./components/AdminMeetupDeleteButton";
import AdminSearch from "./components/AdminSearch";

const AdminMeetup = () => {
  const { ko: koName, getItemPath, header, width, transform, itemPerPage } =
    adminEnvironments["meetup"];

  let [data, setData] = useState([]);
  let [original, setOriginal] = useState([]);
  let [keyword, setkeyword] = useState("");
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
      <h3>{koName} 관리</h3>
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
        TableButtons={[AdminMeetupDeleteButtons]}
      />
      <PaginationButtonList
        current={page}
        total={total}
        itemPerPage={itemPerPage}
        changePage={setPage}
      />
    </>
  );

  function goSearch() {
    apiAxios
      .get(getItemPath, { params: { keyword, p: page } })
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

  function done(order) {
    if (!order) {
      goSearch();
    } else {
      setData(data.filter((value, index) => index !== order));
      setOriginal(original.filter((value, index) => index !== order));
    }
  }
};

export default AdminMeetup;
