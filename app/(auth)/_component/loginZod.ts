import { useForm } from 'react-hook-form';
import { loginSchema, LoginFormData } from './login_register_schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';

export default function loginZod() {
    const router = useRouter();
   const formMethods = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

 const onSubmit = (data: LoginFormData) => {
        if (
            data.email === "demo@gmail.com" &&
            data.password === "demo123"
        ) {
            router.push("/customer");
        } else {
            alert("Invalid credentials");
        }
    };
    return {
        ...formMethods,
        onSubmit: formMethods.handleSubmit(onSubmit),
        isSubmitting: formMethods.formState.isSubmitting
    };

}

