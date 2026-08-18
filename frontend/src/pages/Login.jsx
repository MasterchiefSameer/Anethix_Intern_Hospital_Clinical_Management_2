/**
 * Login Page Component.
 * Provides a form for existing patients or admins to log into their accounts.
 * Utilizes react-hook-form and Zod for validation.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = (data) => {
        // TODO: Integrate API login
        console.log(data);
        // Simulate login success and redirect
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
                    <p className="text-muted-foreground mt-2">Sign in to manage your health</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                        <input 
                            type="email" 
                            {...register("email")}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <input 
                            type="password" 
                            {...register("password")}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-muted-foreground">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
