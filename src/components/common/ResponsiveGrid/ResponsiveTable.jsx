import './responsive-table.css';
import './responsive-table-layout.css';
import './ResizableTable.css';

import { Table, OverlayTrigger, Tooltip, Card, Form, Row, Col, Container, Image, Button } from "react-bootstrap";
import Search from './Search';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Sort from './Sort';
import Pagination from './Pagination';
import Filter from './Filter';
import GlobalSearch from './GlobalSearch';
import ExcelDownload from './ExcelDownload';
import ColumnGrid from './ColumnSelector'
import xFilter from "../../../assets/images/x-filter.svg"
import { searchAll } from './common-filter';
import reloadIcon from "../../../assets/images/reload.png"
import deleteIcon from "../../../assets/images/trash-can.svg"

import UserContext from "../../../helpers/user-context";
import Upload from './Upload';
import { resizableColumn } from './ResizableTable';
import { ADMINS } from '../../../helpers/constants';

export default function ResponsiveTable(props) {
    const info = useContext(UserContext);
    const tabObj = useContext(UserContext);
    const [data, setData] = useState([]);
    const pageSize = props.pageSize ? props.pageSize : tabObj?.tab ? 8 : info?.Report ? 6 : 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchList, setSearchList] = useState({});
    const [showDownButn, setShowDownButn] = useState(true);
    const [sortList, setSortList] = useState({});
    const [gridHeader, setGridHeader] = useState(props.headers);
    const [selectedData, setSelectedData] = useState(props.selectedData ? props.selectedData : []);
    const [selectAll, setSelectAll] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [view, setView] = useState();
    const [writeAccess, setWriteAccess] = useState(false);
    const [activeColumn, setActiveColumn] = useState(0);
    useEffect(() => {
        //  ============================================= Here you have to provide write access conditions ==================================
        // let role = sessionStorage.getItem("role");
        // if (ADMINS.includes(role)) {
            setWriteAccess(true);
        // }
    }, [])

    useEffect(() => {
        if (props.data) {
            let propsTemp = { setData: setData, data: props.data, header: gridHeader };
            searchAll(propsTemp, searchList)
        }
        setSortList({})
        setSelectAll(false)
        setCurrentPage(1);
    }, [props.data])

    useEffect(() => {
        setSearchList({})
    }, [props.dataType])

    useEffect(() => {
        if (props.selectedData) {
            setSelectedData(props.selectedData)
        }
    }, [props.selectedData])

    useEffect(() => {
        setGridHeader(props.headers)
        let count = 0
        for (let header of props.headers) {
            if (header.displayIndication == true) {
                count = count + 1
            }
        }
        setActiveColumn(count)
    }, [props.headers])

    useEffect(() => {
        resizableColumn(props.dataType + "_table");
    }, [gridHeader])

    useEffect(() => {
        if (props.icons) {
            for (let icon of props.icons) {
                if (icon.iconName === "View") {
                    setView(icon)
                    break;
                }
            }
        }
    }, [props.icons])

    const filteredResult = useMemo(() => {
        let firstPageIndex = 0;
        if (currentPage > 1) {
            firstPageIndex = (currentPage - 1) * pageSize;
        }
        if (firstPageIndex >= data?.length) {
            firstPageIndex = 0;
            const totalPageCount = Math.ceil(data?.length / pageSize);
            if (totalPageCount > 0) {
                setCurrentPage(totalPageCount)
            } else {
                setCurrentPage(1)
            }
        }

        let lastPageIndex = parseInt(firstPageIndex) + parseInt(pageSize);
        return data && data.length ? data.slice(firstPageIndex, lastPageIndex) : [];
    }, [currentPage, data, pageSize]);

    const handleChangeCheckbox = (e, item) => {
        let tempSelectedData = []
        Object.assign(tempSelectedData, selectedData);
        if (e.target.checked) {
            tempSelectedData.push(item);
        } else {
            const index = tempSelectedData.findIndex((element) => element.itemKeyId === item.itemKeyId);
            if (index !== -1) {
                tempSelectedData.splice(index, 1);
            }
        }
        setSelectedData(tempSelectedData);
        if (props.setSelectedData) {
            props.setSelectedData(tempSelectedData)
        }

        if (tempSelectedData.length == data.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }
    const handleSelectAll = (e) => {
        let tempdata = []
        if (e.target.checked) {
            for (let item of data) {
                if (props.checkBoxValidation == undefined || props.checkBoxValidation(item)) {
                    tempdata.push(item);
                }
            }
            for (let item of selectedData) {
                if (props.checkBoxValidation == undefined || props.checkBoxValidation(item)) {
                    const index = tempdata.findIndex((element) => element.itemKeyId === item.itemKeyId);
                    if (index === -1) {
                        tempdata.push(item);
                    }
                }
            }
        }
        setSelectedData(tempdata);
        if (props.setSelectedData) {
            props.setSelectedData(tempdata)
        }
        setSelectAll(e.target.checked)
    };
    const handleUnSelectAll = () => {
        setSelectedData([]);
        setSelectAll(false);
    }
    return (<Container bsPrefix='custom-grid'>
        <Row className="global-search-bar">
            {/* <Col bsPrefix='search-col'> */}
            <Col md={6} sm={12} className='search-bar-left'>
                {props.handleAdd && writeAccess && <Button className={`btn-primary custom-btn`} onClick={props.handleAdd}><span className="custom-btn-label">Add New</span></Button>}
                {props.handleLink && writeAccess && <Button className={`btn-primary custom-btn`} onClick={props.handleLink}><span className="custom-btn-label">Link</span></Button>}
                {props.handleUnLink && writeAccess && selectedData?.length > 0 && <Button className={`btn-primary custom-btn margin-left`} onClick={() => { props.handleUnLink(selectedData); handleUnSelectAll() }}><span className="custom-btn-label">UnLink</span></Button>}
                {props.handleUpload && writeAccess && <Button className={`btn-primary custom-btn margin-left`} onClick={() => setShowUpload(true)}>Import</Button>}
                {info?.handleSelect && writeAccess && <Button className={`btn-primary custom-btn margin-left`} onClick={() => info.handleSelect(selectedData)}><span className="custom-btn-label">Select</span></Button>}
                {props.customButtons && <props.customButtons data={selectedData} handleUnSelectAll={handleUnSelectAll}></props.customButtons>}
            </Col>
            <Col md={6} sm={12} className='search-bar-right'>  <div className='global-search'> <GlobalSearch className="global-search-col" setData={setData} headers={props.headers} data={props.data} setShowDownButn={setShowDownButn} showDownButn={showDownButn} isSearchOpen={true} searchList={searchList} dataType={props.dataType}></GlobalSearch></div>

                {props.setReload && <OverlayTrigger overlay={<Tooltip>Reload</Tooltip>}><Image className='reload' src={reloadIcon} onClick={() => { props.setReload() }}></Image></OverlayTrigger>}
                {props.DisplayColumnChooser && <ColumnGrid className="column-selector" headers={gridHeader} setGridHeader={setGridHeader} />}
                {selectedData?.length > 0 && <ExcelDownload downloadData={true} fileName={props.dataType} className="download-btn-col" headers={props.headers} data={selectedData} excelHeader={props.excelHeader} excelFooter={props.excelFooter} merge={props.merge} />}
                {props.handleDeleteAll && writeAccess && selectedData?.length > 0 && <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}><Image className="margin-left delete-icon" width={"20px"} src={deleteIcon} onClick={() => { props.handleDeleteAll(selectedData); handleUnSelectAll() }} /></OverlayTrigger>}
            </Col>
            {/* </Col> */}
        </Row>
        <Row><Col className='filter-selected-col gap-2'>{searchList && Object.keys(searchList).map((key, index) => {
            let filterValueSelected = searchList[key][0] && searchList[key][0] !== "" ? searchList[key].displayName + ": " + searchList[key][0] : "";
            filterValueSelected = searchList[key][1] && searchList[key][1] !== "" && searchList[key].condition != "" ? filterValueSelected + " " + searchList[key].condition + " " + searchList[key][1] : filterValueSelected;
            if (searchList[key].filterType == "Range") {
                filterValueSelected = searchList[key][1] && searchList[key][1] != "" ? filterValueSelected + " To " + searchList[key][1] : filterValueSelected;
            }
            if (searchList[key].filterType == "Blank" || searchList[key].filterType == "Not Blank") {
                filterValueSelected = searchList[key].displayName + ":" + searchList[key].filterType;
            }
            if (key == "GlobalSearch") {
                filterValueSelected = "";
            }
            return (<React.Fragment key={index}> {filterValueSelected && <div className='filter-selected'>
                <span className='filter-selected-label'>{filterValueSelected} </span>
                <Image className='filter-selected-cross' src={xFilter} onClick={() => {
                    searchList[key][0] = "";
                    searchList[key][1] = "";
                    searchList[key].filterType = "";
                    let propsTemp = { setData: setData, data: props.data, header: gridHeader };
                    searchAll(propsTemp, searchList)
                }}></Image></div>}</React.Fragment>)
        })}</Col></Row>
        <Container bsPrefix='custom-grid-table'>
            <Table className="responsiveTable" id={props.dataType + "_table"}>
                <thead>
                    <tr>
                        <th className='fixed' style={{ left: 0, "width": '8px' }}></th>
                        {!props.hideCheckBox && <th className='fixed' style={{ left: "8px", "width": "23px" }}>
                            <Form.Check className='table-checkbox' name="select"
                                onChange={handleSelectAll} checked={selectAll}
                            ></Form.Check>
                        </th>}
                        {gridHeader.map((header, index) =>
                        // for hide show column
                        {
                            return (header.displayIndication &&
                                <th key={index} style={{ "width": header.width + "px" }}> <div className='table-th'>{header.displayName}
                                    <Sort data={data} setData={setData} sortList={sortList} setSortList={setSortList} field={header.columnName}></Sort>
                                    <Filter
                                        index={index}
                                        data={props.data}
                                        columnName={header.columnName}
                                        displayName={header.displayName}
                                        setData={setData}
                                        searchList={searchList}
                                        dataType={header.dataType}
                                        header={gridHeader}
                                    />
                                </div>
                                </th>
                            )
                        }
                        )}
                        <th className='fixed icon' style={{ right: 0, minWidth: props?.icons?.length * 17 + 40 + "px" }}>
                            {props?.icons?.map((icon, index) =>
                                <div key={index}>&nbsp;</div>
                            )
                            }
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredResult.map((item, itemIndex) => {
                        item.itemKeyId = item[Object.keys(item)[0]] + "-index-" + itemIndex;
                        return (
                            <tr key={itemIndex} onDoubleClick={() => { if (view?.click) { view.click(item) } }}>
                                <td className={`fixed color ${item.status} ${item.color}`} style={{ left: 0, "width": "8px" }}></td>
                                {!props.hideCheckBox && <td className='fixed' style={{ left: "8px", "width": "23px" }}>
                                    <Form.Check name="select"
                                        checked={selectedData?.length > 0 ? (selectedData.filter(e => e.itemKeyId === item.itemKeyId).length <= 0) ? false : true : false
                                        }
                                        className={`table-checkbox ${item.status}`}
                                        onChange={(e) => {
                                            handleChangeCheckbox(e, item);
                                        }} ></Form.Check>
                                </td>}
                                {gridHeader.map((header, index) =>
                                // for hide show column
                                {
                                    let displayValue = header.formatter ? header.formatter(item[header.columnName], header, item) : item[header.columnName];
                                    return (header.displayIndication &&

                                        <td key={index}>

                                            <div className={`responsive-td ${item[header.columnName]}`}>
                                                {header.dataType == "checkbox" && <Form.Check checked={displayValue}></Form.Check>}
                                                {header.dataType != "checkbox" && <OverlayTrigger placement="top" overlay={<Tooltip className='table-tooltip'>{displayValue}</Tooltip>}>
                                                    <div className="table-display-value">{displayValue}</div></OverlayTrigger>}
                                            </div>
                                        </td>
                                    )
                                }
                                )}
                                <td className='fixed icon ' style={{ right: 0, minWidth: props?.icons?.length * 17 + 40 + "px" }}>
                                    {props?.icons?.map((icon, index) => {
                                        return <>{((icon.iconName != "View" && writeAccess) || icon.iconName == "View") && <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{icon.iconName}</Tooltip>}><div><Image width={"17px"} className={`table-icon ${icon.className} ${item.status}`} key={index} src={icon.src} pointer="Cursor" onClick={() => { icon.click(item) }}>
                                            </Image></div></OverlayTrigger>}
                                        </>
                                    }
                                    )
                                    }
                                </td>
                            </tr>
                        )
                    }
                    )}
                    {filteredResult.length < 1 && <tr><td className='justify-content-center' colSpan={activeColumn + 2}>No records to show</td></tr>}
                </tbody>
            </Table>
        </Container>
        <div className="responsive-div">
            {filteredResult.map((item, itemIndex) => {
                item.itemKeyId = item[Object.keys(item)[0]] + "-index-" + itemIndex;
                return (
                    <Card key={itemIndex} className={`responsive-card mb-3 ${item.Status}`}>
                        <Card.Header className="responsive-card-header">
                            <Form.Check name="select"
                                checked={selectedData?.length > 0 ? (selectedData.filter(e => e.itemKeyId === item.itemKeyId).length <= 0) ? false : true : false
                                }
                                className='custom-checkbox'
                                onChange={(e) => {
                                    handleChangeCheckbox(e, item);
                                }} ></Form.Check>
                            <div className='icon'>
                                {props?.icons?.map((icon, index) => {
                                    return <>{((icon.iconName != "View" && writeAccess) || icon.iconName == "View") &&
                                        <OverlayTrigger key={index}
                                            placement="top"
                                            overlay={<Tooltip>{icon.iconName}</Tooltip>}><span>
                                                <Image width={"17px"} className={`table-icon ${icon.className}`} key={index} src={icon.src} onClick={() => { icon.click(item) }}></Image>
                                            </span></OverlayTrigger>
                                    }</>
                                }
                                )} </div></Card.Header>
                        {gridHeader.map((header, index) =>
                        // for hide show column
                        {
                            let displayValue = header.formatter ? header.formatter(item[header.columnName], header, item) : item[header.columnName];
                            return (header.displayIndication != undefined &&
                                <Card.Body key={index} className={`responsive-row`}>
                                    <span className="responsive-header">{header.displayName}</span>
                                    <span className={`responsive-value ${item[header.columnName]}`}>
                                        {header.dataType == "checkbox" && <Form.Check checked={displayValue}></Form.Check>}
                                        {header.dataType != "checkbox" && <>{displayValue}</>}
                                    </span>
                                </Card.Body>
                            )
                        }
                        )}
                    </Card>)
            }
            )}
        </div>
        <Pagination
            currentPage={currentPage}
            totalCount={data ? data.length : 0}
            data={data}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            dataType={props.dataType}
        />
        {showUpload && <Upload
            dataType={props.dataType}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            headers={props.headers}
            handleUpload={props.handleUpload}
            setReload={() => { props.setReload(!props.reload) }}
        ></Upload>}
    </Container >
    )
}