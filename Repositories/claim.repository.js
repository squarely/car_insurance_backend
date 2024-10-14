import Claim from "../Models/Claim.js";

export const find = (criteria) => Claim.find(criteria);
export const create = (ClaimData) => Claim.create(ClaimData);
export const findById = (id) => Claim.findById(id);
export const findByIdAndUpdate = (id, updateData, options) => Claim.findByIdAndUpdate(id, updateData, options);
export const findByIdAndRemove = (id) => Claim.findByIdAndRemove(id);
export const findOne = (criteria) => Claim.findOne(criteria);
export const findOneAndUpdate = (criteria, updateData, options) => Claim.findOneAndUpdate(criteria, updateData, options);
export const count = (query) => Claim.countDocuments(query);
export const aggregate = (query) => Claim.aggregate(query);