import { useState,useEffect }  from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                gridLines: {
                    display: false,
                },
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: true,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return value >= 1000000 ?  numeral(value).format("0.0a") : numeral(value).format("0");
                    },
                },
            },
        ],
    },
};
function LineGraph({casesType, ...props}) {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data.cases){
            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data['cases'][date] - lastDataPoint
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response => response.json())
        .then((data) => {
            const chartData = buildChartData(data,casesType);
            setData(chartData);
            console.log(chartData);
        })
    }, [casesType]);


    return (
        <div className={props.className}>
            {data?.length > 0 &&
                <Line 
                    data={{
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />            
            }
        </div>
    )
}

export default LineGraph;
