/**
 * Register Page Component.
 * Provides a form for new patients to create an account.
 * Utilizes react-hook-form and Zod for robust client-side validation.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Please select a gender" })
});

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = (data) => {
        // TODO: Integrate API register
        console.log(data);
        // Simulate register success and redirect
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-lg border border-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Create an Account</h2>
                    <p className="text-muted-foreground mt-2">Join us to book appointments easily</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                        <input 
                            type="text" 
                            {...register("name")}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            {...register("phone")}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="1234567890"
                        />
                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
                        <select 
                            {...register("gender")}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender.message}</p>}
                    </div>

                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all mt-4">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-6 text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
