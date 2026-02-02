import userModel from "../models/user.js";

function getUsers(name, job) {
  let promise;
  const query = {};
  if (name) query.name = name;
  if (job) query.job = job;
  promise = userModel.find(query);
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function removeUser(id) {
  const promise = userModel.findByIdAndDelete({ _id: id });
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  removeUser
};
