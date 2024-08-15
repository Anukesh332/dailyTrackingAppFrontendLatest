import React, { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap';
import Alert from "../common/Alert";
import { getDeliveredProducts } from '../../services/buyproduct-service';
import ResponsiveTable from "../common/ResponsiveGrid/ResponsiveTable";
import { formatDateFromISO } from '../../helpers/utility';

export default function DeliveredProducts() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

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
            const result = await getDeliveredProducts();
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

    let icons = []

    return (
        <>
            {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
            <Container bsPrefix="main-header-dashboard">
                <h1 className='titleOfPage mb-3'>Done With Delivery</h1>
                <Container bsPrefix="main-body-dashboard">
                    <ResponsiveTable data={data} headers={headers} icons={icons} setReload={() => { setReload(!reload) }} DisplayColumnChooser={true} />
                </Container>
            </Container>
        </>
    )
}
