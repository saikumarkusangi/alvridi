// models/Company.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
    companyId: string;
    companyName?: string; // Optional fields are marked with ?
    fund?: string;
    investmentM?: number;
    fundSizeM?: number;
    totalCapitalCommittedB?: number;
    fundInvestments?: number;
    globalSouthDealsFunded?: number;
    globalSouthCountriesSupported?: number;
    country?: string;
    countryCapitalCatalyzedM?: number;
    theme?: string;
    themeCapitalCatalyzedM?: number;
    totalEmissionsCO2e?: number;
    scope1EmissionsCO2e?: number;
    scope2EmissionsCO2e?: number;
    scope3EmissionsCO2e?: number;
}

const CompanySchema: Schema<ICompany> = new Schema({
    companyId: { type: String, unique: true, required: true },
    companyName: { type: String },
    fund: { type: String },
    investmentM: { type: Number },
    fundSizeM: { type: Number },
    totalCapitalCommittedB: { type: Number },
    fundInvestments: { type: Number },
    globalSouthDealsFunded: { type: Number },
    globalSouthCountriesSupported: { type: Number },
    country: { type: String },
    countryCapitalCatalyzedM: { type: Number },
    theme: { type: String },
    themeCapitalCatalyzedM: { type: Number },
    totalEmissionsCO2e: { type: Number },
    scope1EmissionsCO2e: { type: Number },
    scope2EmissionsCO2e: { type: Number },
    scope3EmissionsCO2e: { type: Number }
});

const CompanyModel = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default CompanyModel;
