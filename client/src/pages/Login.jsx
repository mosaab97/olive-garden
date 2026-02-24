import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validators';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="font-serif text-3xl text-olive-900 text-center mb-2">Welcome back</h1>
      <p className="text-center text-olive-400 mb-8">Sign in to your account</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(login)} className="card p-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-olive-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-olive-700 font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
