import React from "react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChevronDown from "../../assets/images/menu/chevron-down.svg";
import ChevronUp from "../../assets/images/menu/chevron-up.svg";
import "./NavItem.css"
import { ReactSVG } from "react-svg";


export default function NavItem(props) {
    let location = useLocation();
    let navigate = useNavigate();

    return (<>
        {props.menuType == "parent" && <Nav.Item as="li"  className={`${location.pathname == props.path ? "active":"inactive"}`} onClick={() => {
            props.setOpen && props.setOpen((prevState) => {
                return {
                    ...prevState,
                    [props.menu]: props.open[props.menu] ? false : true
                }
            }
            );
            if(props.path) {navigate(props.path)}
        }}>
            <Nav.Link as={Link} to={props.path} eventKey={props.menu} bsPrefix={`nav-list-item ${props.menuType} `} >
                {props.menuType === "parent" && <OverlayTrigger placement="right" overlay={<Tooltip className="tooltip">{props.menu}</Tooltip>}>
                         <ReactSVG className="sidebar-icon parent" src={props.icon}></ReactSVG>
                </OverlayTrigger>}
                <span className="menu-name">{props.menu}</span>
            </Nav.Link>

            {props.ariaControls && <> {!props.open[props.menu] && <ReactSVG src={ChevronDown} className="menu-arrow" onClick={() => {
                props.setOpen((prevState) => {
                    return {
                        ...prevState,
                        [props.menu]: true
                    }
                }
                )
            }} aria-controls={props.ariaControls}></ReactSVG>}
                {props.open[props.menu] && <ReactSVG src={ChevronUp} className="menu-arrow" onClick={() => {
                    props.setOpen((prevState) => {
                        return {
                            ...prevState,
                            [props.menu]: false
                        }
                    }
                    )
                }} aria-controls={props.ariaControls}></ReactSVG>}

            </>}
        </Nav.Item>}
        {props.menuType == "menu" && <Nav.Item as="li" className={`${location.pathname == props.path ? "active":"inactive"}`} onClick={() => {
            // props.setSidebar("closed")
            navigate(props.path)
        }}>
            <Nav.Link as={Link} to={props.path} eventKey={props.menu} bsPrefix={`nav-list-item ${props.menuType}`} >
                <OverlayTrigger placement="right" overlay={<Tooltip className="tooltip">{props.menu}</Tooltip>}>
                        <ReactSVG className="sidebar-icon menu" src={props.icon}></ReactSVG>
                    </OverlayTrigger>
                <span className="menu-name">{props.menu}</span>
            </Nav.Link>
        </Nav.Item>}
    </>
    )

}