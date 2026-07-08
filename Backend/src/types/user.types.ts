import { z} from 'zod';

export const UserSchema=z.object({
  username:z.string(),
  fullname:z.string(),
  email:z.email(),
  role:z.enum(["customer","driver","restaurant","admin"]),
  password:z.string().min(6),
  imageUrl:z.string().optional(),
  address:z.string().optional(),
  phoneNumber:z.string(),


});

export type UserType=z.infer<typeof UserSchema>;