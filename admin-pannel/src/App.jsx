import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import AdminContextProvider from './context/AdminContext'
import DoctorsContextProvider from './context/DoctorsContext'
import AppContextProvider from './context/AppContext'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <AdminContextProvider>
      <DoctorsContextProvider>
        <AppContextProvider>
          <ToastContainer />
          <RouterProvider router={router} />
        </AppContextProvider>
      </DoctorsContextProvider>
    </AdminContextProvider>
  )
}

export default App
