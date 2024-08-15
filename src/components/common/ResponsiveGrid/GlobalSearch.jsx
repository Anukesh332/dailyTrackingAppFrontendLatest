import { useEffect, useRef, useState } from "react";
import { FormControl, OverlayTrigger, Tooltip} from "react-bootstrap";
import { searchAll } from "./common-filter";
import GlobalSearchIcon from "../../../assets/images/global-search-icon.svg"
import crossSearch from "../../../assets/images/x.svg"
import "./GlobalSearch.css"

export default function GlobalSearch(props) {

    const searchRef = useRef();
    const [searchInput, setSearchInput] = useState("")
    const [showSearchBar, setShowSearchBar] = useState(props.isSearchOpen)

    function search(searchText) {
        if (props.data && props.data.length > 0) {
            let obj = props.searchList ? props.searchList : {};
            obj["GlobalSearch"] = { 0: searchText }
            let propsTemp = { setData: props.setData, data: props.data, header: props.headers };
            searchAll(propsTemp, obj)
        }

    }

    useEffect(() => {
        setSearchInput("");
        setShowSearchBar(props.isSearchOpen)
        props.setShowDownButn(true);
    }, [props.dataType])

    useEffect(() => {
        search(searchInput);
    }, [searchInput])

    useEffect(() => {
        if (showSearchBar) {
            searchRef.current.focus();
        }
    }, [showSearchBar])

    function toggleShow() {
        if (!props.isSearchOpen) {
            setShowSearchBar(!showSearchBar);
            props.setShowDownButn(!props.showDownButn);
        }
    }

    return (
        <>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Search</Tooltip>}
            >
              <div className={`search-global ${showSearchBar == true ? "active" : ""} `}>  <img
                    className={`search-global-icon `}
                    src={GlobalSearchIcon}
                    alt="search"
                    onClick={toggleShow}
                /></div>
            </OverlayTrigger>
            {
                <div className={`search-global-input ${showSearchBar == true ? "active" : ""} `}>
                    <FormControl
                        ref={searchRef}
                        className="search-bar"
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        aria-label="Search"
                        aria-describedby="search"
                        placeholder="Search here"
                    />
                    {(searchInput.length > 0 || props.isSearchOpen == undefined) && <span className="clear-global-search" onClick={() => setSearchInput("")}>
                        <img
                            className="cross-button"
                            src={crossSearch}
                            onClick={toggleShow}
                        />

                    </span>}
                </div>
            }
        </>
    )
}