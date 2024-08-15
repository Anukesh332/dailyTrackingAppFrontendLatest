import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import Header from './Header';
import SideBar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from "../common/Alert";
import Main from "./Main";
import { fetchUser } from '../../services/user-service';

export default function Home() {

  const [sidebar, setSidebar] = useState("closed");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  let MENUS = {
    // "WI-KEY CONTROL": {
    // "Icon": wiKeyIcon, "Menus": [
    // { "Menu": "App Users", "Path": "/appUsers", "Icon": appUsersIcon },
    // { "Menu": "Locks", "Path": "/locks", "Icon": lockIcon },
    // { "Menu": "Sites", "Path": "/sites", "Icon": siteIcon },
    // { "Menu": "Access Permissions", "Path": "/accessPermissions", "Icon": accessPermissionsIcon },
    // { "Menu": "Permit Requests", "Path": "/permitRequests", "Icon": permitIcon }
    // ]
    // },
  }

  const getUser = async () => {
    setLoading(true)
    try {
      let fetchedUser = await fetchUser()
      sessionStorage.setItem('user_email', fetchedUser.data.Message[0].user_email);
      sessionStorage.setItem('user_name', fetchedUser.data.Message[0].user_name);
      sessionStorage.setItem('user_role', fetchedUser.data.Message[0].user_role);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert("error", error);
    };
  }

  useEffect(() => {
    getUser();
  }, [reload])

  return (
    <>
      <Row bsPrefix={`home ${sidebar}`}>
        {/* <Col bsPrefix="side-bar">
          <SideBar setSidebar={setSidebar} sidebar={sidebar} menus={MENUS} />
        </Col> */}
        <Col bsPrefix="center-panel">
          <Header setSidebar={setSidebar} sidebar={sidebar} menus={MENUS} />
          <Main />
        </Col>
        <ToastContainer
          autoClose={2000}
          className="toast-container"
          hideProgressBar={true}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          closeButton={false}
          theme="colored"
          icon={false}
        />
      </Row>
    </>
  )
}