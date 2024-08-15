import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { Col, Form, Row } from 'react-bootstrap';
import "./DropDownSearch.css"
import constants from '../../helpers/constants';

const DropDownSearch = (props) => {

    let options = [];

    props?.data?.map((item, index) => {

        let option = {};
        if (props.labelField) {
            option.label = item[props.labelField];
            option.value = item[props.valueField];

        } else {
            option.label = item;
            option.value = item;
        }
        options.push(option);
    });

    const [focus, setFocus] = useState(false);

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
        if (props.required) {
            validateMandatory()
        }
        if (props.value && props.value !== "" && props.customValidation) {
            let errMsg = props.customValidation(props.value);
            props.setError((prev) => ({ ...prev, [props.name]: errMsg }));
        }
    }

    useEffect(() => {
        if (props.submit) {
            props.setFieldCount((prev) => ([...prev, props.name]));
            allValidations();
        }
    }, [props.submit]);

    return (<>
        {props.action == constants.VIEW ? <Row>
            <Col sm={6} ><Form.Label className='display-label' htmlFor={props.name}>{props.label}</Form.Label></Col><Col className='display-value' sm={6}>{props.value ? props.value : "-"}</Col>
        </Row>
            :
            <Form.Group className={`g-input-select`}>
                <Select
                    classNamePrefix="select"
                    className={` ${props.error && props.error[props.name] ? "text-field-with-error" : ""}`}
                    {...props}
                    onBlur={(e) => { validateInput(); }}
                    options={options}
                    value={props.value && { label: options.find((item)=>item.value==props.value)?.label, value: props.value }}
                    id={props.name}
                    placeholder=""
                    onChange={(opt) => {
                        let obj = { target: { name: props.name, value: opt.value } }
                        props.onChange(obj);
                    }}
                />
                {/* <Form.Select
                    className={` ${props.error && props.error[props.name] ? "text-field-with-error" : ""}`}
                    {...props}
                    onBlur={(e) => { validateInput(); }}
                    autoComplete="off"
                    id={props.name}
                    onFocus={
                        () => { setFocus(true) }}
                /> */}
                <Form.Label className={`${(focus || (props?.value && props?.value != "")) ? "active" : ""} ${props.error && props.error[props.name] ? "text-label-with-error" : ""}`} htmlFor={props.name}>
                    {props.label}
                    {(!props.required || props.readOnly == false) && <span className="optional"> (optional)</span>}
                </Form.Label>
                {props.error && props.error[props.name] && (
                    <Form.Text className="text-danger">
                        {props.error[props.name]}
                    </Form.Text>
                )}
            </Form.Group>}</>
    )
}

export default DropDownSearch;