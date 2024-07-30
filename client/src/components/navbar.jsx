import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { onLogout } from '../api/export';
import { unauthenticateUser } from '../redux/slice';

const Navbar = () => {
  const {isAuth} = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>
        <div className='d-flex justify-content-between w-100'>
          {isAuth ? (
            <>
              <NavLink to='/dashboard' className='navbar-brand mb-0 h1'>Dashboard</NavLink>
              <div>
                <button className='nav-link' 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => logout()} 
                      >Logout</button>
              </div>
            </>
          ) : (
            <>
              <NavLink to='/' className='navbar-brand mb-0 h1'>Home</NavLink>
              <div>
                <NavLink to='/login' className='nav-link d-inline'>Login</NavLink>
                <NavLink to='/register' className='nav-link d-inline mx-3'>Register</NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar