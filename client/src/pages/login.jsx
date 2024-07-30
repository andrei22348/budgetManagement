import { useState } from 'react';
import { onLogin } from '../api/export';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slice';
import '../public/login.css';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await onLogin(values);
      dispatch(authenticateUser());
      localStorage.setItem('isAuth', 'true');
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
      <form onSubmit={(e) => onSubmit(e)} className='login-form'>
        <h1 className='login-title'>Login</h1>
        <p className='login-description'>Please enter your credentials to access your account.</p>

        <div className='g'>
          <label htmlFor='email' className='form-label'>
            Email address
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={values.email}
            placeholder='abc@gmail.com'
            required
          />
        </div>

        <div className='g'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='password'
            value={values.password}
            className='form-control'
            id='password'
            name='password'
            placeholder='password'
            required
          />
        </div>


        <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>

      </form>
  );
};

export default Login;