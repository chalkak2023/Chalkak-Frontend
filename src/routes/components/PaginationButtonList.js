import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationButtonList = ({ current, total, changePage, itemPerPage }) => {
  let [leftElipsis, setLeftElipsis] = useState(false);
  let [rightElipsis, setRightElipsis] = useState(false);
  let [pages, setPages] = useState([]);
  let [end, setEnd] = useState(1);

  useEffect(() => {
    setEnd(Math.floor(total / itemPerPage) + 1);
  }, [total])

  useEffect(() => {
    const pageList = Array.from(
      { length: 5 },
      (_, index) => index + current - 2
    ).filter((page) => page > 1 && page < end);
    setPages(pageList);

    setLeftElipsis(current - 2 > 2);
    setRightElipsis(current + 3 < end);
  }, [current, end]);

  return (
    <Pagination>
      <Pagination.First onClick={() => changePage(1)} disabled={current <= 1} />
      <Pagination.Prev
        onClick={() => changePage(current - 1)}
        disabled={current <= 1}
      />
      <Pagination.Item onClick={() => changePage(1)} active={current === 1}>
        1
      </Pagination.Item>
      {leftElipsis ? <Pagination.Ellipsis /> : ""}

      {pages.map((page, index) => (
        <Pagination.Item
          onClick={() => changePage(page)}
          active={current === page}
        >
          {page}
        </Pagination.Item>
      ))}

      {rightElipsis ? <Pagination.Ellipsis /> : ""}
      {end > 1 ? (
        <Pagination.Item
          onClick={() => changePage(end)}
          active={current === end}
        >
          {end}
        </Pagination.Item>
      ) : (
        ""
      )}

      <Pagination.Next
        onClick={() => changePage(current + 1)}
        disabled={current >= end}
      />
      <Pagination.Last
        onClick={() => changePage(end)}
        disabled={current >= end}
      />
    </Pagination>
  );
};

export default PaginationButtonList;
