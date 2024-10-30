"use client";
import { useCompanyStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../common/Loader";
import Link from "next/link";

const TableOne = () => {
  const { companies, loading, error, fetchCompanies } = useCompanyStore();
  const router = useRouter();
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);



  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {
        loading ? <Loader /> : <>


          {companies.length === 0 ? ( // Check if companies array is empty
            <div className="text-center text-gray-500 dark:text-gray-400">
              No companies available.
            </div>
          ) : (
            <div className="flex flex-col ">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Investment (M)</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Total Capital Committed (B)</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Fund Size (M)</h5>
                </div>

              </div>

              {companies.map((company, key) => (
                <Link href={`/company/${company.companyName}`}
                  className={`grid grid-cols-3 sm:grid-cols-5 ${key === companies.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"} cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700`} // Add hover classes here
                  key={company.id}
               
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{company.companyName}</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{company.investmentM}M</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">${company.totalCapitalCommittedB?.toFixed(2)}B</p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-black dark:text-white">{company.fundSizeM}</p>
                  </div>


                </Link>
              ))}
            </div>
          )}
        </>
      }
    </div>
  );
};

export default TableOne;
