import React, { useState } from "react";
import { Button, Card, Col, Form, Image, Modal, Row, Tab, Tabs } from "react-bootstrap";
import xclose from "../../../assets/images/x.svg";
import ResponsiveTable from "./ResponsiveTable";
import UserContext from '../../../helpers/user-context';
import Alert from "../Alert";
import ExcelDownload from "./ExcelDownload";
const XLSX = require('xlsx');



export default function Upload(props) {

    const [validData, setValidData] = useState()
    const [invalidData, setInvalidData] = useState()
    const [headers, setHeaders] = useState()
    const [file, setFile] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const info = {
        "Modal": true,
    };

    const uploadFile = async () => {
        try {
            if (file) {
                let tempHeaders = []
                Object.assign(tempHeaders, props.headers)
                setErrorMessage();
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];


                // Process the worksheet data
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let index = 0;
                let tempValidData = [];
                let tempInvalidData = [];
                let errorMsg = "";
                let keyColumn = "";

                for (let row of rows) {
                    // console.log("row", row)
                    ++index;
                    if (index == 1) {
                        for (let columnObj of tempHeaders) {
                            let cellIndex = 0;
                            let isFound = false;
                            for (let cell of row) {
                                if (columnObj.dataType === "Linking") {
                                    if (cell == columnObj.displayName) {
                                        if (columnObj.index) {
                                            columnObj.index.push(cellIndex);
                                        } else {
                                            columnObj.index = [cellIndex]
                                        }
                                    }
                                } else {
                                    if (cell == columnObj.displayName) {
                                        columnObj.index = cellIndex;
                                        isFound = true;
                                        break;
                                    }
                                }
                                ++cellIndex;
                            }
                            if (columnObj.required && !isFound) {
                                errorMsg = (errorMsg?.length > 0 ? errorMsg + "," : "") + " Mandatory column " + columnObj.displayName + " not present";
                            }
                            if (columnObj.key) {
                                keyColumn = columnObj.columnName;
                            }
                        }
                    } else if (errorMsg?.length > 0) {
                        setErrorMessage(errorMsg)
                        break;

                    } else {
                        let obj = {}
                        for (let columnObj of tempHeaders) {
                            if (columnObj.required && (!row[columnObj.index] || row[columnObj.index] == "")) {
                                obj.Error = (obj.Error?.length > 0 ? obj.Error + "," : "") + columnObj.displayName + " is mandatory";
                            }


                            if (row[columnObj.index] && row[columnObj.index] != "" && ["number"].includes(columnObj.dataType)) {
                                if (typeof row[columnObj.index] !== columnObj.dataType) {
                                    obj.Error = (obj.Error?.length > 0 ? obj.Error + "," : "") + " Format of " + columnObj.displayName + " is not  " + columnObj.dataType;
                                }
                            }

                            if (columnObj.customValidation && row[columnObj.index] && row[columnObj.index] != "") {
                                let error = await columnObj.customValidation(row[columnObj.index])
                                if (error?.length > 0) {
                                    obj.Error = (obj.Error?.length > 0 ? obj.Error + "," : "") + error;
                                }
                            }
                            if (columnObj.uploadFormatter) {
                                let data = columnObj.uploadFormatter(row[columnObj.index], columnObj);
                                if (data instanceof Array) {
                                    if (obj[columnObj.columnName] && obj[columnObj.columnName].length > 0) {
                                        obj[columnObj.columnName] = [...obj[columnObj.columnName], ...data]
                                    } else {
                                        obj[columnObj.columnName] = data;
                                    
                                    } 
                                } else {
                                    obj[columnObj.columnName] = data;
                                }
                            } else {
                                obj[columnObj.columnName] = row[columnObj.index];
                            }

                            if (columnObj.dataType === "Linking") {
                                if (columnObj.index) {
                                    for (let index of columnObj.index) {
                                        if (!obj.Linking) {
                                            obj.Linking = { [columnObj.columnName]: { method: columnObj.method, payload: { identifiers: [row[index]] } } };
                                        } else {
                                            if (!obj.Linking[columnObj.columnName]) {
                                                obj.Linking[columnObj.columnName] = { method: columnObj.method, payload: { identifiers: [row[index]] } }
                                            } else {
                                                obj.Linking[columnObj.columnName].payload.identifiers.push(row[index])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // obj.oid = index;
                        if (obj?.Error?.length > 0) {
                            tempInvalidData.push(obj);
                        } else if (Object.keys(obj).length > 0) {
                            let result = await props.handleUpload(obj).catch((error) => {
                                obj.Error = (obj.Error?.length > 0 ? obj.Error + "," : "") + error;
                                tempInvalidData.push(obj);
                            });
                            if (result) {
                                for (let link in obj.Linking) {
                                    await obj.Linking[link].method(obj[keyColumn], obj.Linking[link].payload).catch((error) => {
                                        obj.Error = (obj.Error?.length > 0 ? obj.Error + "," : "") + "Linking " + link + " : " + error;
                                    });
                                }
                                tempValidData.push(obj);
                            }
                        }
                    }

                }

                tempHeaders.push({ displayName: "Error", columnName: "Error", dataType: "text", displayIndication: true , width:150})
                setHeaders(tempHeaders);
                setInvalidData(tempInvalidData)
                setValidData(tempValidData)

                if (tempValidData.length > 0) {
                    props.setReload();
                    Alert("success", [props.dataType] + " added successfully")
                }
            } else {
                setErrorMessage("Please select file")
            }
        } catch (error) {
            setErrorMessage(error.toString());
        }
    };


    return (<React.Fragment>
        <UserContext.Provider value={info}>
            <Modal
                show={props.showUpload}
                {...props}
                size="lg"
                backdrop="static"
            >
                <Modal.Header >
                    <Image src={xclose} onClick={() => props.setShowUpload(false)}></Image>
                    <Modal.Title className="modal-title">
                        Import File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6} sm={12}>
                            <Form.Control type="file" name="file" onChange={(e) => setFile(e.target.files[0])}></Form.Control>
                        </Col>
                        <Col md={6} sm={12}>
                            Download Template : <ExcelDownload fileName={props.dataType} className="download-btn-col" downloadTemplate={true} headers={props.headers} data={[]} />
                        </Col>
                    </Row>



                    <Row>
                        <Col className="mt-2">
                            {errorMessage && (<Form.Text className="text-danger">{errorMessage}</Form.Text>
                            )}
                        </Col>
                    </Row>
                    <Row className="action-btn mt-2">
                        <Col lg={1} md={2} sm={6}>
                            <Button variant="outline-primary" type="submit" onClick={uploadFile}>
                                Upload
                            </Button>
                        </Col>
                    </Row>
                    {(validData || invalidData) && !errorMessage && <>
                        < div className="mt-2 sub-header">File Data</div>
                        <Tabs
                            defaultActiveKey="Invalid"
                            id="uncontrolled-tab-example"
                        >
                            <Tab eventKey="Invalid" title="Invalid Entries">
                                <Card className="card-form first">
                                    <Card.Body>
                                        <ResponsiveTable data={invalidData} headers={headers} dataType={"Users"} />
                                    </Card.Body>
                                </Card>

                            </Tab>
                            <Tab eventKey="Valid" title="Uploaded Entries">
                                <Card className="card-form"><Card.Body>
                                    <ResponsiveTable data={validData} headers={headers} dataType={"Users"} />
                                </Card.Body></Card>
                            </Tab>
                        </Tabs>
                    </>}
                </Modal.Body></Modal>
        </UserContext.Provider>
    </React.Fragment >)
}