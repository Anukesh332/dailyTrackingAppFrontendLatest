import React, { useContext, useEffect } from "react";
import { usePagination } from "./pagination-hook";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./Pagination.css"
import { Col, Form, Row } from "react-bootstrap";

import UserContext from "../../../helpers/user-context";

export default function Pagination(props) {

  const info = useContext(UserContext);
  const { setCurrentPage, totalCount, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
  });



  let lastPage = paginationRange?.totalPageCount;
  let pageText = `${paginationRange?.startInd}-${paginationRange?.endInd} of ${totalCount} ${props.dataType}`;

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <div className="pagination-container">
      <Col><div className="pagintion-bar-border"></div></Col>
      <Row className="pagintion-bar">
        <Col lg={`${info?.Modal ? 6 : 8}`} md={4}>
          <span className="page-text">{pageText}</span>
        </Col>
        <Col lg={`${info?.Modal ? 6 : 4}`} md={8}>
          <div className="page-right">
            <span>The page you're on</span>
            <Form.Select
              bsPrefix="page-list"
              name="currentPage"
              required
              value={currentPage}
              onChange={(e) => {
                setCurrentPage(Number(e.target.value));
              }}
            > {(() => {
              let rows = [];
              for (let i = 1; i <= lastPage; i++) {
                rows.push(<option key={i} value={i}>{i}</option>);
              }
              return rows;
            })()}
            </Form.Select>
            <span className="bar">|</span>
            <ChevronLeft
              size={18}
              onClick={onPrevious}
              className={currentPage === 1 ? "disabled" : ""}
            /> Pre <span className="bar">|</span> Nxt
            <ChevronRight
              size={18}
              onClick={onNext}
              className={currentPage === lastPage ? "disabled" : ""}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};


