import { useEffect, useRef, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import calendarDate from "../../assets/images/calender-date.svg"
import { Form, Image } from 'react-bootstrap';
import "./InputBox.css"
import { formatDateSales } from '../../helpers/utility';

function DatePicker(props) {
    // let inputRef = useRef();
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState("")
    const validateInput = () => {
        setFocus(false);
        allValidations();
    }
    const validateMandatory = () => {
        if ((!props.value || props.value === "")) {
            return props.label + " is mandatory";
        } else {
            return "";
        }
    }

    const allValidations = () => {
        let errorMsg = "";
        if (props.required && !props.readOnly) {
            errorMsg = validateMandatory()
        }
        if (props.value && props.value !== "") {
            if (props.customValidation) {
                errorMsg = props.customValidation(props.value, props.name);
            }
        }
        if (props.setError) { props.setError((prev) => ({ ...prev, [props.name]: errorMsg })); }
    }

    useEffect(() => {
        if (props.submit) {
            props.setFieldCount((prev) => ([...prev, props.name]));
            allValidations();
        }
    }, [props.submit]);

    // useEffect(() => {
    //     if (props.focusInd) {
    //         inputRef.current.focus();
    //     }
    // }, [props.focusInd]);

    useEffect(() => {
        let tempValue = "";
        if (props.value.StartDate && props.value.StartDate != "" && props.value.EndDate && props.value.StartDate != "") {
            tempValue = formatDateSales(props.value.StartDate) + " - " + formatDateSales(props.value.EndDate)
        }
        setValue(tempValue);
        allValidations();
    }, [props.value]);

    return (
        <DateRangePicker
            // initialSettings={{showDropdowns: true}}
            initialSettings={{...{ showDropdowns: true }, ...props.initialSettingsProps }}
            onApply={props.onChange}
        >
            <Form.Group className={`g-input`}>
                <Form.Control
                    className={` ${props.className} ${props.error && props.error[props.name] ? "text-field-with-error " : ""}`}
                    {...props}
                    onBlur={(e) => { validateInput(); }}
                    autoComplete="off"
                    id={props.name}
                    value={value}
                    placeholder={focus ? "" : props.label + ((!props.required || props.readOnly == false) ? " (optional)" : "")}
                    // ref={inputRef}
                />
                <Form.Label className={`${(focus || (value && value != "")) ? "active" : ""} ${props.error && props.error[props.name] ? "text-label-with-error" : ""}`} htmlFor={props.name}>
                    {props.label}
                    {(!props.required || props.readOnly == false) && <span className="optional"> (optional)</span>}
                </Form.Label>
                <Image src={calendarDate} className="calendar-btn" 
                // onClick={() => props.click()}
                ></Image>
                {props.error && props.error[props.name] && (
                    <Form.Text className="text-danger">
                        {props.error[props.name]}
                    </Form.Text>
                )}
            </Form.Group>
        </DateRangePicker>
    );
}

export default DatePicker;