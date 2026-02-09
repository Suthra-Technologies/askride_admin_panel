import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Navigation, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await authApi.adminLogin({ email: data.email, password: data.password });
            navigate('/verify-otp', { state: { email: data.email } });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-10 animate-slide-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none mb-4">
                        <Navigation className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to your AskRide Admin portal</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 animate-fade-in">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                    })}
                                    type="email"
                                    placeholder="admin@askride.com"
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <Link to="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register('password', { required: 'Password is required' })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 bg-slate-50 dark:bg-slate-800"
                            />
                            <label htmlFor="remember" className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 select-none">Remember Me</label>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 dark:shadow-none hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-slate-400">AskRide Security Systems v2.4.0</p>
                    </div>
                </div>

                {/* Info card */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Required credentials: <br />
                        <span className="font-bold">kodaliramu4@gmail.com</span> / <span className="font-bold">ramu1234</span><br />
                        Bypass OTP: <span className="font-bold text-blue-600 dark:text-blue-400">222222</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
