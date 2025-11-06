import { UserModel } from "../schemas/users.schemas";

export const getUsers = UserModel.find();

export const getUserById = (id: string) => UserModel.findById({ id });

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const updateUserById = (values: Record<string, any>, id: string) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
