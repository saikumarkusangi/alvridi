"use client";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ChartOne from '@/components/Charts/ChartOne';
import ChartTwo from '@/components/Charts/ChartTwo';
import ChartThree from '@/components/Charts/ChartThree';
import Loader from '@/components/common/Loader';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import MapOne from '@/components/Maps/MapOne';
import { ICompany } from '@/models/company';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChartFive from '@/components/Charts/ChartFive';
import { useUserStore } from '@/zustand/store';

const CompanyDetails: React.FC = () => {
  const { companyName } = useParams();
  const [company, setCompany] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Global Investments'); 
  const { email } = useUserStore();

  useEffect(() => {
    if (companyName) {
      const fetchCompanyDetails = async () => {
        try {
          const response = await axios.get(`/api/companies/${companyName}`);
          if (response.status !== 200) throw new Error('Network response was not ok');
          setCompany(response.data['data']);
        } catch (error) {
          setError('Failed to fetch company details.');
        } finally {
          setLoading(false);
        }
      };
      fetchCompanyDetails();
    }
  }, [companyName]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Global Investments':
        return <MapOne data={company} />;
      case 'Thematic Overview':
        // Calculate theme sums
        const themeSums: Record<string, number> = {};
        company.forEach(item => {
          const theme = item.theme ?? 'Unknown Theme';
          const value = item.themeCapitalCatalyzedM ?? 0;
          if (!themeSums[theme]) {
            themeSums[theme] = 0;
          }
          themeSums[theme] += value;
        });

        const chartData = [{
          name: 'Theme Capacity',
          data: Object.entries(themeSums).map(([name, sum]) => ({
            x: name,
            y: sum,
          })),
        }];

        // Calculate individual country sums
        const individualCountrySums: Record<string, number> = {};
        const countryThemes: Record<string, string> = {}; // Track themes for individual countries

        company.forEach(item => {
          const country = item.country ?? 'Unknown Country';
          const theme = item.theme ?? 'Unknown Theme';
          const value = item.themeCapitalCatalyzedM ?? 0;

          if (!individualCountrySums[country]) {
            individualCountrySums[country] = 0;
            countryThemes[country] = theme; // Set the theme for the country
          }

          individualCountrySums[country] += value;
        });

        // Create chart data for individual countries
        const individualChartData = Object.entries(individualCountrySums).map(([name, sum]) => ({
          x: name,
          y: sum,
          z: countryThemes[name], // Get the theme associated with the country
        }));

        return (
          <div className='flex flex-col gap-10'>
            <ChartTwo countryName={null} series={chartData} />
            <span className="flex">
              <strong className="text-black pr-2">Summary: </strong>
              {Object.entries(
                company.reduce((acc: Record<string, number>, item) => {
                  const theme = item.theme ?? 'Unknown Theme';
                  const value = item.themeCapitalCatalyzedM ?? 0;
                  acc[theme] = (acc[theme] || 0) + value;
                  return acc;
                }, {})
              ).map(([theme, totalValue]) => (
                `${theme} has the highest capital catalyzed at ${totalValue} Million`
              )).join(', ')}
            </span>

            <h2 className='text-black text-2xl'>Individual Countries Overview</h2>
            <div className='grid pr-2 gap-10 grid-cols-2'>
              {individualChartData.map((countryData, index) => (
                <div key={index} className='gap-2 flex justify-center flex-col'>
                  <h2 className='text-black text-xl text-center justify-center flex font-bold'>{countryData.x}</h2>
                  <ChartTwo
                    countryName={null}
                    series={[{
                      name: `${countryData.x} Overview`,
                      data: [{
                        x: countryData.z,
                        y: countryData.y,
                      }],
                    }]}
                  />
                </div>
              ))}
            </div>
          </div>
        );


      case 'Funds Overview':
        const series: number[] = []; // To hold the fund sizes for the chart
        const fundSizeMap: { [key: string]: number } = {}; // To hold the sum of fund sizes by fund label
        const fundLabels: string[] = []; // To hold the fund labels for the chart

        // Iterate over the company data
        company.forEach(item => {
          const fundLabel = item.fund ?? 'Unknown Fund'; // Get fund label
          const value = item.fundSizeM ?? 0; // Get fund size

          // Accumulate the values for each fund label
          if (fundSizeMap[fundLabel]) {
            fundSizeMap[fundLabel] += value; // Sum the fund size if the label already exists
          } else {
            fundSizeMap[fundLabel] = value; // Initialize with the fund size
          }
        });

        // Convert the accumulated object back to arrays for series and fundLabels
        for (const label in fundSizeMap) {
          series.push(fundSizeMap[label]); // Add the summed values
          fundLabels.push(label); // Add the corresponding label
        }

        // Pass populated series and fundLabels to ChartThree
        return <ChartThree series={series} fundLabels={fundLabels} />;


      case 'Emission Overview':
        // Map over each company item to create chart data for each country
        return (
          <div className='grid pr-2 gap-10 grid-cols-2'>
            {company.map((item, index) => (
              <div key={index} className='gap-2 flex justify-center flex-col'>

                <ChartFive
                  countryName={item.country ?? 'Unknown Country'}
                  series={[
                    {
                      name: `${item.country ?? 'Unknown Country'} Overview`,
                      data: [
                        { x: 'Total Emissions', y: item.totalEmissionsCO2e ?? 0 },
                        { x: 'Scope 1 Emissions', y: item.scope1EmissionsCO2e ?? 0 },
                        { x: 'Scope 2 Emissions', y: item.scope2EmissionsCO2e ?? 0 },
                        { x: 'Scope 3 Emissions', y: item.scope3EmissionsCO2e ?? 0 },
                      ]
                    }
                  ]}
                />
              </div>
            ))}
          </div>
        );


      default:
        return null;
    }
  };

  async function addToWatchList(companyName: string) {
    try {
      const res = await axios.post('/api/watchList', {
        companyName,
        email
      });
      console.log("Company added to watch list:", res.data);
    } catch (error) {
      console.error("Failed to add company to watch list:", error);
    }
  }

  return (
    <DefaultLayout session={null}>
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/companies">
              Companies /
            </Link>
          </li>
          <li className="font-medium text-primary">{decodeURIComponent(Array.isArray(companyName) ? companyName[0] : companyName)}</li>
        </ol>
      </nav>

      <div className="my-6 flex  gap-3  items-center justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {decodeURIComponent(Array.isArray(companyName) ? companyName[0] : companyName)}
        </h2>
        <button onClick={() => addToWatchList(company[0].companyName!)} className='border border-primary p-2 text-primary hover:bg-primary hover:text-white flex items-center font-semibold gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          Add to WatchList
        </button>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="tabs flex space-x-4 border-b">
            <button className={`py-2 px-4 ${activeTab === 'Global Investments' ? 'border-primary border-b-2 font-semibold' : ''}`} onClick={() => setActiveTab('Global Investments')}>
              Global Investments
            </button>
            <button className={`py-2 px-4 ${activeTab === 'Thematic Overview' ? 'border-primary border-b-2 font-semibold' : ''}`} onClick={() => setActiveTab('Thematic Overview')}>
              Thematic Overview
            </button>
            <button className={`py-2 px-4 ${activeTab === 'Funds Overview' ? 'border-primary border-b-2 font-semibold' : ''}`} onClick={() => setActiveTab('Funds Overview')}>
              Funds Overview
            </button>
            <button className={`py-2 px-4 ${activeTab === 'Emission Overview' ? 'border-primary border-b-2 font-semibold' : ''}`} onClick={() => setActiveTab('Emission Overview')}>
              Emission Overview
            </button>
          </div>

          <div className="mt-6">{renderContent()}</div>
        </>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}
    </DefaultLayout>
  );
};

export default CompanyDetails;
