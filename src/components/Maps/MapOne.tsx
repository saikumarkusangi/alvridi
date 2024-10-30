  "use client";
  import jsVectorMap from "jsvectormap";
  import "jsvectormap/dist/jsvectormap.css";
  import React, { useEffect } from "react";
  import "../../js/world";
  import { ICompany } from "@/models/company";
  import {countriesInfo} from '../../js/countriesInfo';


  const MapOne: React.FC<{ data: ICompany[] }> = ({ data = []}) => {
    useEffect(() => {
      
      const markers = data.map((company) => {
        const countryInfo = countriesInfo.find(
          (country) => country.name === company.country
        );

        return countryInfo
          ? {
              name: company.country, // Use company name as label
              coords: countryInfo.latlng,
              style: {
                initial: {
                  fill: 'red'
                }
              }
            }
          : null;
      }).filter(Boolean); // Remove null entries

      const mapOne = new jsVectorMap({
        selector: "#mapOne",
        map: "world",
        zoomButtons: true,

        markers: markers, // Use the dynamically created markers

        labels: {
          markers: {
            render(marker: { name: any; labelName: any }, index: any) {
              return marker.name || marker.labelName || "Not available";
            },
          },
        },

        regionStyle: {
          initial: {
            fill: "#C8D0D8",
          },
          hover: {
            fillOpacity: 1,
            fill: "#0000FF",
          },
        },
        regionLabelStyle: {
          initial: {
            fontFamily: "Satoshi",
            fontWeight: "bold",
            fill: "#fff",
          },
          hover: {
            cursor: "pointer",
          },
        },
      });

      return () => {
        const map = document.getElementById("mapOne");
        if (map) {
          map.innerHTML = "";
        }
        // mapOne.destroy(); // Uncomment if necessary
      };
    }, [data]); // Add data as a dependency

    return (
      <div className="mt-10 max-w-[90%] rounded-sm border border-stroke bg-white px-4 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Global Investment Overview
        </h4>
        <div className="h-100">
          <div id="mapOne" className="mapOne map-btn"></div>
        </div>
      </div>
    );
  };

  export default MapOne;
