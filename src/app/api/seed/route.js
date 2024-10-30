import dbConnect from '../../../config/dbConnect';
import Company from '../../../models/company';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  try {
    await dbConnect();

    const results = [];
    const filePath = path.join(process.cwd(), 'data', 'dummy_sample.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push({
          companyId: row['Company ID'],
          companyName: row['Company Name'],
          fund: row['Fund'],
          investmentM: parseFloat(row['Investment ($M)']),
          fundSizeM: parseFloat(row['Fund Size ($M)']),
          totalCapitalCommittedB: parseFloat(row['Total Capital Committed ($B)']),
          fundInvestments: parseInt(row['Fund Investments']),
          globalSouthDealsFunded: parseInt(row['Global South Deals Funded']),
          globalSouthCountriesSupported: parseInt(row['Global South Countries Supported']),
          country: row['Country'],
          countryCapitalCatalyzedM: parseFloat(row['Country Capital Catalyzed ($M)']),
          theme: row['Theme'],
          themeCapitalCatalyzedM: parseFloat(row['Theme Capital Catalyzed ($M)']),
          totalEmissionsCO2e: parseInt(row['Total Emissions by Fund (tons of CO2e)']),
          scope1EmissionsCO2e: parseInt(row['Scope 1 Emissions (tons of CO2e)']),
          scope2EmissionsCO2e: parseInt(row['Scope 2 Emissions (tons of CO2e)']),
          scope3EmissionsCO2e: parseInt(row['Scope 3 Emissions (tons of CO2e)']),
        });
      })
      .on('end', async () => {

        await Company.insertMany(results);
        NextResponse.json({ message: 'Data seeded successfully' });

      });
  } catch (error) {
    return NextResponse.json({ error: 'Error seeding data' });
  }
}
