import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import { deleteProduct, deleteUploadProductImg, getAllSellerProducts } from '../../services/product-service';
import NoData from "../common/NoData";
import { Row, Col, Container, Button, Spinner, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AddEditProduct from '../UserTransactions/AddEditProduct';
import editIcon from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/delete.svg";
import constants from '../../helpers/constants';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Alert from "../common/Alert";
import RatingStars from '../common/RatingStars';
import Footer from '../base/Footer';

export default function SellerProducts() {

    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [action, setAction] = useState("");
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState(false);
    const MySwal = withReactContent(Swal);

    const getSellerProducts = async () => {
        setLoading(true);
        try {
            const result = await getAllSellerProducts();
            setData(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert("error", error);
        };
    }

    useEffect(() => {
        getSellerProducts();
    }, [reload])

    const handleAdd = () => {
        setAction("Add");
        setShowForm(true);
    };

    // const handleEdit = (element) => {
    //     setAction("Edit");
    //     setShowForm(true);
    //     setRowData(element);
    // };

    const handleDelete = (element) => {
        MySwal.fire({
            title: "Delete Product",
            html: "Are you sure you want to delete this Product?",
            ...constants.CONFIRMATION_BOX_CONFIG
        }).then(async (selection) => {
            if (selection.isConfirmed) {
                setLoading(true);
                let response = await deleteProduct(element).catch((error) =>
                    console.log(error)
                );
                let response2 = await deleteUploadProductImg(element.filename).catch((error) =>
                    console.log(error)
                );
                if (response && response2) {
                    Alert("success", "Product deleted successfully.")
                    setReload(!reload);
                }
                setLoading(false);
                setReload(!reload)
            }
        })
    };

    return (
        <>
            {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
            <Container bsPrefix="main-header-dashboard">
                <h1 className='titleOfPage mb-3'>My Products</h1>
                <Container bsPrefix="main-body-dashboard">
                    <Button className={`mb-3`} onClick={handleAdd}><span className="custom-btn-label">Add New Product</span></Button>
                    {showForm && (
                        <AddEditProduct
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
                                                                overlay={<Tooltip>{element.date}</Tooltip>}><span className='me-5'>
                                                                    {element.date}
                                                                </span></OverlayTrigger>
                                                            <OverlayTrigger
                                                                className={"right-div"}
                                                                placement="top"
                                                                overlay={<Tooltip>{"Delete"}</Tooltip>}><span>
                                                                    <Image width={"17px"} className={`table-icon ms-5`} src={deleteIcon} onClick={() => handleDelete(element)}></Image>
                                                                </span></OverlayTrigger>
                                                        </Card.Header>
                                                        <div className='square-container'>
                                                            <Card.Img variant="top" className='image' src={`http://localhost:5000/productmaster/user/image/${element.filename}`} />
                                                        </div>
                                                        <Card.Body style={{ "background-color": "antiquewhite" }}>
                                                            <Row>
                                                                <RatingStars count={element.rating} />
                                                            </Row>
                                                            <Card.Title>
                                                                <Row className='labelCardStyle'>
                                                                    <Col lg={9} md={9} sm={9}>{element.product_name}</Col>
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
                    {data.length === 0 &&
                        <NoData msg={["No Data To Display"]} />
                    }
                </Container>
            </Container>
            <Footer />
        </>
    )
}
