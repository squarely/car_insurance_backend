import { body } from 'express-validator';

const owner = [
    body('owner.username')
        .exists().withMessage('username is required')
        .isString().withMessage('username must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('username must be between 3 to 50 characters long'),
    body('owner.email')
        .exists().withMessage('email is required')
        .isEmail().withMessage('Please enter a valid phonenumber'),
    body('owner.phonenumber')
        .exists().withMessage('phonenumber is required')
        // .isMobilePhone().withMessage('Please enter a valid phonenumber'),
];

const vehicle = [
    body('vehicle.vehicleNumber')
        .exists().withMessage('vehicleNumber is required')
        .isString().withMessage('vehicleNumber must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('vehicleNumber must be between 3 to 50 characters long'),
    body('vehicle.vehicleModel')
        .exists().withMessage('vehicleModel is required')
        .isString().withMessage('vehicleModel must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('vehicleModel must be between 3 to 50 characters long'),
    body('vehicle.vehicleMake')
        .exists().withMessage('vehicleMake is required')
        .isString().withMessage('vehicleMake must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('vehicleMake must be between 3 to 50 characters long'),
    body('vehicle.vehicleYear')
        .exists().withMessage('vehicleYear is required')
        .isNumeric().withMessage('vehicleYear must be a number'),
    body('vehicle.vehicleColor')
        .exists().withMessage('vehicleColor is required')
        .isString().withMessage('vehicleColor must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('vehicleColor must be between 3 to 50 characters long')
]

const incident = [
    body('incident.natureOfIncident')
        .exists().withMessage('natureOfIncident is required')
        .isString().withMessage('natureOfIncident must be a string'),
    body('incident.incidentLocation')
        .exists().withMessage('incidentLocation is required')
        .isString().withMessage('incidentLocation must be a string'),
    body('incident.incidentStatement')
        .exists().withMessage('incidentStatement is required')
        .isString().withMessage('incidentStatement must be a string'),
    body('incident.incidentDate')
        .exists().withMessage('incidentDate is required')
        .isISO8601().withMessage('incidentDate must be a date')
]

const policy = [
    body('policy.policyNumber')
        .exists().withMessage('policyNumber is required')
        .isString().withMessage('policyNumber must be a string'),
    body('policy.policyCoverage')
        .exists().withMessage('policyCoverage is required')
        .isString().withMessage('policyCoverage must be a string'),
    body('policy.claimHistory')
        .exists().withMessage('claimHistory is required')
        .isString().withMessage('claimHistory must be a string'),
    body('policy.effectiveDate')
        .exists().withMessage('effectiveDate is required')
        .isISO8601().withMessage('effectiveDate must be a date'),
    body('policy.expiryDate')
        .exists().withMessage('expiryDate is required')
        .isISO8601().withMessage('expiryDate must be a date'),
    body('policy.additionalDetails')
        .exists().withMessage('additionalDetails is required')
        .isArray().withMessage('additionalDetails must be an array')
]

export const createValidator = [
    ...owner,
    ...vehicle,
    ...incident,
    ...policy
];

const ClaimValidator = {
    createValidator
};

export default ClaimValidator;