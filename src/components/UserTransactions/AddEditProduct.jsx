import { React, useEffect, useState } from 'react'
import { Modal, Image, Row, Col, Form, Spinner } from 'react-bootstrap'
import xclose from "../../assets/images/x.svg"
import FormButtons from '../common/FormButton';
import InputBox from '../common/InputBox';
import constants from '../../helpers/constants';
import { addProduct, uploadProductImg } from '../../services/product-service';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Alert from "../common/Alert";
import { calculateDate } from '../../helpers/utility';
import DropFileInput from "../common/DropFileInput";
import validate from '../../helpers/file-validation';

function AddEditProduct(props) {

    const MySwal = withReactContent(Swal);
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [obj, setObj] = useState(props.action === constants.ADD ? {} : props.rowData);
    const [fieldCount, setFieldCount] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [close, setClose] = useState(false);
    const [fileList, setFileList] = useState(props.action === "Edit" && props.rowdata.filename ? [{ name: props.rowdata.filename }] : []);
    const [fileChanged, setFileChanged] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const fieldValidation = 2

    const onFileChange = (file) => {
        const { isValid, error } = validate(file[0], []);
        if (!isValid) {
            setError((prev) => ({ ...prev, ["File"]: error }));
        }
        setFileList(file)
        setFileChanged(true);
        setIsFormChanged(true);
    };

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
            setFileList([]);
        } else if (props.action === constants.EDIT) {
            setObj(props.rowData);
            setFileList([{ name: props.rowdata.filename }])
        }
        setIsFormChanged(false);
        setError();
        setErrorMessage()
    }

    const submitForm = (e) => {
        if (isFormChanged) {
            e.preventDefault();
            setSubmit(submit ? false : true);
        } else {
            setErrorMessage("Please upload image")
        }
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
            let confirmationMessage = props.action === constants.ADD ? "Are you sure do you want to Add New Product?" : "Are you sure do you want to Edit Selected Product?";
            let title = props.action === constants.ADD ? "Add New Product" : "Edit Product";
            MySwal.fire({
                title: title,
                html: confirmationMessage,
                ...constants.CONFIRMATION_BOX_CONFIG
            }).then(async (selection) => {
                if (selection.isConfirmed) {
                    setLoading(true)
                    const formData = new FormData();
                    formData.append('image', fileList[0]);
                    obj.date = calculateDate();
                    obj.filename = `image-${fileList[0].name}`;
                    obj.productAddedBy = sessionStorage.getItem('user_email');
                    let response = await addProduct(obj).catch((err) => {
                        setErrorMessage(err);
                    });
                    let response2 = await uploadProductImg(formData).catch((err) => {
                        setErrorMessage(err);
                    });
                    if (response && response2) {
                        if (close) {
                            let message = ""
                            if (obj.SK) {
                                message = "Product Updated Successfully"
                            } else {
                                message = "Product Added Successfully"
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
                            <InputBox type="text" label="Product Name" name="product_name" maxLength={100} value={obj.product_name} required={"true"} {...defaultProps} {...commonProps} />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <InputBox type="text" label="Price" name="price" maxLength={100} value={obj.price} required={"true"} {...defaultProps} {...commonProps} />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <InputBox type="text" label="Rating" name="rating" maxLength={100} value={obj.rating} required={"true"} isSingleDigitNo={true} {...defaultProps} {...commonProps} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12}>
                            <h6>Image Upload</h6>
                            <DropFileInput
                                onFileChange={(file) => onFileChange(file)}
                                fileChanged={fileChanged}
                                required={true}
                                setError={setError}
                                // folderPath={props.rowdata?.PK + "/" + props.rowdata?.SK?.split("#")[1] + "/" + operatorObj.OperatorRevisionNo + "/"}
                                fileList={fileList}
                                readOnly={false}
                            />
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

export default AddEditProduct;