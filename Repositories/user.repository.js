import User from "../Models/User.js";

export const find = (criteria) => User.find(criteria);
export const create = (UserData) => User.create(UserData);
export const findById = (id) => User.findById(id);
export const findByIdAndUpdate = (id, updateData, options) => User.findByIdAndUpdate(id, updateData, options);
export const findByIdAndRemove = (id) => User.findByIdAndRemove(id);
export const findOne = (criteria) => User.findOne(criteria);
export const findOneAndUpdate = (criteria, updateData, options) => User.findOneAndUpdate(criteria, updateData, options);
export const count = (query) => User.countDocuments(query);
export const aggregate = (query) => User.aggregate(query);