import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Navigation, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { useDialog } from '../../context/DialogContext';

import logo from '../../assets/images/logo.jpg';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showAlert } = useDialog();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authApi.adminLogin({ email: data.email, password: data.password });
            if (response.data.tokens) {
                login(response.data.tokens.accessToken, response.data.user);
                navigate('/');
            } else {
                navigate('/verify-otp', { state: { email: data.email } });
            }
        } catch (err: any) {
            showAlert("Login Failed", err.response?.data?.message || 'Please check your credentials and try again.', 'alert');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex overflow-hidden">
            {/* Left Side: Branding/Image */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                {/* Background Image (Logo as Background) */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-110"
                    style={{ 
                        backgroundImage: `url(${logo})`,
                    }}
                />
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-[2px]" />
                
                {/* Branding Content */}
                <div className="relative z-20 text-center px-16 max-w-2xl">
                    <h2 className="text-6xl font-black tracking-tighter mb-8 leading-[0.85]">
                        <span className="text-black">AskR</span><span className="text-primary-500">ide</span> <br />
                        <span className="text-3xl text-slate-300 tracking-tight font-bold">Admin Authority</span>
                    </h2>
                    <p className="text-slate-400 font-bold text-xl leading-relaxed uppercase tracking-[0.2em] opacity-90 max-w-md mx-auto">
                        Precision in Every Mile. <br />
                        Managing the future of <br />
                        <span className="text-white">Urban Mobility.</span>
                    </p>
                    
                    <div className="mt-16 pt-12 border-t border-slate-800/50 flex items-center justify-center gap-12">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">100%</div>
                            <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Encrypted</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">v2.4</div>
                            <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Live Sys</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-50 dark:bg-slate-950 relative">
                {/* Subtle mobile decoration */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-transparent" />
                
                <div className="max-w-md w-full">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden text-center mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl mb-6 p-3 border border-slate-100 dark:border-slate-800">
                            <img src={logo} alt="AskRide Logo" className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">
                            <span className="text-black">AskR</span><span className="text-primary-500">ide</span>
                        </h1>
                    </div>

                    <div className="mb-12 hidden lg:block">
                        <div className="inline-block px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-500/20">
                            Secure Access Point
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-3">Login</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Enter administrative credentials</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Identifier</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                    })}
                                    type="email"
                                    placeholder="admin@askride.com"
                                    className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 transition-all outline-none font-bold shadow-sm"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-widest px-1">{errors.email.message as string}</p>}
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    {...register('password', { required: 'Password is required' })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 transition-all outline-none font-bold shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-primary-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-widest px-1">{errors.password.message as string}</p>}
                        </div>

                        <div className="flex items-center px-1">
                            <div className="flex items-center cursor-pointer group">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary-600 focus:ring-primary-500 bg-white transition-all cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-3 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest select-none cursor-pointer group-hover:text-slate-900 dark:group-hover:text-white">Remember Station</label>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-5 bg-slate-950 dark:bg-primary-500 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 dark:hover:bg-primary-400 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Establish Connection</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-slate-950 group-hover:animate-ping" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-20 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                            <span className="text-slate-300 dark:text-slate-700">Secured by </span>
                            <span className="text-slate-400 dark:text-slate-500">Ask</span><span className="text-primary-500/50">Ride</span>
                            <span className="text-slate-300 dark:text-slate-700"> Infrastructure</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
