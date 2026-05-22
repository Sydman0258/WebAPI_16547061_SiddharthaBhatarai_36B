import { useForm } from 'react-hook-form';
import { RegisterFormData, registerSchema } from "./login_register_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUser } from "./authentication_action";

export default function useRegisterZod() {

    const formMethods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "", fullname:"", email: "", role: "", password: "", confirmpassword: ""
        }
    });

    const onSubmit =async (data: RegisterFormData) => {
await RegisterUser();
    }
    return{
        ...formMethods,
        onSubmit:formMethods.handleSubmit(onSubmit),
    

    }
}