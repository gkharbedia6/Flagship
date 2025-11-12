import { UnverifiedUserModel, UserModel } from "../schemas/users.schemas";

export const getUsers = UserModel.find();

export const getUserById = (id: string) => UserModel.findById({ _id: id });

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUnverifiedUserByEmail = (email: string) =>
  UnverifiedUserModel.findOne({ email });

export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserByRefreshToken = (refreshToken: string) =>
  UserModel.findOne({ "authentication.refreshToken": refreshToken });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const createUnvefiriedUser = (values: Record<string, any>) =>
  new UnverifiedUserModel(values)
    .save()
    .then((unverifiedUser) => unverifiedUser.toObject());

export const updateUserById = (values: Record<string, any>, id: string) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });

export const updateUnverifiedUserById = (
  values: Record<string, any>,
  id: string
) => UnverifiedUserModel.findByIdAndUpdate(id, values, { new: true });

export const deleteUnverifiedUserById = (id: string) =>
  UnverifiedUserModel.findOneAndDelete({ _id: id });

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
