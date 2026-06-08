"use client";
import Link from 'next/link';
import './login.css';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import loginZod from '../_component/loginZod';
import { useTogglePassword } from '@/hooks/tooglepassword';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';
import { loginUser } from '@/lib/actions/auth_actions';
import { LoginFormData } from '../_component/login_register_schema';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = loginZod();
  const { inputType, isVisible, toggleVisibility } = useTogglePassword();
      const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const router = useRouter();
    const { checkAuth } = useAuth();

    const onSubmit = (data: LoginFormData) => {
      
        setError('');
        startTransition(
            async () => {
                try { const result=await loginUser(data);
                    if(result.success){
                      const user = await checkAuth();
                      console.log('checkAuth returned user:', user);
                      const role = user?.role;
                      if(!user){
                        setError('Authentication succeeded but auth check returned no user.');
                        return;
                      }
                      if(role === 'customer') router.push('/customer/');
                      else if(role === 'driver') router.push('/driver/');
                      else if(role === 'restaurant') router.push('/restaurant/');
                      else router.push('/dashboard');
                    
                    }else{
                        setError(result.message||'Login Failed');
                    }
                    
                } catch (error: any) {
                    setError(error?.message || 'Login failed');
                }
            }
        );
    }
  return (
    <div className="login_container">
      <header className="login_header">
        <div className="login_logo_top"><Link href="/">GrubGO</Link></div>
      </header>

      <main className="login_main">
        <div className="login_left">
          <p className="login_tagline">
            Your favorite meals, delivered with speed and care.
          </p>
          <div className="login_image_wrapper">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20240720/pngtree-taking-slice-picture-of-prepared-delicious-pizza-with-sausage-rings-and-image_15902897.jpg"
              alt="Delicious Pizza"
              className="login_pizza_img"
            />
          </div>
        </div>

        <div className="login_right">
          <div className="login_card">
            <h2>Welcome Back</h2>
            <p className="login_subtitle">Log in to your account to continue ordering.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_group">
                <label>Email Address</label>
                <div className="input_wrapper">
                  <Mail size={18} className="input_icon" />
                  <input type="email" placeholder="name@example.com"
                    {...register("email")} />
                </div>
                {errors.email && (
                  <span className='error_message' style={{ color: '#FF0000' }}>{errors.email.message}</span>
                )}
              </div>

              <div className="form_group">
                <div className="password_header">
                  <label>Password</label>
                  <Link href="/forgot_password" className="forgot_link">Forgot Password?</Link>
                </div>
                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />
                  <input type={inputType} placeholder="••••••••"
                    {...register("password")} />
                  <button type='button' className="password_toggle_btn" onClick={toggleVisibility } aria-label={isVisible ? "Hide password" : "Show password"}>
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <span className='error_message' style={{ color: '#FF0000' }}>{errors.password?.message}</span>
              </div>

              <button type="submit" className="login_submit_btn" disabled={isSubmitting}>
                {isSubmitting ? 'Loggin in' : 'Login'}
              </button>
            </form>

            <p className="signup_prompt">
              New to GrubGO? <a href="/register">Create an account</a>
            </p>
          </div>
        </div>
      </main>


    </div>
  );
}