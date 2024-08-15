import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import "./InputBox.css"
import constants from '../../helpers/constants';
import { Eye, EyeSlash } from 'react-bootstrap-icons';


const InputBox = (props) => {
    const [focus, setFocus] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [type, setType] = useState(props.type);

    const isSingleDigitNo = /^[1-5]$/;
    const alphanumericRegexWSC = /^[a-z0-9]+@gmail\.com$/;
    const isPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

    const validateInput = () => {
        setFocus(false);
        allValidations();
    }
    const validateMandatory = () => {
        if ((!props.value || props.value === "")) {
            props.setError((prev) => ({ ...prev, [props.name]: props.label + " is mandatory" }));
        } else {
            props.setError((prev) => ({ ...prev, [props.name]: "" }));
        }
    }

    const allValidations = () => {
        if (props.required && !props.readOnly) {
            validateMandatory()
        }
        if (props.value && props.value !== "") {
            if (props.customValidation) {
                let errMsg = props.customValidation(props.value);
                props.setError((prev) => ({ ...prev, [props.name]: errMsg }));
            }
            if (props.hasOwnProperty("min")) {
                if (props.value < props.min) {
                    props.setError((prev) => ({ ...prev, [props.name]: "Please enter value greater than " + [props.min] }));
                } else {
                    props.setError((prev) => ({ ...prev, [props.name]: "" }));
                }
            }
            if (props.hasOwnProperty("max")) {
                if (props.value > props.max) {
                    props.setError((prev) => ({ ...prev, [props.name]: "Please enter value less than " + [props.max] }));
                } else {
                    props.setError((prev) => ({ ...prev, [props.name]: "" }));
                }
            }
            if (props.hasOwnProperty("isEmail")) {
                if (!alphanumericRegexWSC.test(props.value)) {
                    props.setError((prev) => ({ ...prev, [props.name]: props.label + " accept only Email" }));
                } 
                else {
                    props.setError((prev) => ({ ...prev, [props.name]: "" }));
                }
            }
            if (props.hasOwnProperty("isPassword")) {
                if (!isPassword.test(props.value)) {
                    props.setError((prev) => ({ ...prev, [props.name]: props.label + " should include atleast one upper and lower case alphabet, digit, spectial character and minimum length 8" }));
                } 
                else {
                    props.setError((prev) => ({ ...prev, [props.name]: "" }));
                }
            }
            if (props.hasOwnProperty("isSingleDigitNo")) {
                if (!isSingleDigitNo.test(props.value)) {
                    props.setError((prev) => ({ ...prev, [props.name]: props.label + " accept only single digit no. between 1 to 5" }));
                } 
                else {
                    props.setError((prev) => ({ ...prev, [props.name]: "" }));
                }
            }
        }
    }

    useEffect(() => {
        if (props.submit) {
            props.setFieldCount((prev) => ([...prev, props.name]));
            allValidations();
        }
    }, [props.submit]);


    const handleToggle = () => {
        setShowPassword(!showPassword);
        setType(showPassword ? 'password' : 'text');
    }

    return (<>
        {props.action == constants.VIEW ? <Row>
            <Col sm={6}><Form.Label className='display-label' htmlFor={props.name}>{props.label}</Form.Label></Col><Col className='display-value' sm={6}>{props.value ? props.value : "-"}</Col>
        </Row>
            :
            <Form.Group className={`g-input`}>
                <Form.Control
                    className={` ${props.error && props.error[props.name] ? "text-field-with-error" : ""}`}
                    {...props}
                    onBlur={(e) => { validateInput(); }}
                    type={type}
                    // autoComplete="off"
                    id={props.name}
                    value={!props.value || props.value == "null" ? "" : props.value}
                    onFocus={
                        () => { setFocus(true) }}
                    placeholder={focus ? "" : props.label + ((!props.required || props.readOnly == false) ? " (optional)" : "")}
                />
                <Form.Label title={props.tooltipText} className={`${(focus || props.type == "date" || (props?.value && props?.value != "")) ? "active" : ""} ${props.error && props.error[props.name] ? "text-label-with-error" : ""}`} htmlFor={props.name}>
                    {props.label}
                    {(!props.required || props.readOnly == false) && <span className="optional"> (optional)</span>}
                </Form.Label>
                {props.error && props.error[props.name] && (
                    <Form.Text className="text-danger">
                        {props.error[props.name]}
                    </Form.Text>
                )}
                {props.type === "password" && props.value && props.value !== "" && (
                    <>
                        {showPassword ? (
                            <Eye className="password-icon" onClick={handleToggle} size={20} />
                        ) : (
                            <EyeSlash className="password-icon" onClick={handleToggle} size={20} />
                        )}
                    </>
                )}
            </Form.Group>
        }
    </>
    )

}

export default InputBox;