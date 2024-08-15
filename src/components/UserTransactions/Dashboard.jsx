import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import { deleteNote, getUserNotes } from '../../services/note-service';
import NoData from "../common/NoData";
import { Row, Col, Container, Button, Spinner, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AddEditNote from '../UserTransactions/AddEditNote';
import editIcon from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/delete.svg";
import constants from '../../helpers/constants';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Alert from "../common/Alert";

export default function Dashboard() {

    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [action, setAction] = useState("");
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState(false);
    const MySwal = withReactContent(Swal);

    const getAllUserNotes = async () => {
        setLoading(true)
        try {
            const result = await getUserNotes()
            setData(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert("error", error);
        };
    }

    useEffect(() => {
        getAllUserNotes();
    }, [reload])

    const handleAdd = () => {
        setAction("Add");
        setShowForm(true);
    };

    const handleEdit = (element) => {
        setAction("Edit");
        setShowForm(true);
        setRowData(element);
    };

    const handleDelete = (element) => {
        MySwal.fire({
            title: "Delete Note",
            html: "Are you sure you want to delete this Note?",
            ...constants.CONFIRMATION_BOX_CONFIG
        }).then(async (selection) => {
            if (selection.isConfirmed) {
                setLoading(true);
                let response = await deleteNote(element).catch((error) =>
                    console.log(error)
                );
                if (response) {
                    Alert("success", "Note deleted successfully.")
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
                <Container bsPrefix="main-body-dashboard">
                    <Button className={`mb-3`} onClick={handleAdd}><span className="custom-btn-label">Add New Note</span></Button>
                    {showForm && (
                        <AddEditNote
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
                                                        <Card.Header className="responsive-card-header cartHeader">
                                                            <OverlayTrigger
                                                                className={"left-div"}
                                                                placement="top"
                                                                overlay={<Tooltip>{element.date}</Tooltip>}><span>
                                                                    {element.date}
                                                                </span></OverlayTrigger>
                                                            <div className={"right-div"}>
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip>{"Edit"}</Tooltip>}><span>
                                                                        <Image width={"17px"} className={`table-icon me-2`} src={editIcon} onClick={() => handleEdit(element)}></Image>
                                                                    </span></OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip>{"Delete"}</Tooltip>}><span>
                                                                        <Image width={"17px"} className={`table-icon`} src={deleteIcon} onClick={() => handleDelete(element)}></Image>
                                                                    </span></OverlayTrigger>
                                                            </div>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Card.Title>
                                                                <Row>
                                                                    <Col lg={9} md={9} sm={9}>Title : {element.title}</Col>
                                                                </Row>
                                                            </Card.Title>
                                                            <Card.Text>
                                                                Note : {element.note}
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
        </>
    )
}
