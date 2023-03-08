import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationButtonList = (current, total, changePage) => {
  let [leftElipsis, setLeftElipsis] = useState();
  let [rightElipsis, setRightElipsis] = useState();
  let [pages, setPages] = useState();

  useEffect(() => {
    setPages(
      Array.from({ length: 5 }, (_, index) => index + current - 2).filter(
        (page) => page > 1 && page < total
      )
    );
    setLeftElipsis(current - 2 > 2);
    setRightElipsis(current + 3 < total);
  }, [current, total]);

  return (
    <Pagination>
      <Pagination.First onClick={() => changePage(1)}  disabled={current <= 1} />
      <Pagination.Prev onClick={() => changePage(current - 1)}  disabled={current <= 1} />
      <Pagination.Item onClick={() => changePage(1)} active={current === 1}>
        {1}
      </Pagination.Item>
      {leftElipsis ? <Pagination.Ellipsis /> : ""}

      {pages.map((page) => (
        <Pagination.Item onClick={() => changePage(page)} active={current === page}>
          {page}
        </Pagination.Item>
      ))}

      {rightElipsis ? <Pagination.Ellipsis /> : ""}
      <Pagination.Item onClick={() => changePage(total)} active={current === total}>
        {total}
      </Pagination.Item>
      <Pagination.Next onClick={() => changePage(current + 1)} disabled={current >= total} />
      <Pagination.Last onClick={() => changePage(total)} disabled={current >= total} />
    </Pagination>
  );
};

export default PaginationButtonList;
