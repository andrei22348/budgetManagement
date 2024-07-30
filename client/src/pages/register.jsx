import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slice';
import { onLogin, onRegistration } from '../api/export';
import '../public/register.css';

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await onRegistration(values);
      await onLogin(values)
      setError('');
      setValues({
        email: '',
        password: '',
      });
      dispatch(authenticateUser());
      localStorage.setItem('isAuth', 'true');
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }
  };

  return (
      <form onSubmit={(e) => onSubmit(e)} className='register-form'>
        <h1 className='register-title'>Register</h1>
        
        <p className="additional-text">Please fill out the following form to create an account.</p>

        <div className='form-group'>
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

        <div className='form-group'>
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

        <div className='error-message'>{error}</div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
  );
};

export default Register;