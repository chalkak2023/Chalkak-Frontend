import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationButtonList = ({ current, total, changePage, lastPage }) => {
  let [leftElipsis, setLeftElipsis] = useState(false);
  let [rightElipsis, setRightElipsis] = useState(false);
  let [pages, setPages] = useState([]);

  useEffect(() => {
    const pageList = Array.from(
      { length: 5 },
      (_, index) => index + current - 2
    ).filter((page) => page > 1 && page < lastPage);
    setPages(pageList);

    setLeftElipsis(current - 2 > 2);
    setRightElipsis(current + 3 < lastPage);
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
      {leftElipsis ? <Pagination.Ellipsis /> : ""}

      {pages?.length ? pages.map((page, index) => (
        <Pagination.Item
          key={page}
          onClick={() => changePage(page)}
          active={current === page}
        >
          {page}
        </Pagination.Item>
      )) : ''}

      {rightElipsis ? <Pagination.Ellipsis /> : ""}
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
