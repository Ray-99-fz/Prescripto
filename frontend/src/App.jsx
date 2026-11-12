import { RouterProvider } from 'react-router-dom'
import { router } from './Routes'
import { AppContextProvider } from './context/AppContext'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <AppContextProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AppContextProvider>
  )
}

export default App
