import { Nav, Collapse, Image } from "react-bootstrap";
import NavItem from "../common/NavItem";
import React, { useState } from "react";
import godrejSSDLogo from "../../assets/images/logo/Spot_Light_Black.png"
import hamburgerIcon from "../../assets/images/hamburger.svg";
import dashboardIcon from "../../assets/images/menu/house.svg"
import sellerIcon from "../../assets/images/menu/bell.svg"
import customerIcon from "../../assets/images/menu/battery-quarter.svg"
import cartIcon from "../../assets/images/menu/envelope.svg"
import deliveryPendIcon from "../../assets/images/menu/building-lock.svg"
import deliveryDoneIcon from "../../assets/images/check2-all.svg"
import mySalesIcon from "../../assets/images/calender-date.svg"
import { ReactSVG } from "react-svg";

export default function SideBar(props) {

  const [open, setOpen] = useState({});

  return (
    <>
      <div className="sidebar-head">
        <Image className="logo-header" src={godrejSSDLogo} height="44"/>
        <ReactSVG className="head-toggle" fill="#084CE8" src={hamburgerIcon} onClick={() => { props.setSidebar(props.sidebar === "closed" ? "open" : "closed") }}/>
        {/* <List className="head-toggle" onClick={() => { props.setSidebar(props.sidebar === "closed" ? "open" : "closed") }}></List> */}
      </div>
      <div className={`sidebar-body ${props.sidebar}`}>
        <Nav bsPrefix="nav-list" defaultActiveKey={"Dashboard"}>
          <NavItem menuType={"parent"} menu={"DASHBOARD"} path={"/"} icon={dashboardIcon}></NavItem>
          {sessionStorage.getItem('user_role') =="Seller" && <NavItem menuType={"parent"} menu={"My Products"} path={"/sellerproducts"} icon={sellerIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Customer" && <NavItem menuType={"parent"} menu={"Shop Now"} path={"/customerproducts"} icon={customerIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Customer" && <NavItem menuType={"parent"} menu={"My Cart"} path={"/cart"} icon={cartIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Seller" && <NavItem menuType={"parent"} menu={"Pending For Delivery"} path={"/pendingForDeliveryProducts"} icon={deliveryPendIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Seller" && <NavItem menuType={"parent"} menu={"Delivered Products"} path={"/deliveredProducts"} icon={deliveryDoneIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Seller" && <NavItem menuType={"parent"} menu={"My Sales"} path={"/mySales"} icon={mySalesIcon}></NavItem>}
          {sessionStorage.getItem('user_role') =="Customer" && <NavItem menuType={"parent"} menu={"My Order"} path={"/myOrder"} icon={mySalesIcon}></NavItem>}
          {/* {Object.keys(props.menus).map((parentMenu, index) => {
              return (<React.Fragment key={index}>
                <NavItem  menuType={"parent"} menu={parentMenu} setOpen={setOpen} open={open} ariaControls={parentMenu} icon={props.menus[parentMenu].Icon}></NavItem>
                <Collapse in={open[parentMenu]}>
                  <div id={parentMenu}>
                    {props.menus[parentMenu]?.Menus.map((item, index) => {
                      return <NavItem key={index} menuType={"menu"} menu={item.Menu} path={item.Path} icon={item.Icon} setSidebar={props.setSidebar} ></NavItem>
                    })}
                  </div></Collapse></React.Fragment>)s
          })} */}

        </Nav>
      
      </div>
    </>
  );
}
