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
        getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }>;

}

export class UserMongoRepository implements IUserRepository {
    async findById(id: string): Promise<IUser | null> {
        const foundUser = await User.findById(id);
        return foundUser;
    }
    async findAll(): Promise<IUser[]> {
        return await User.find();
    }
    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: user },
            { new: true, runValidators: true }
        );
        return updatedUser;
    }
    async delete(id: string): Promise<boolean> {
        const deletedUser = await User.findByIdAndDelete(id);
        return !!deletedUser;
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

    async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }> {
        const query: any = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const total = await User.countDocuments(query);
        const data = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { data, total };
    }
}