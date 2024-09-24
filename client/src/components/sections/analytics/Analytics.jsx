import { useState, useEffect } from "react";
import BarCharts from "./barChart/BarChart";
import PieCharts from "./pieChart/PieChart";
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotLogged from "../NotLogged/NotLogged";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [activeChart, setActiveChart] = useState("pie");
  const { token, subjects } = useSelector((state) => state.user);

  useEffect(() => {
    const analyticsData = subjects.map(sub => ({
      subject: sub.name,
      value: sub.amount,
      timeSpent: (sub.timeSpent / 3600000).toFixed(2)
    }));
    const processedData = processData(analyticsData);
    setData(processedData);
  }, [subjects]);

  const processData = (rawData) => {
    const sortedData = rawData.sort((a, b) => b.value - a.value);
    const topSubjects = sortedData.slice(0, 9);
    const restValue = sortedData.slice(9).reduce((sum, item) => sum + item.value, 0);
    const restTimeSpent = sortedData.slice(9).reduce((sum, item) => sum + item.timeSpent, 0);

    if (restValue > 0 || restTimeSpent > 0) {
      topSubjects.push({ subject: "Rest", value: restValue, timeSpent: restTimeSpent });
    }

    return topSubjects;
  };

  const handleChartChange = (chartType) => {
    setActiveChart(chartType);
  };

  const getChartData = () => {
    const newData = activeChart === "pie" ? data.sort((a, b) => b.timeSpent - a.timeSpent) : data;

    return newData.map(item => ({
      done: item.subject,
      value: activeChart === "pie" ? item.value : item.timeSpent
    }));
  };

  const chartConfig = Object.fromEntries(
    data.map((item, index) => [
      item.subject,
      {
        label: item.subject,
        color: `hsl(${index * 30}, 70%, 50%)`
      }
    ])
  );

  return (
    <>
      {token ? (
        <div className="flex-grow p-4 overflow-auto">
          <h1 className="text-xl font-extrabold text-gray-900 mb-4 dark:text-gray-200">
            Analytics Overview
          </h1>

          <div className="mb-4 flex space-x-2">
            <Button
              onClick={() => handleChartChange("pie")}
              variant={activeChart === "pie" ? "default" : "outline"}
              size="sm"
              className={`
                dark:text-gray-200 
                ${activeChart === "pie"
                  ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500'
                }
              `}
            >
              Task Distribution
            </Button>
            <Button
              onClick={() => handleChartChange("bar")}
              variant={activeChart === "bar" ? "default" : "outline"}
              size="sm"
              className={`
                dark:text-gray-200 
                ${activeChart === "bar"
                  ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500'
                }
              `}
            >
              Time Spent Distribution
            </Button>
          </div>

          <p className="text-md text-gray-600 dark:text-gray-200 mb-4">
            Data analysis based on your recent activities
          </p>

          <div className="chart-section bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-3/4 lg:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {activeChart === "pie" ? "Task Distribution" : "Time Spent Distribution"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Top subjects based on {activeChart === "pie" ? "task count" : "time spent"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeChart === "pie" ? (
                  <PieCharts data={getChartData()} chartConfig={chartConfig} />
                ) : (
                  <BarCharts data={getChartData()} chartConfig={chartConfig} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <NotLogged />
      )}
    </>
  );
};

export default Analytics;