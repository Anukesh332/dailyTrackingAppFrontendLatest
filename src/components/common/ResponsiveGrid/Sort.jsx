import { useEffect, useState } from "react";
import { ChevronDown, ChevronExpand, ChevronUp } from "react-bootstrap-icons";
import "./Sort.css";


export default function Sort(props) {
  
  return <div className="sort"><ChevronUp size={10} className={`sort-icon ${props.sortList[props.field] == true ? "disabled" : ""}`} onClick={() => sortUserData(true)} />
    <ChevronDown size={10} className={`sort-icon ${props.sortList[props.field] == false ? "disabled" : ""}`} onClick={() => sortUserData(false)} /></div>


  function sortUserData(sort) {
    const data = [...props.data];
    if (sort) {
      props.setData(data.sort(getSortOrder(props.field)));
    } else {
      props.setData(data.sort(getReverseSortOrder(props.field)));
    }
    props.setSortList({[props.field]:sort});
  }
}

export function getSortOrder(prop) {
  return function (a, b) {
    let left = a[prop] ? !isNaN(a[prop])? parseFloat(a[prop]): typeof a[prop] === "string" ? a[prop].toLowerCase() : a[prop] : "";
    let right = b[prop] ? !isNaN(b[prop])? parseFloat(b[prop]): typeof b[prop] === "string" ? b[prop].toLowerCase() : b[prop] : "";

    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    }
    return 0;
  };
}
export function getReverseSortOrder(prop) {
  return function (a, b) {
    let left = a[prop] ? !isNaN(a[prop])? parseFloat(a[prop]): typeof a[prop] === "string" ? a[prop].toLowerCase() : a[prop] : "";
    let right = b[prop] ? !isNaN(b[prop])? parseFloat(b[prop]): typeof b[prop] === "string" ? b[prop].toLowerCase() : b[prop] : "";

    if (left < right) {
      return 1;
    } else if (left > right) {
      return -1;
    }
    return 0;
  };
}
