import { React, useEffect, useState } from 'react'
import { Modal, Image, Row, Col, Form, Spinner } from 'react-bootstrap'
import xclose from "../../assets/images/x.svg"
import FormButtons from '../common/FormButton';
import InputBox from '../common/InputBox';
import constants from '../../helpers/constants';
import { addNote } from '../../services/note-service';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Alert from "../common/Alert";
import { calculateDate } from '../../helpers/utility';

function AddEditNote(props) {

    const MySwal = withReactContent(Swal);
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [obj, setObj] = useState(props.action === constants.ADD ? {} : props.rowData);
    const [fieldCount, setFieldCount] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [close, setClose] = useState(false);
    const fieldValidation = 2



    const handleChange = (e) => {
        const { name, value } = e.target;
        setObj((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleReset = () => {
        if (props.action === constants.ADD) {
            setObj({});
        } else if (props.action === constants.EDIT) {
            setObj(props.rowData)
        }
        setError();
        setErrorMessage()
    }

    const submitForm = (e) => {
        e.preventDefault();
        setSubmit(submit ? false : true);
    }

    useEffect(() => {
        if ((fieldCount.length >= fieldValidation)) {
            setSubmit(submit ? false : true);
            handleSubmit();
            setFieldCount([]);
        }
    }, [fieldCount])

    const handleSubmit = async () => {
        if (!validateDetails()) {
            let confirmationMessage = props.action === constants.ADD ? "Are you sure do you want to Add New Note?" : "Are you sure do you want to Edit Selected Note?";
            let title = props.action === constants.ADD ? "Add New Note" : "Edit Note";
            MySwal.fire({
                title: title,
                html: confirmationMessage,
                ...constants.CONFIRMATION_BOX_CONFIG
            }).then(async (selection) => {
                if (selection.isConfirmed) {
                    setLoading(true)
                    obj.date = calculateDate();
                    let response = await addNote(obj).catch((err) => {
                        setErrorMessage(err);
                    });
                    if (response) {
                        if (close) {
                            let message = ""
                            if (obj.SK) {
                                message = "Note Updated Successfully"
                            } else {
                                message = "Note Added Successfully"
                            }
                            Alert("success", message);
                            props.onHide();
                            props.setReload();
                        }
                    }
                    setLoading(false);
                }
            })
        }
    }

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

    const defaultProps = { action: props.action }
    const commonProps = { setError: setError, error: error, submit: submit, setFieldCount: setFieldCount, fieldCount: fieldCount, onChange: handleChange }

    return (
        <>
            {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
            <Modal
                show={"showForm"}
                {...props}
                size="lg"
                backdrop="static"
            >

                <Modal.Header >
                    <Image src={xclose} onClick={props.onHide} className='userFormHeaderName'></Image>
                    <Modal.Title className="modal-title ">
                        {props.action} Note
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg={4} md={6} sm={12}>
                            <InputBox type="text" label="Title" name="title" maxLength={100} value={obj.title} required={"true"} {...defaultProps} {...commonProps} />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <InputBox type="text" label="Note" name="note" maxLength={100} value={obj.note} required={"true"} {...defaultProps} {...commonProps} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {errorMessage && (<Form.Text className="text-danger">{errorMessage}</Form.Text>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {props.action != constants.VIEW && <FormButtons handleReset={handleReset} action={props.action} submitForm={submitForm} setClose={setClose}></FormButtons>}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddEditNote