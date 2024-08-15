import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import constants from "../../helpers/constants";
import "./FormButton.css";

const FormButtons = (props) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (props.action === constants.EDIT) {
                props.submitForm(e);
            } else {
                props.submitForm(e);
                props.setClose(true);
            }
        }
    };

    return (
        <Row className="action-btn">
            {props.handleReset &&
                <Col md={1} className="action-btn-col mt-2">
                    <Button onClick={props.handleReset} variant="outline-primary">Reset</Button>
                </Col>}
            {/* {props.action === constants.EDIT &&
                <Col md={1} className="action-btn-col mt-2">
                    <Button variant="outline-primary" type="submit" onClick={props.submitForm}>
                        Update
                    </Button>
                </Col>} */}
            <Col md={4} className="action-btn-col mt-2">
                <Button variant="primary" type="submit" onClick={(e) => { props.submitForm(e); props.setClose(true) }} onKeyDown={handleKeyDown}>
                    {props.action === constants.EDIT ? "Update" : "Save"} and Close
                </Button>
            </Col>
        </Row>
    );
}

export default FormButtons;