import './App.css'
import { Outlet } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      {/* <Toaster /> */}
      <div className='container'>
        <Outlet />
      </div>
    </>
  )
}

export default App
