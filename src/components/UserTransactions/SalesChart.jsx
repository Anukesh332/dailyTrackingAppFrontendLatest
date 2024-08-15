import React, { useEffect, useState } from 'react'
import ReactApexChart from "react-apexcharts";
import { getDateYear, getMonthsBetweenDates, isoToDateFormat } from '../../helpers/utility';
import NoData from "../common/NoData";

export default function SalesChart(props) {

    let monthsAssigned = getMonthsBetweenDates(props.filterDate);
    const [series, setSeries] = useState([]);

    const options = {
        chart: {
            width: '100%',
            type: 'line',
            toolbar: {
                show: false,
            }
        },
        xaxis: {
            categories: monthsAssigned,
            title: {
                text: "Month",
            },
            axisBorder: {
                show: true,
            },
        },
        yaxis: {
            title: {
                text: "Sales",
            },
            axisBorder: {
                show: true,
            },
        },
        markers: {
            size: 5
        },
    };

    const sumMoneyByMonthYear = (data, monthsAssigned) => {
        let arr2 = monthsAssigned.map(([month, year]) => {
            const sum = data.reduce((acc, curr) => {
                let dateArr = isoToDateFormat(curr.deliveryDate);
                let dateArrOg = getDateYear(dateArr);
                if (dateArrOg[0] == month && dateArrOg[1] == year) {
                    acc += curr.totalAmount;
                }
                return acc;
            }, 0);
            return sum;
        });
        return arr2;
    };

    useEffect(() => {
        const series = sumMoneyByMonthYear(props.data, monthsAssigned);
        setSeries(series);
    }, [props.reload, props.data]);

    return (
        <>
            {series.length != 0 ? <ReactApexChart options={options} series={[{ data: series }]} type="line" height={300} /> : <NoData msg={["No Sales To Display"]} />}
        </>
    )
}
