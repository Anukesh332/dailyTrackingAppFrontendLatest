import { useRef } from "react";
import { FormControl } from "react-bootstrap";
import { addInSearchList, searchAll } from "./common-filter";
import constants from "../../../helpers/constants";
import {X} from "react-bootstrap-icons"
import "./Search.css"

export default function Search(props) {

    const searchInput = useRef("");

    function search(searchText) {
        let obj = props.searchList ? props.searchList : {};
        obj = addInSearchList(obj, searchText, props.columnName, 0);
        obj[props.columnName].filterType = constants.CONTAINS;
        obj[props.columnName].displayName = props.displayName;
        obj[props.columnName].searchedField=searchText;
        console.log(props,obj)
        searchAll(props,obj);
    }


    return (
        <div className="search-div">
        <FormControl className="search-input" ref={searchInput}
            type={props.dataType}
            value={props.searchList[props.columnName] ? props.searchList[props.columnName][0] : ""}
            onChange={() => search(searchInput.current.value)}
            aria-label="Search"
            aria-describedby="search"
        />
        <span  className="clear-search" onClick={()=>search("")}><X></X></span>
        </div>
    )
}