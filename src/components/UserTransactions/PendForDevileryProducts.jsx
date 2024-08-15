import React, { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap';
import Alert from "../common/Alert";
import checkIcon from "../../assets/images/check2-all.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import constants from '../../helpers/constants';
import { buyProduct, getDeliveryPendingProducts } from '../../services/buyproduct-service';
import ResponsiveTable from "../common/ResponsiveGrid/ResponsiveTable";
import { formatDateFromISO } from '../../helpers/utility';

export default function PendForDeliveryProducts() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const MySwal = withReactContent(Swal);

    const [headers] = useState([
        { displayName: "Order Placed By", columnName: "cartAddedBy", dataType: "text", width: 200, displayIndication: true, required: true },
        { displayName: "Product Name", columnName: "product_name", dataType: "text", width: 200, displayIndication: true, required: true },
        { displayName: "Price", columnName: "price", dataType: "text", width: 170, displayIndication: true, required: true },
        { displayName: "Buyed Qty", columnName: "buyQty", dataType: "text", width: 170, displayIndication: true, required: true },
        { displayName: "Total Amount", columnName: "totalAmount", dataType: "text", width: 170, displayIndication: true, required: true },
        { displayName: "Delivery Date", columnName: "deliveryDate", dataType: "date", width: 160, displayIndication: true, required: true, formatter: formatDateFromISO },
    ])

    const getDevPendProducts = async () => {
        setLoading(true);
        try {
            const result = await getDeliveryPendingProducts();
            setData(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert("error", error);
        };
    }

    useEffect(() => {
        getDevPendProducts();
    }, [reload])


    const handleCheck = (element) => {
        MySwal.fire({
            title: "Done with Delivery",
            html: "Are you sure that you are done with Delivery?",
            ...constants.CONFIRMATION_BOX_CONFIG
        }).then(async (selection) => {
            if (selection.isConfirmed) {
                setLoading(true);
                element.status = "DeliveryDone"
                let response = await buyProduct(element).catch((error) =>
                    console.log(error)
                );
                if (response) {
                    Alert("success", "Done with Delivery.")
                    setReload(!reload);
                }
                setLoading(false);
                setReload(!reload)
            }
        })
    };

    let icons = [{ src: checkIcon, click: handleCheck, iconName: "Done" }]


    return (
        <>
            {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
            <Container bsPrefix="main-header-dashboard">
                <h1 className='titleOfPage mb-3'>Pending For Delivery</h1>
                <Container bsPrefix="main-body-dashboard">
                    <ResponsiveTable data={data} headers={headers} icons={icons} setReload={() => { setReload(!reload) }} DisplayColumnChooser={true} />
                </Container>
            </Container>
        </>
    )
}
