import dbConnect from "@/config/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/company";
import { ParsedUrlQuery } from "querystring";
import User from "@/models/user";

interface Params extends ParsedUrlQuery {
    companyName: string;
}

export async function GET(req: NextRequest) {
    const { email } = await req.json();


    try {
        await dbConnect();
        if (email) {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: user }, { status: 200 });
        }
    } catch (error) {
        // Type assertion to handle unknown type
        const errorMessage = (error as Error).message || "An unexpected error occurred";
        console.error("Error getting data:", errorMessage);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const { companyName, email } = await req.json();

    try {
        await dbConnect();


        const company = await Company.findOne({ companyName });
        if (!company) {
            return NextResponse.json(
                { success: false, message: 'Company not found' },
                { status: 404 }
            );
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $addToSet: { watchList: companyName } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Company added to watch list', data: user.watchList },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = (error as Error).message || "An unexpected error occurred";
        console.error("Error updating watch list:", errorMessage);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}