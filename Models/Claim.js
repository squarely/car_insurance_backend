import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const { Schema, model } = mongoose;

const AutoIncrement = mongooseSequence(mongoose);

const ownerSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 3
    },
    phonenumber: {
        type: String,
        required: true,
        // maxLength: 10,
        // minLength: 10
    }
});

const vehicleSchema = new Schema({
    vehicleNumber: {
        type: String,
        required: true,
    },
    vehicleModel: {
        type: String,
        required: true,
    },
    vehicleMake: {
        type: String,
        required: true,
    },
    vehicleYear: {
        type: Number,
        required: true,
    },
    vehicleColor: {
        type: String,
        required: true,
    },
    vehicleIdentificationNumber: {
        type: String,
        required: true,
        unique: [true, "Vehicle Identification Number already exists"],
    },
    vehicleImages: {
        type: [String],
    },
});

const incidentSchema = new Schema({
    natureOfIncident: {
        type: String,
        required: true,
        enum: ["accident", "theft", "vandalism", "fire", "natural disaster", "other"],
    },
    incidentLocation: {
        type: String,
        required: true,
    },
    incidentStatement: {
        type: String,
        required: true,
    },
    incidentDate: {
        type: Date,
        required: true,
    }
});

const policySchema = new Schema({
    policyNumber: {
        type: String,
        required: true,
    },
    policyCoverage: {
        type: String,
        required: true,
    },
    claimHistory: {
        type: String,
        required: true,
    },
    effectiveDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    additionalDetails: {
        type: [String],
        required: true,
    }
});

const partPrice = new Schema({
    part: {
        type: String,
        required: true,
    },
    partPrice: {
        type: Number,
        required: true,
    },
    labourPrice: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    }
});

const priceCalculation = new Schema({
    parts: {
        type: [partPrice]
    },
    partsTotalAmount: {
        type: Number,
        required: true,
    },
    labourTotalAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    }
});

const data = {
    owner: ownerSchema,
    vehicle: vehicleSchema,
    incident: incidentSchema,
    policy: policySchema,
    status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "completed", "rejected"],
    },
    assignedDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    damagedParts: {
        type: [String],
    },
    aiRepairEstimationCost: {
        type: Number,
    },
    suggestedSettlementCost: {
        type: Number,
    },
    damagedPartImages: {
        type: [String],
    },
    aiAnalisysImages: {
        type: [String],
    },
    aiGeneratedReportDate: {
        type: Date,
    },
    priceCalculation: {
        type: priceCalculation
    }

};

const cliamSchema = new Schema(data, { timestamps: true });

cliamSchema.plugin(AutoIncrement, { id: 'claim_seq', inc_field: 'id' });

const Cliam = model("Cliam", cliamSchema);

export default Cliam;