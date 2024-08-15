import { useEffect, useState } from "react";
import { Col, Container, Form, OverlayTrigger, Row } from "react-bootstrap";
import { addInSearchList, searchAll } from "./common-filter";
import Popover from 'react-bootstrap/Popover';
import constants from "../../../helpers/constants";
import "./Filter.css"
import Option from "./Option";
import { ThreeDotsVertical } from "react-bootstrap-icons";
export default function Filter(props) {

    let defaultFilter = props.dataType == "text" ? constants.CONTAINS : props.dataType == "checkbox" ? "All" : "Equals"
    const [filterType, setFilterType] = useState(defaultFilter);
    const [searchText, setSearchText] = useState("");
    const [condition, setCondition] = useState("");
    const [filterType2, setFilterType2] = useState(defaultFilter);
    const [searchText2, setSearchText2] = useState("");
    const [clear, setClear] = useState(false);

    function handleSubmit() {

        let obj = props.searchList ? props.searchList : {};
        obj = addInSearchList(obj, searchText, props.columnName, 0)
        obj[props.columnName].filterType = filterType
        obj = addInSearchList(obj, searchText2, props.columnName, 1)
        obj[props.columnName].filterType2 = filterType2
        obj[props.columnName].condition = condition;
        obj[props.columnName].displayName = props.displayName;
        searchAll(props, obj);

    }

    function clearFilter() {
        setClear(true)
        setFilterType(defaultFilter);
        setSearchText("");
        setFilterType2(defaultFilter);
        setSearchText2("");
    }

    useEffect(() => {
        if (clear) {
            handleSubmit();
            setClear(false)
        }
    }, [filterType, searchText, filterType2, searchText2, condition])

    useEffect(() => {
        setSearchText(props.searchList[props.columnName]?.searchedField);
    }, [JSON.stringify(props.searchList[props.columnName]?.searchedField)])

    useEffect(() => {
        if (props.searchList[props.columnName]) {
            setSearchText(props.searchList[props.columnName][0]);
            setSearchText2(props.searchList[props.columnName][1]);
        }
    }, [JSON.stringify(props.searchList[props.columnName])])

    return (
        <OverlayTrigger trigger="click" placement="bottom-start" rootClose overlay={<Popover
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Container className="table-filter-container">
                <Row className="mt-3">
                    <Col>
                        <Form.Group >
                            <Form.Select
                                className="filter-field"
                                name="filterType"
                                required
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    if (props.dataType == "checkbox") {
                                        setSearchText(e.target.value);
                                    }
                                }}
                            > <Option dataType={props.dataType}></Option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                {props.dataType != "checkbox" && <Row className="mt-2">
                    <Col>
                        <Form.Group as={Row} >
                            {filterType == "Range" && <Form.Label column>From</Form.Label>}
                            <Col>
                                <Form.Control
                                    className="filter-field"
                                    type={props.dataType}
                                    value={searchText}
                                    placeholder="Filter..."
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                    }}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>}
                {searchText?.length > 0 && props.dataType != "checkbox" && <> {filterType != "Range" && <> <Row className="mt-3">
                    <Col lg={4} md={4}><Form.Check
                        type="radio"
                        name="condition"
                        className="filter-radio"
                        label="AND"
                        value={"AND"}
                        onChange={(e) => {
                            setCondition(e.target.value);
                        }}
                    ></Form.Check></Col>
                    <Col lg={4} md={4}>
                        <Form.Check
                            type="radio"
                            name="condition"
                            className="filter-radio"
                            label="OR"
                            value={"OR"}
                            onChange={(e) => {
                                setCondition(e.target.value);
                            }}
                        ></Form.Check>
                    </Col>
                </Row>
                    <Row className="mt-2">
                        <Col>
                            <Form.Group >
                                <Form.Select
                                    name="filterType2"
                                    className="filter-field"
                                    required
                                    value={filterType2}
                                    onChange={(e) => {
                                        setFilterType2(e.target.value);
                                    }}
                                ><Option dataType={props.dataType}></Option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row></>}
                    <Row className="mt-2">
                        <Col>
                            <Form.Group as={Row}>
                                {filterType == "Range" && <Form.Label column>To</Form.Label>}
                                <Col>
                                    <Form.Control
                                        className="filter-field"
                                        type={props.dataType}
                                        value={searchText2}
                                        placeholder="Filter..."
                                        onChange={(e) => {
                                            setSearchText2(e.target.value);
                                        }}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </>}
                <Row className="mt-3">
                    <Col className="filter-btn-action">
                        <span type="submit" onClick={clearFilter}>RESET</span>
                        <span className="apply" type="submit" onClick={handleSubmit}>APPLY</span>
                    </Col>
                </Row>
            </Container></Popover>}>
            <ThreeDotsVertical size={12}
                className={`filter-btn ${props.searchList[props.columnName] && ((props.searchList[props.columnName][0] && props.searchList[props.columnName][0] != "") || (props.searchList[props.columnName][1] && props.searchList[props.columnName][1] != "")) ? "active" : ""}`}
            />
        </OverlayTrigger>)
}