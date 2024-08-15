import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import { getAllProducts } from '../../services/product-service';
import NoData from "../common/NoData";
import { Row, Col, Container, Spinner, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Alert from "../common/Alert";
import { calculateDate } from '../../helpers/utility';
import { addToCart } from '../../services/cart-service';
import constants from '../../helpers/constants';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RatingStars from '../common/RatingStars';
import Footer from '../base/Footer';
import SearchBar from '../common/SearchBar';

export default function CustomerProducts() {

  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    try {
      const result = await getAllProducts();
      setData(result.data);
      setFilteredData(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert("error", error);
    };
    setReload(false);
  }

  useEffect(() => {
    getProducts();
  }, [reload])

  const handleAddToCart = (element) => {
    delete element.PK;
    element.setSk = element.SK;
    delete element.SK;
    element.date = calculateDate();
    element.cartAddedBy = sessionStorage.getItem('user_email');
    let confirmationMessage = "Are you sure do you want to Add to Cart?";
    let title = "Add to Cart";
    MySwal.fire({
      title: title,
      html: confirmationMessage,
      ...constants.CONFIRMATION_BOX_CONFIG
    }).then(async (selection) => {
      if (selection.isConfirmed) {
        setReload(true);
        let response = await addToCart(element).catch((err) => {
          Alert("danger", err);
        });
        if (response) {
          const message = "Added to Cart Successfully"
          Alert("success", message);
        } else {
          Alert("warning", "Already Added to Cart");
        };
      }
    })
  }

  return (
    <>
      {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
      <Container bsPrefix="main-header-dashboard">
        <Row className='align-items-center'>
          <Col>
            <h1 className='titleOfPage mb-3'>Shop Now</h1>
          </Col>
          <Col>
            <SearchBar data={data} setFilteredData={setFilteredData} />
          </Col>
        </Row>
        <Container bsPrefix="main-body-dashboard">
          {filteredData.length !== 0 &&
            <Row>
              <>
                {
                  filteredData.map((element, index) => {
                    return (
                      <>
                        <Col xs={12} md={3}>
                          <Card key={index} className={`responsive-card mb-3`} >
                            <Card.Header className="responsive-card-header" style={{ "background-color": "antiquewhite" }}>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>{element.product_name}</Tooltip>}><span className='labelCardStyle me-5'>
                                  {element.product_name}
                                </span></OverlayTrigger>
                            </Card.Header>
                            <div className='square-container'>
                              <Card.Img variant="top" className='image' src={`http://localhost:5000/productmaster/user/image/${element.filename}`} />
                            </div>
                            <Card.Body style={{ "background-color": "antiquewhite" }}>
                              <Card.Title>
                                <Row>
                                  <RatingStars count={element.rating} />
                                </Row>
                              </Card.Title>
                              <Card.Text className='labelCardStyle'>
                                Rs {element.price}
                              </Card.Text>
                              <Button onClick={() => handleAddToCart(element)}><span className="custom-btn-label">Add to Cart</span></Button>
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
          {filteredData.length === 0 &&
            <NoData msg={["No Data To Display"]} />
          }
        </Container>
      </Container>
      <Footer />
    </>
  )
}
