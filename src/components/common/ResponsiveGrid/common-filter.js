import constants from "../../../helpers/constants";
import { formatDateFromISOReverse } from "../../../helpers/utility";

export function searchAll(props, obj) {
    console.log("props", props)
    let filteredResult = props.data.filter(
        (item) => mulipleSearch(item, obj, props.header));
    props.setData(filteredResult);
}

export function addInSearchList(obj, searchText, columnName, index) {

    if (obj && obj[columnName]) {
        obj[columnName][index] = searchText;
    } else {
        obj[columnName] = { [index]: searchText }
    }

    return obj;
}

export function compare(filterTypeInput, text1, text2, text3) {
    let isFound = false;
    text1 = text1 && typeof text1 == "string" ? text1.toLowerCase() : text1;
    text2 = text2 && typeof text2 == "string" ? text2.toLowerCase() : text2;
    text3 = text3 && typeof text3 == "string" ? text3.toLowerCase() : text3;

    switch (filterTypeInput) {
        case "Equals":
            isFound = text1 == text2
            break;
        case "Not Equals":
            isFound = text1 != text2
            break;
        case constants.CONTAINS:
            text1 = text1?.toString();
            isFound = text1?.indexOf(text2) >= 0
            break;
        case "Not Contains":
            isFound = text1?.indexOf(text2) < 0

            break;
        case "Starts With":
            isFound = text1?.indexOf(text2) == 0
            break;
        case "Ends With":
            isFound = text1?.indexOf(text2) == text1.length - text2.length
            break;
        case "Blank":
            isFound = text1 == undefined || text1 == ""
            break;
        case "Not Blank":
            isFound = text1 && text1 != ""
            break;
        case "Greater Than or Equal":
            isFound = text1 >= text2
            break;
        case "Greater Than":
            isFound = text1 > text2
            break;
        case "Less Than or Equal":
            isFound = text1 <= text2
            break;
        case "Less Than":
            isFound = text1 < text2
            break;
        case "Range":
            isFound = text1 >= text2 && text1 <= text3
            break;
        case "Checked":
            isFound = text1 == true;
            break;
        case "Unchecked":
            isFound = text1 == false;
            break;
        case "All":
            isFound = true;
            break;
        default:
            break;
    }
    return isFound;
}

export function applyFilter(text1, obj) {
    let isFound1 = false;
    let isFound2 = false;
    // console.log("find", text1, obj[0], obj[1], obj.filterType, obj.filterType2, obj.condition)
    isFound1 = compare(obj.filterType, text1, obj[0], obj[1])

    if (obj.condition && obj.condition != "" && obj[1] && obj[1] != "") {
        isFound2 = compare(obj.filterType2, text1, obj[1]);
        // console.log("isFound2", isFound2)
        if (obj.condition == "AND") {
            return isFound1 && isFound2;
        }

        if (obj.condition == "OR") {
            return isFound1 || isFound2;
        }

    } else {
        return isFound1;
    }
}

export function mulipleSearch(item, searchList, headers) {
    let isFound = true;
    for (let key of Object.keys(searchList)) {
        if (searchList[key][0] != "" || searchList[key][1] != "" || searchList[key].filterType == "Blank" || searchList[key].filterType == "Not Blank") {
            let value = item[key];
            for (let header of headers) {
                if (header.columnName == key && header.displayName === searchList[key].displayName) {
                    if (header?.dataType == "date") {
                        if (item[key] && item[key] != "") {
                            value = formatDateFromISOReverse(item[key]);
                            // value = item[key].slice(0, 10);
                        }

                    } else if (header?.formatter) {
                        value = header.formatter(item[key], header, item);
                    }
                    break;
                }
            }
            isFound = isFound && applyFilter(value, searchList[key])
        }
        if (key == "GlobalSearch") {
            for (let header of headers) {
                if (header.displayIndication == true) {
                    let displayValue = header.formatter ? header.formatter(item[header.columnName], header, item) : item[header.columnName];
                    if (displayValue && displayValue != "") {
                        if (compare(constants.CONTAINS, displayValue, searchList[key][0])) {
                            isFound = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    return isFound;
}