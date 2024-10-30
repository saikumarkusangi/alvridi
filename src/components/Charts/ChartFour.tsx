import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define the interface for the props
interface ChartFourProps {
  series: {
    name: string; // Name of the theme
    data: {
      x: string; // Theme name (like 'Ocean Conservation' or 'Water Management')
      y: number; // Corresponding value
    }[]; // Array of objects for x and y values
  }[];
}

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: false, // Set to false for grouped columns
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%", // Adjust the width of the columns
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    type: "category", // Set type to category for categorical x-axis
  },
  yaxis: {
    title: {
      text: "Theme Capital Catalyzed ($M)", // Set the Y-axis label
      style: {
        fontSize: '14px', // Customize font size if needed
        fontWeight: 500,
        fontFamily: "Satoshi, sans-serif",
        
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
  },
  fill: {
    opacity: 1,
  },
};

const ChartFour: React.FC<ChartFourProps> = ({ series }) => {
  return (
    <div className=" max-w-[98%] rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Theme Capacity Overview
          </h4>
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={335} />
      <h2 className="flex justify-center font-satoshi text-[14px] font-semibold">Themes</h2>
    </div>
  );
};

export default ChartFour;
