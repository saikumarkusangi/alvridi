import dbConnect from "@/config/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/company"; // Ensure the correct path to your Company model
import { ParsedUrlQuery } from "querystring"; // Import the type for URL query parsing

interface Params extends ParsedUrlQuery {
    companyId: string; // Specify the expected parameter type
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
    const { companyName } = params; // Extract companyId from the route parameters


    try {
        await dbConnect();
        if (companyName) {
            const company = await Company.find({ companyName }); 
            if (!company) {
                return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: company }, { status: 200 });
        }
        const companies = await Company.find();
        return NextResponse.json({ success: true, data: companies }, { status: 200 });
    } catch (error) {
        // Type assertion to handle unknown type
        const errorMessage = (error as Error).message || "An unexpected error occurred";
        console.error("Error getting data:", errorMessage);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
