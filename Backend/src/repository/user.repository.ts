import User, { IUser } from "../models/user.model";

export interface IUserRepository {
    findbyEmail(email: string): Promise<IUser | null>;
    createUser(user: IUser): Promise<IUser>;
    findUsername(username: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
    update(id: string, user: Partial<IUser>)
        : Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
   async  findById(id: string): Promise<IUser | null> {
        const foundUser=await User.findById(id);
        return foundUser;
    }
    findAll(): Promise<IUser[]> {
        throw new Error("Method not implemented.");
    }
  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: user },
        { new: true, runValidators: true } 
    );
    return updatedUser;
}
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async findUsername(username: string): Promise<IUser | null> {
        const foundUser = await User.findOne({ username: username });
        return foundUser;
    }
    async findbyEmail(email: string): Promise<IUser | null> {
        const foundUser = await User.findOne({ email: email });
        return foundUser;
    }
    async createUser(user: IUser): Promise<IUser> {
        const createdUser = await User.create(user);
        return createdUser;
    }

}