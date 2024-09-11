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

exporting(Highcharts);
exportData(Highcharts);

const Charts = () => {
  const [cd, setCd] = useState(chartData);
  const [liveChart, setLiveChart] = useState(null);
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
        const { Datetime, Open, Forecasted, length } = response.data;
        const combinedData = [];
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
            name: "Forecasted Data"
          });
        }
  
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
          ],
        };
  
        setLiveChart(liveChartConfig);
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
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h5>
                  Echarts <span className="fw-semi-bold">Line Chart</span>
                </h5>
              }
              close
              collapse
            >
              <ReactEchartsCore
                echarts={echarts}
                option={cd.echarts.line}
                opts={initEchartsOptions}
                style={{ height: "365px" }}
              />
            </Widget>
          </Col>
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h5>
                  Highcharts <span className="fw-semi-bold">Line Chart</span>
                </h5>
              }
              close
              collapse
            >
              <HighchartsReact options={cd.highcharts.mixed} />
              <h5 className="mt">
                Interactive <span className="fw-semi-bold">Sparklines</span>
              </h5>
              <Row className="mt">
                <Col md={6} xs={12}>
                  <div className="stats-row">
                    <div className="stat-item">
                      <p className="value5 fw-thin">34 567</p>
                      <h6 className="name text-muted m0 fs-mini">
                        Overall Values
                      </h6>
                    </div>
                    <div className="stat-item stat-item-mini-chart">
                      <Sparklines
                        options={sparklineData.options2}
                        width={80}
                        height={25}
                        data={sparklineData.series}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6} xs={12}>
                  <div className="stats-row">
                    <div className="stat-item">
                      <p className="value5 fw-thin">34 567</p>
                      <h6 className="name text-muted m0 fs-mini">
                        Overall Values
                      </h6>
                    </div>
                    <div className="stat-item stat-item-mini-chart">
                      <Sparklines
                        options={sparklineData.options1}
                        width={80}
                        height={25}
                        data={sparklineData.series}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Row>
              <Col lg={6} xs={12}>
                <Widget
                  title={
                    <h5>
                      Apex <span className="fw-semi-bold">Monochrome Pie</span>
                    </h5>
                  }
                  close
                  collapse
                >
                  <ApexChart
                    className="sparkline-chart"
                    type={"pie"}
                    height={200}
                    series={cd.apex.pie.series}
                    options={cd.apex.pie.options}
                  />
                </Widget>
              </Col>
              <Col lg={6} xs={12}>
                <Widget
                  title={
                    <h5>
                      Chart <span className="fw-semi-bold">Donut Chart</span>
                    </h5>
                  }
                  close
                  collapse
                >
                  <ReactEchartsCore
                    echarts={echarts}
                    option={cd.echarts.donut}
                    opts={initEchartsOptions}
                    style={{ height: "170px" }}
                  />
                </Widget>
              </Col>
              <Col lg={12} xs={12}>
                <Widget
                  title={
                    <h5>
                      Highcharts{" "}
                      <span className="fw-semi-bold">Live Chart</span>
                    </h5>
                  }
                  close
                  collapse
                >
                  {/* This part is used for additional charts */}
                </Widget>
              </Col>
            </Row>
          </Col>
          <Col lg={12} xs={12}>
            <Widget
              title={
                <h5>
                  Echarts <span className="fw-semi-bold">River Chart</span>
                </h5>
              }
              close
              collapse
            >
              <ReactEchartsCore
                echarts={echarts}
                option={cd.echarts.river}
                opts={initEchartsOptions}
                style={{ height: "350px" }}
              />
            </Widget>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Charts;
