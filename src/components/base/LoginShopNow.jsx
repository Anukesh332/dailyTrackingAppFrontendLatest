import React, { useEffect, useState } from 'react'
import { Card, Container, Navbar, OverlayTrigger, Popover, Row, Col, Spinner, Button, Tooltip } from "react-bootstrap";
import person from "../../assets/images/person.svg"
import { ReactSVG } from "react-svg";
import hamburgerIcon from "../../assets/images/hamburger.svg";
import { getAllProductsNoUser } from '../../services/product-service';
import NoData from "../common/NoData";
import Alert from "../common/Alert";
import { calculateDate } from '../../helpers/utility';
import { addToCart } from '../../services/cart-service';
import constants from '../../helpers/constants';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RatingStars from '../common/RatingStars';
import Footer from '../base/Footer';
import SearchBar from '../common/SearchBar';

export default function LoginShopNow(props) {

    const showLogin = () => {
        props.setWantLogin();
    }

    const MySwal = withReactContent(Swal);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    const getProducts = async () => {
        setLoading(true);
        try {
            const result = await getAllProductsNoUser();
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

    return (
        <>
            <Row bsPrefix={`home closed`}>
                <Col bsPrefix="center-panel">
                    <Navbar bsPrefix="header">
                        <ReactSVG className="head-toggle" fill="#084CE8" src={hamburgerIcon} />
                        <div className="app-name">DailyTrackingApp</div>
                        <div className="user-section" onClick={showLogin}>
                            <ReactSVG className="user-logo" src={person} />
                            <OverlayTrigger trigger="click" placement="bottom" rootClose>
                                <div className="user-name">
                                    Sign In
                                </div>
                            </OverlayTrigger>
                        </div>
                    </Navbar>
                    <Container bsPrefix="main" style={{ "marginTop": "60px" }}>
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
                    </Container>
                </Col>
            </Row>
        </>
    )
}
