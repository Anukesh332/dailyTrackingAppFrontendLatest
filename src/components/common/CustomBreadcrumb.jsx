import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import "./CustomBreadcrumb.css"

function CustomBreadcrumb(props) {

  return (
    <Breadcrumb className='breadcrum'>
      {/* {props.dashboard &&
        <Breadcrumb.Item className='breadcrum-child'>
          {props.dashboard}
        </Breadcrumb.Item>
      } */}
      {props.parentMenu &&<>
      {/* <Breadcrumb.Item className='breadcrum-parent'  linkProps={{ to: "/" }} linkAs={Link}>
      Dashboard
    </Breadcrumb.Item>  */}
        <Breadcrumb.Item  className='breadcrum-parent'>
          {props.parentMenu}
        </Breadcrumb.Item> </>}
      {props.menu &&
        <Breadcrumb.Item className='breadcrum-child' onClick={()=>{ window.location.reload(true)}}>
          {props.menu}
        </Breadcrumb.Item>
      }
    </Breadcrumb>

  );
}

export default CustomBreadcrumb