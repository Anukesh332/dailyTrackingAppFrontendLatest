
import { Container, Form, OverlayTrigger, Row, Image, Tooltip } from "react-bootstrap";
import columnGridIconGray from "../../../assets/images/column-grid-Icon-Gray.svg";
import React, { useEffect, useState } from "react";

import "./ColumnSelector.css"

import Popover from 'react-bootstrap/Popover';

export default function ColumnGrid(props) {
    const [columnGridObj, setColumnGridObj] = useState(props.headers);

    const handleChangeCheckbox = (e, index) => {
        let temp = []
        Object.assign(temp, columnGridObj);
        temp[index].displayIndication = e.target.checked
        setColumnGridObj(temp);
        props.setGridHeader(temp);
    }

    useEffect(() => {
        setColumnGridObj(props.headers)
    }, [props.headers])

    return (

        <OverlayTrigger trigger="click" placement="bottom-start" rootClose overlay={
            <Popover
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Container className="column-grid-container">
                    {columnGridObj.map((header, index) => {
                        return <Row key={index} className="submenu-row">

                            {header.hasOwnProperty('displayIndication') &&
                                <Form.Group className="menuhead-col">
                                    <Form.Check type="checkbox" className="checkbox-check"
                                        onChange={(e) => {
                                            handleChangeCheckbox(e, index);
                                        }}
                                        checked={header.displayIndication}
                                        label={header.displayName} />
                                </Form.Group>}
                        </Row>
                    })}
                </Container></Popover>}>
            <div>
                <OverlayTrigger overlay={<Tooltip>Column Chooser</Tooltip>}>
                    <Image
                        src={columnGridIconGray}
                        className='column-grid-icon-gray'
                        size='l'
                        height={25}
                    />
                </OverlayTrigger>
            </div>
        </OverlayTrigger>
    )
}