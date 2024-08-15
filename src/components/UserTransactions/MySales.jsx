import React, { useEffect, useState } from 'react'
import { Container, Spinner, Col, Button, Row } from 'react-bootstrap';
import Alert from "../common/Alert";
import { getDeliveredProductsGraph } from '../../services/buyproduct-service';
import DatePicker from "../common/DatePicker";
import { convertDateForPicker, convertDateTimetoDateFormat } from '../../helpers/utility';
import SalesChart from './SalesChart';
import NoData from "../common/NoData";

export default function MySales() {

    let date = new Date();
    let threeMonAgoDate = date.setMonth(date.getMonth() - 3);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [filterDate, setFilterDate] = useState({ StartDate: convertDateTimetoDateFormat(threeMonAgoDate), EndDate: convertDateTimetoDateFormat(new Date()) });
    const [finalFilterDate, setFinalFilterDate] = useState({ StartDate: convertDateTimetoDateFormat(threeMonAgoDate), EndDate: convertDateTimetoDateFormat(new Date()) });

    const handleChange = (e, picker) => {
        if (picker) {
            setFilterDate((prev => ({ ...prev, StartDate: picker.startDate.format('MM/DD/YYYY'), EndDate: picker.endDate.format('MM/DD/YYYY') })));
        }
    }

    const handleReset = async () => {
        setFilterDate({ StartDate: convertDateTimetoDateFormat(threeMonAgoDate), EndDate: convertDateTimetoDateFormat(new Date()) });
    }

    const initialSettingsProps = { maxSpan: { 'year': 1 }, startDate: convertDateForPicker(threeMonAgoDate), endDate: convertDateForPicker(new Date()) };

    const getDevDoneProductsFunc = async () => {
        getDevDoneProducts();
        setReload(!reload);
    }

    const getDevDoneProducts = async () => {
        setLoading(true);
        setFinalFilterDate({ StartDate: filterDate.StartDate, EndDate: filterDate.EndDate });
        try {
            let obj = {};
            obj.StartDate = new Date(filterDate.StartDate).toISOString();
            obj.EndDate = new Date(filterDate.EndDate).toISOString();
            const result = await getDeliveredProductsGraph(obj);
            setData(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert("error", error);
        };
    }

    useEffect(() => {
        getDevDoneProducts();
    }, [reload])

    return (
        <>
            {loading && <div className="spinner-box"> <Spinner animation="border" className="spinner"></Spinner></div>}
            <Container bsPrefix="main-header-dashboard">
                <h1 className='titleOfPage mb-3'>My Sales</h1>
                <Row>
                    <Col lg={3} md={5} sm={6}>
                        <DatePicker label="Date range" name={"DatePicker"} value={filterDate} required={true} onChange={handleChange} initialSettingsProps={initialSettingsProps}></DatePicker>
                    </Col>
                    <Col md={1} className="action-btn-col mt-3">
                        <Button onClick={handleReset} variant="outline-primary">Reset</Button>
                    </Col>
                    <Col md={4} className="action-btn-col mt-3">
                        <Button variant="primary" type="submit" onClick={getDevDoneProductsFunc}>
                            Apply
                        </Button>
                    </Col>
                </Row>
                <Container bsPrefix="main-body-dashboard mx-5 my-5">
                    {data.length != 0 ? <SalesChart filterDate={finalFilterDate} data={data} reload={reload} /> : <NoData msg={["No Sales To Display"]} />}
                </Container>
            </Container>
        </>
    )
}
