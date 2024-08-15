import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import NoData from "../common/NoData";
import { Row, Col, Container, Spinner, OverlayTrigger, Tooltip, Button, Image } from 'react-bootstrap';
import Alert from "../common/Alert";
import { getMyOrder } from '../../services/buyproduct-service';
import RatingStars from '../common/RatingStars';
import QuantitySelectorPerItem from '../common/QuantitySelectorPerItem';
import PlaceOrder from './PlaceOrder';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import deleteIcon from "../../assets/images/delete.svg";
import constants from '../../helpers/constants';
import { formatDateFromISO } from '../../helpers/utility';
import Footer from '../base/Footer';

export default function MyOrder() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");
  const [rowData, setRowData] = useState(false);
  const [reload, setReload] = useState(false);
  const MySwal = withReactContent(Swal);

  const getCartProducts = async () => {
    setLoading(true);
    try {
      const result = await getMyOrder();
      setData(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert("error", error);
    };
  }

  useEffect(() => {
    getCartProducts();
  }, [reload])

  const handleDelete = (element) => {
    MySwal.fire({
      title: "Remove From Cart",
      html: "Are you sure you want to remove this Product from Cart?",
      ...constants.CONFIRMATION_BOX_CONFIG
    }).then(async (selection) => {
      if (selection.isConfirmed) {
        setLoading(true);
        let response = await "deleteCartData"(element).catch((error) =>
          console.log(error)
        );
        if (response) {
          Alert("success", "Removed From Cart Successfully.")
          setReload(!reload);
        }
        setLoading(false);
        setReload(!reload)
      }
    })
  };

  const buyNow = (element) => {
    if (!element.buyQty) {
      element.buyQty = 1;
    }
    console.log(element);
    setAction("Add");
    setShowForm(true);
    setRowData(element);
  }

  const handleUpdateQuantity = (element, newQuantity) => {
    element.buyQty = newQuantity;
  };

  return (
    <>
      {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
      <Container bsPrefix="main-header-dashboard">
        <h1 className='titleOfPage mb-3'>My Order</h1>
        <Container bsPrefix="main-body-dashboard">
          {showForm && (
            <PlaceOrder
              action={action}
              onHide={() => setShowForm(false)}
              setReload={() => { setReload(!reload) }}
              rowData={rowData}
            />
          )}
          {data.length !== 0 &&
            <Row>
              <>
                {
                  data.map((element, index) => {
                    return (
                      <>
                        <Col xs={12} md={3}>
                          <Card key={index} className={`responsive-card mb-3`} >
                            <Card.Header className="responsive-card-header cartHeader" style={{ "background-color": "antiquewhite" }}>
                              <OverlayTrigger
                                className={"left-div"}
                                placement="top"
                                overlay={<Tooltip>{element.product_name}</Tooltip>}><span className='labelCardStyle'>
                                  {element.product_name}
                                </span></OverlayTrigger>
                              <OverlayTrigger
                                className={"right-div"}
                                placement="top"
                                overlay={<Tooltip>{"Delete"}</Tooltip>}><span>
                                  <Image width={"17px"} className={`table-icon`} src={deleteIcon} onClick={() => handleDelete(element)}></Image>
                                </span></OverlayTrigger>
                            </Card.Header>
                            <div className='square-container'>
                              <Card.Img variant="top" className='image' src={`http://localhost:5000/productmaster/user/image/${element.filename}`} />
                            </div>
                            <Card.Body style={{ "background-color": "antiquewhite" }}>
                              <Row>
                                <RatingStars count={element.rating} />
                              </Row>
                              <Row className='mx-1'>
                                Price : Rs. {element.price}
                              </Row>
                              <Row className='mx-1'>
                                Qty Ordered : {element.buyQty}
                              </Row>
                              <Row className='mx-1'>
                                Total Amount : Rs. {element.totalAmount}
                              </Row>
                              <Row className='mx-1'>
                                Delivery Date : {formatDateFromISO(element.deliveryDate)}
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                      </>
                    )
                  })
                }
              </>
            </Row>
          }
          {data.length === 0 &&
            <NoData msg={["No Data To Display"]} />
          }
        </Container>
      </Container>
      <Footer />
    </>
  )
}
