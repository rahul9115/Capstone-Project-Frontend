import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import config from "./config";
import Widget from "../../../components/Widget";
import ApexChart from "react-apexcharts";
import s from "./Charts.module.scss";
import { chartData } from "./mock";
import Sparklines from "../../../components/Sparklines";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/themeRiver";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import axios from "axios";
import { Table } from "reactstrap";

exporting(Highcharts);
exportData(Highcharts);

const Charts = () => {
  const [cd, setCd] = useState(chartData);
  const [liveChart, setLiveChart] = useState(null);
  const [newsTable, setNewsTable] = useState([]);
  const [initEchartsOptions] = useState({
    renderer: "canvas",
  });
  const [sparklineData] = useState({
    series: [{ data: [1, 7, 3, 5, 7, 8] }],
    options1: {
      colors: ["#db2a34"],
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
    },
    options2: {
      colors: ["#2477ff"],
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
    },
  });

  useEffect(() => {
    const colors = config.chartColors;
  
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api");
        const { Datetime, Open, Forecasted, length, p10, p50, p90,HDatetime,History,NewsDatetime,News, Sentiment} = response.data;
        const combinedData = [];
        const historyData = [];
        const newsData = [];
        console.log("The data", Datetime, Open, Forecasted, length);
  
        // Combine both Open and Forecasted into one array
        for (let i = length - 20; i < length; i++) {
          combinedData.push({
            x: new Date(Datetime[i]).getTime(), // Convert datetime to timestamp
            y: Open[i],
            color: "#ADD8E6", // Light Blue for Actual Data
            name: "Actual Data"
          });
        }

        for (let i = length + 1; i < Datetime.length; i++) {
          combinedData.push({
            x: new Date(Datetime[i]).getTime(), // Convert datetime to timestamp
            y: Forecasted[i],
            color: "#db2a34", // Red for Forecasted Data
            name: ""
          });
        }

        
        console.log("Here",HDatetime,History)
        for (let i = 0; i < HDatetime.length; i++) {
          historyData.push({
            x: new Date(HDatetime[i]).getTime(), // Convert datetime to timestamp
            y: History[i],
            color: "#28a745", // Red for Forecasted Data
            name: "Forecasted Data"
          });
        }

        for (let i = 0; i < NewsDatetime.length; i++) {
          newsData.push({
            datetime: new Date(NewsDatetime[i]).toLocaleString(),
            news: News[i],
            sentiment: Sentiment[i],
          });
        }
       
        
        // for (let i = length + 1; i < Datetime.length; i++) {
        //   combinedData.push({
        //     x: new Date(Datetime[i]).getTime(), // Convert datetime to timestamp
        //     y: p10[i],
        //     color: "#db2a34", // Red for Forecasted Data
        //     name: "p10"
        //   });
        // }
        // for (let i = length + 1; i < Datetime.length; i++) {
        //   combinedData.push({
        //     x: new Date(Datetime[i]).getTime(), // Convert datetime to timestamp
        //     y: p50[i],
        //     color: "#db2a34", // Red for Forecasted Data
        //     name: "p50"
        //   });
        // }
        // for (let i = length + 1; i < Datetime.length; i++) {
        //   combinedData.push({
        //     x: new Date(Datetime[i]).getTime(), // Convert datetime to timestamp
        //     y: p90[i],
        //     color: "#db2a34", // Red for Forecasted Data
        //     name: "p90"
        //   });
        // }
        const liveChartConfig = {
          chart: {
            backgroundColor: "transparent",
            height: 350,
            type: "spline",
            animation: Highcharts.svg,
            marginRight: 10,
          },
          time: {
            useUTC: false,
          },
          credits: { enabled: false },
          title: false,
          xAxis: {
            type: "datetime",
            tickPixelInterval: 150,
            labels: { style: { color: colors.textColor } },
            lineWidth: 0,
            tickWidth: 0,
          },
          yAxis: {
            title: { enabled: false },
            plotLines: [
              {
                value: 0,
                width: 1,
                color: colors.textColor,
              },
            ],
            labels: { style: { color: colors.textColor } },
            gridLineColor: colors.gridLineColor,
          },
          tooltip: {
            headerFormat: "<b>{point.name}</b><br/>",
            pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
          },
          legend: { enabled: false },
          series: [
            {
              name: "Combined Data",
              data: combinedData,
              type: "spline",
              // The colors are already set in each data point
            },
            {
              name: "History Data",
              data: historyData,
              type: "spline",
              // The colors are already set in each data point
            }
          ],
        };
  
        setLiveChart(liveChartConfig);
        setNewsTable(newsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    // Initial fetch
    fetchData();
  
    // Set interval to refetch data every 5 seconds (you can change the interval time)
    const intervalId = setInterval(fetchData, 5000);
  
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Next Gen-AI  - <span className="fw-semi-bold">Day Trading</span>
      </h1>
      <div>
        <Row>
          <Col lg={12} xs={20}>
            <Widget
              title={
                <h5>
                  AAPL <span className="fw-semi-bold">Stock Forecast</span>
                </h5>
              }
              close
              collapse
            >
              {liveChart && <HighchartsReact highcharts={Highcharts} options={liveChart} />}
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col lg={12} xs={20}>
            <Widget
              title={
                <h5>
                  News <span className="fw-semi-bold">and Sentiments</span>
                </h5>
              }
              close
              collapse
            >
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>Datetime</th>
                    <th>News</th>
                    <th>Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {newsTable.map((item, index) => (
                    <tr key={index}>
                      <td>{item.datetime}</td>
                      <td>{item.news}</td>
                      <td>{item.sentiment}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default Charts;
