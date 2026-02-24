import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/validators';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const { register: registerUser, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="font-serif text-3xl text-olive-900 text-center mb-2">Create account</h1>
      <p className="text-center text-olive-400 mb-8">Join us for fresh olives delivered to your door</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(registerUser)} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" placeholder="Jane" error={errors.first_name?.message} {...register('first_name')} />
          <Input label="Last name"  placeholder="Doe"  error={errors.last_name?.message}  {...register('last_name')} />
        </div>
        <Input label="Email"    type="email"    placeholder="you@example.com" error={errors.email?.message}    {...register('email')} />
        <Input label="Phone"    type="tel"      placeholder="6301234567"      error={errors.phone?.message}    {...register('phone')} />
        <Input label="Password" type="password" placeholder="••••••••"        error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" placeholder="••••••••"
          error={errors.confirm_password?.message} {...register('confirm_password')} />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-olive-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-olive-700 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
