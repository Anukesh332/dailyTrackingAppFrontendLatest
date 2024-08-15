import constants from "../../../helpers/constants";

export default function Option(props) {
    return (<>
        {props.dataType == "text" && <>
            <option>{constants.CONTAINS}</option>
            <option>Not Contains</option>
            <option>Equals</option>
            <option>Not Equals</option>
            <option>Starts With</option>
            <option>Ends With</option>
            <option>Blank</option>
            <option>Not Blank</option>
        </>}
        { (props.dataType == "number" || props.dataType == "date") && <>
            <option>Equals</option>
            <option>Not Equals</option>
            <option>Greater Than</option>
            <option>Greater Than or Equal</option>
            <option>Less Than</option>
            <option>Less Than or Equal</option>
            <option>Range</option>
            <option>Blank</option>
            <option>Not Blank</option>
        </>}
        {props.dataType == "checkbox" && <>
            <option>All</option>
            <option>Checked</option>
            <option>Unchecked</option>
            
        </>}
    </>
    )
}