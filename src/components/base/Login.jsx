import React, { useEffect, useState } from 'react';
import InputBox from '../common/InputBox';
import DropDownSearch from '../common/DropDownSearch';
import { Row, Col, Card, Alert, Container } from "react-bootstrap";
import profile from "../../assets/images/intro-02.png";
import '../../../src/App.css'
import { addUser, authenticate, fetchUser } from '../../services/user-service';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AlertComman from "../common/Alert";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login(props) {

    const [key, setKey] = useState(1);
    const [login, setLogin] = useState({})
    const [error, setError] = useState({})
    const [errorMessage, setErrorMessage] = useState();
    const [submit, setSubmit] = useState(false);
    const [fieldCount, setFieldCount] = useState([]);
    const fieldValidation = 2;
    const [signUp, setSignUp] = useState({})
    const [error2, setError2] = useState({})
    const [errorMessage2, setErrorMessage2] = useState();
    const [submit2, setSubmit2] = useState(false);
    const [fieldCount2, setFieldCount2] = useState([]);
    const [roles, setRoles] = useState(["Customer", "Seller"]);
    const fieldValidation2 = 4;

    const handleSelect = (key) => {
        setKey(key)
    }

    const handleChange = (e) => {
        if (key == 1) {
            setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
        if (key == 2) {
            setSignUp((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        if (key == 1) {
            setSubmit(submit ? false : true);
        }
        if (key == 2) {
            setSubmit2(submit2 ? false : true);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            // e.preventDefault();
            submitForm(e);
        }
    }

    useEffect(() => {
        if ((fieldCount.length >= fieldValidation) && (key == 1)) {
            setSubmit(submit ? false : true);
            handleSubmit();
            setFieldCount([]);
        }
        if ((fieldCount2.length >= fieldValidation2) && (key == 2)) {
            setSubmit2(submit2 ? false : true);
            handleSubmit2();
            setFieldCount2([]);
        }
    }, [fieldCount, fieldCount2])


    const validateDetails = () => {
        let tempError = false;
        for (let errorObj in error) {
            if (error[errorObj]) {
                tempError = true;
                break;
            }
        }
        if (tempError) {
            setErrorMessage("Please check data validation errors below")
        } else {
            setErrorMessage("")
        }
        return tempError;
    }

    const handleSubmit = async () => {
        if (!validateDetails()) {
            let response = await authenticate(login).catch((err) => {
                setErrorMessage(err)
            });
            if (response) {
                sessionStorage.setItem('token', response.data.Message);
                props.setIsAuthenticated();
                // let fetchedUser = await fetchUser().catch((err) => {
                //     setErrorMessage(err)
                // });
                // sessionStorage.setItem('user_email', fetchedUser.data.Message[0].user_email);
                // sessionStorage.setItem('user_name', fetchedUser.data.Message[0].user_name);
            }
        }
    }

    const showLogin = () => {
        props.setWantLogin();
    }

    const commonProps = { setError: setError, error: error, required: true, submit: submit, setFieldCount: setFieldCount, fieldCount: fieldCount, onChange: handleChange }

    const validateDetails2 = () => {
        let tempError = false;
        for (let errorObj in error2) {
            if (error2[errorObj]) {
                tempError = true;
                break;
            }
        }
        if (tempError) {
            setErrorMessage2("Please check data validation errors below")
        } else {
            setErrorMessage2("")
        }
        return tempError;
    }

    const handleSubmit2 = async () => {
        if (!validateDetails2()) {
            let response = await addUser(signUp).catch((err) => {
                setErrorMessage2(err)
            });
            if (response) {
                const message = "User Added Successfully"
                AlertComman("success", message);
                window.location.reload(true);
            }
        }
    }

    const commonProps2 = { setError: setError2, error: error2, required: true, submit: submit2, setFieldCount: setFieldCount2, fieldCount: fieldCount2, onChange: handleChange }


    return (
        <React.Fragment>
            <form
                onSubmit={(e) => {
                    // e.preventDefault();
                    submitForm(e);
                }}
            >
                <Container className='login-container'>
                    <Row className="login-box">
                        <Col md={8} lg={6} xl={5}>
                            <Card className='login-card'>
                                <Tabs
                                    defaultActiveKey={1}
                                    id="fill-tab-example"
                                    className="mb-3"
                                    fill
                                    onSelect={handleSelect}
                                >
                                    <Tab eventKey={1} title="Login">
                                        <Card.Header className='login-card-header'>
                                            <Row>
                                                <Col onClick={showLogin}>
                                                    <h5 className="login-title">Welcome To DailyTrackingApp !</h5>
                                                    <p className="login-subtiltle">Log in to continue to the portal.</p>
                                                </Col>
                                                <Col>
                                                    <img src={profile} alt="" className="img-fluid" />
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body className='login-card-body'>
                                            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}

                                            <InputBox type="text" label="Email" name="user_email" value={login.user_email} {...commonProps} />

                                            <InputBox type="password" label="Password" name="user_password" value={login.user_password} {...commonProps} />

                                            <div className="mt-3">

                                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" onClick={submitForm} onKeyDown={handleKeyDown}>Log In</button>
                                            </div>
                                        </Card.Body>
                                    </Tab>
                                    <Tab eventKey={2} title="Signup">
                                        <Card.Header className='login-card-header'>
                                            <Row>
                                                <Col>
                                                    <h5 className="login-title">Sign Up !</h5>
                                                    <p className="login-subtiltle">Sign Up to add new account</p>
                                                </Col>
                                                <Col>
                                                    <img src={profile} alt="" className="img-fluid" />
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body className='login-card-body'>
                                            {errorMessage2 && <Alert variant={"danger"}>{errorMessage2}</Alert>}

                                            <InputBox type="text" label="Name" name="user_name" value={signUp.user_name} {...commonProps2} />

                                            <InputBox type="text" label="Email" name="user_email" value={signUp.user_email} isEmail={true} {...commonProps2} />

                                            <InputBox type="password" label="Password" name="user_password" value={signUp.user_password} isPassword={true} {...commonProps2} />

                                            <DropDownSearch data={roles} value={signUp.user_role} label="Role" name="user_role"  {...commonProps2}></DropDownSearch>

                                            <div className="mt-3">

                                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" onClick={submitForm} onKeyDown={handleKeyDown}>Sign Up</button>
                                            </div>
                                        </Card.Body>
                                    </Tab>
                                    {/* <Tab eventKey={3} title="Reset Password">
                                        Tab content for Reset Password
                                    </Tab> */}
                                </Tabs>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </form>
            <ToastContainer
                autoClose={2000}
                className="toast-container"
                hideProgressBar={true}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                closeButton={false}
                theme="colored"
                icon={false}
            />

        </React.Fragment >
    )
}
