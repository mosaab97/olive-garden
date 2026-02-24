import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  login as loginAction,
  register as registerAction,
  logout,
} from '../features/auth/authSlice';

const useAuth = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectCurrentUser);
  const isAdmin   = useSelector(selectIsAdmin);
  const loading   = useSelector(selectAuthLoading);
  const error     = useSelector(selectAuthError);

  const login = async (data) => {
    const result = await dispatch(loginAction(data));
    if (loginAction.fulfilled.match(result)) {
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/');
    }
    return result;
  };

  const register = async (data) => {
    const result = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(result)) navigate('/');
    return result;
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    isAdmin,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
  };
};

export default useAuth;
