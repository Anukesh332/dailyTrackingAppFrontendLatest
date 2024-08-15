import React, { useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import InputBox from "../common/InputBox";


const ViewUser = (props) => {

    const [loading, setLoading] = useState(false);
    let action = props.action;
    
 
    const defaultProps = { action: props.action }
    return (<React.Fragment>
        {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
        <Row>
            <div className="mt-2 sub-header">ACCOUNT</div>
            <Row>
                <Row>
                    <Col lg={4} md={6} sm={12}>
                        <InputBox type="text" label="Full Name" name="Name" maxLength={100} value={sessionStorage.getItem('user_name')} required={"true"} {...defaultProps} />
                    </Col>
                    <Col lg={4} md={6} sm={12}>
                        <InputBox type="text" label="Username" name="UserName" maxLength={100} value={sessionStorage.getItem('user_email')} required={"true"} {...defaultProps} />
                    </Col>
                    <Col lg={4} md={6} sm={12}>
                        <InputBox type="text" label="Role" name="Role" maxLength={100} value={sessionStorage.getItem('user_role')} required={"true"} {...defaultProps} />
                    </Col>
                </Row>
            </Row>
        </Row>

    </React.Fragment>
    );
}

export default ViewUser;
