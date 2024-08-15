import { useMemo } from "react";

export const usePagination = ({ totalCount, pageSize, currentPage }) => {
  const paginationRange = useMemo(() => {
    let startInd = 1;
    if(totalCount==0){
      startInd = 0;
    }
    let endInd = 0;
    const totalPageCount = Math.ceil(totalCount / pageSize);
    if (totalCount <= pageSize) {
      endInd = totalCount;
      return { startInd, endInd, totalPageCount };
    }

    if (currentPage >= 1) {
      startInd = (currentPage - 1) * pageSize + 1;
      if (totalCount <= currentPage * pageSize) {
        endInd = totalCount;
      } else {
        endInd = currentPage * pageSize;
      }
      return { startInd, endInd, totalPageCount };
    }
  }, [totalCount, pageSize, currentPage]);

  return paginationRange;
};
