import { BrowserRouter, Navigate, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Login from './pages/login'
import Register from './pages/register';
import { useSelector } from 'react-redux';
import Navbar from './components/navbar';

const PrivateRoutes = () => {
  const authState = useSelector(state => state.auth)
  console.log(authState)

  return <>{authState.isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const authState = useSelector(state => state.auth)
  console.log(authState)

  return <>{!authState.isAuth ? <Outlet /> : <Navigate to='/dashboard' />}</>
}

const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route path='/dashboard/*' element={<Dashboard/>}/>
        </Route>

        <Route element={<RestrictedRoutes/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
