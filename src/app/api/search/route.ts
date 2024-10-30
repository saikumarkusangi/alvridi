import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../config/dbConnect';
import Company from '../../../models/company';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Extract the search query from the request URL
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get('query') || ''; // Default to empty string if no query

        // Find companies where the name contains the search term (case-insensitive)
        const companies = await Company.find({
            companyName: { $regex: searchTerm, $options: 'i' } // 'i' for case-insensitive
        }).select('companyName _id'); // Select only the companyName and ID

        // Create a Set to filter unique company names
        const uniqueCompaniesMap = new Map();
        companies.forEach(company => {
            if (!uniqueCompaniesMap.has(company.companyName)) {
                uniqueCompaniesMap.set(company.companyName, company); // Add unique company
            }
        });

        // Convert the Map values back to an array
        const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

        return NextResponse.json({ success: true, data: uniqueCompanies }, { status: 200 });
    } catch (error) {
        // Type assertion to handle unknown type
        const errorMessage = (error as Error).message || "An unexpected error occurred";
        console.error("Error getting data:", errorMessage);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
