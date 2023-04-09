import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationButtonList = ({ current, changePage, lastPage }) => {
  let [leftEllipsis, setLeftEllipsis] = useState(false);
  let [rightEllipsis, setRightEllipsis] = useState(false);
  let [pages, setPages] = useState([]);

  useEffect(() => {
    const pageList = Array.from(
      { length: 5 },
      (_, index) => index + current - 2
    ).filter((page) => page > 1 && page < lastPage);
    setPages(pageList);

    setLeftEllipsis(current - 2 > 2);
    setRightEllipsis(current + 3 < lastPage);
  }, [current, lastPage]);

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
      {leftEllipsis ? <Pagination.Ellipsis /> : ""}

      {pages?.length ? pages.map((page, index) => (
        <Pagination.Item
          key={page}
          onClick={() => changePage(page)}
          active={current === page}
        >
          {page}
        </Pagination.Item>
      )) : ''}

      {rightEllipsis ? <Pagination.Ellipsis /> : ""}
      {lastPage > 1 ? (
        <Pagination.Item
          onClick={() => changePage(lastPage)}
          active={current === lastPage}
        >
          {lastPage}
        </Pagination.Item>
      ) : (
        ""
      )}

      <Pagination.Next
        onClick={() => changePage(current + 1)}
        disabled={current >= lastPage}
      />
      <Pagination.Last
        onClick={() => changePage(lastPage)}
        disabled={current >= lastPage}
      />
    </Pagination>
  );
};

export default PaginationButtonList;
