import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../config/dbConnect';
import Company from '../../../models/company';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        // Use aggregation to get unique company names and sum their respective financials
        const companies = await Company.aggregate([
            {
                $group: {
                    _id: "$companyName", // Group by company name
                    investmentM: { $sum: "$investmentM" }, // Sum of investmentM
                    totalCapitalCommittedB: { $sum: "$totalCapitalCommittedB" }, // Sum of totalCapitalCommittedB
                    fundSizeM: { $sum: "$fundSizeM" }, // Sum of fundSizeM
                    companyName: { $first: "$companyName" } // Store the company name for clarity
                }
            }
        ]);

        return NextResponse.json({ success: true, data: companies }, { status: 200 });
    } catch (error) {
        // Type assertion to handle unknown type
        const errorMessage = (error as Error).message || "An unexpected error occurred";
        console.error("Error getting data:", errorMessage);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
