import { React, useEffect, useState } from 'react'
import { Modal, Image, Row, Col, Form, Spinner } from 'react-bootstrap'
import xclose from "../../assets/images/x.svg"
import FormButtons from '../common/FormButton';
import InputBox from '../common/InputBox';
import constants from '../../helpers/constants';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Alert from "../common/Alert";
import { calculateDate, formatDate, isoDateFormat } from '../../helpers/utility';
import DatePickerSingle from '../common/DatePickerSingle';
import { buyProduct } from '../../services/buyproduct-service';
import { deleteCartData } from '../../services/cart-service';

function PlaceOrder(props) {

    const MySwal = withReactContent(Swal);
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [obj, setObj] = useState({});
    const [fieldCount, setFieldCount] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [close, setClose] = useState(false);
    const [filterDate, setFilterDate] = useState({ StartDate: new Date() });
    const fieldValidation = 2



    const handleChange = (e, picker) => {
        const { name, value } = e.target;
        setObj((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (picker) {
            setFilterDate((prev => ({ ...prev, StartDate: picker.startDate.format('MM/DD/YYYY') })));
        }
    };

    const handleReset = () => {
        if (props.action === constants.ADD) {
            setObj({});
        };
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
            let confirmationMessage = props.action === constants.ADD ? "Are you sure do you want to Place this Order?" : "Are you sure do you want to to Place this Order?";
            let title = props.action === constants.ADD ? "Place Order" : "Place Order";
            MySwal.fire({
                title: title,
                html: confirmationMessage,
                ...constants.CONFIRMATION_BOX_CONFIG
            }).then(async (selection) => {
                if (selection.isConfirmed) {
                    setLoading(true);
                    props.rowData.totalAmount = calculateTotalPrice(props.rowData.buyQty, props.rowData.price);
                    props.rowData.date = calculateDate();
                    props.rowData.deliveryDate = formatDate(filterDate.StartDate);
                    props.rowData.deliveryDate = isoDateFormat(props.rowData.deliveryDate);
                    props.rowData.address = obj.address;
                    props.rowData.status = "DeliveryPending";
                    let response = await buyProduct(props.rowData).catch((err) => {
                        setErrorMessage(err);
                    });
                    let response2 = await deleteCartData(props.rowData).catch((err) => {
                        setErrorMessage(err);
                    });
                    if (response && response2) {
                        if (close) {
                            let message = "Order Placed Successfully"
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

    const calculateTotalPrice = (a, b) => {
        return a * b
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
                    <Modal.Title className="modal-title">
                        Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{"fontWeight":"bolder"}}>
                        <Col lg={4} md={6} sm={12} className='my-2'>
                            Product Name : {props.rowData.product_name}<br />
                        </Col>
                        <Col lg={4} md={6} sm={12} className='my-2'>
                            Product Price : Rs {props.rowData.price}<br />
                        </Col>
                        <Col lg={4} md={6} sm={12} className='my-2'>
                            Count : {props.rowData.buyQty}<br />
                        </Col>
                        <Col lg={4} md={6} sm={12} className='my-2'>
                            Total Amount To Pay : Rs {calculateTotalPrice(props.rowData.buyQty, props.rowData.price)}<br />
                        </Col>
                    </Row>
                    <Row className='my-3'>
                        <Col lg={4} md={6} sm={12}>
                            <InputBox type="text" label="Address" name="address" value={obj.address} required={"true"} {...defaultProps} {...commonProps} />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <DatePickerSingle label="Select Date of Delivery" name={"DatePicker"} value={filterDate} required={true} {...commonProps} ></DatePickerSingle>
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <Form className='my-4 mx-4'>
                                <Form.Group controlId="cashOnDeliveryCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Cash on Delivery"
                                        defaultChecked
                                        disabled
                                        style={{ "color": "#e09d08", "fontWeight": "bolder" }}
                                    />
                                </Form.Group>
                            </Form>
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

export default PlaceOrder;