
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { DoctorsContext } from '../context/DoctorsContext'

const DoctorsRoutes = () => {
    const { doctorToken } = useContext(DoctorsContext)

    if (!doctorToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-[#F8F9FD]">
            <Navbar />

            <div className="flex items-start">
                <Sidebar />

                <main className="flex-1 min-w-0 px-4 sm:px-10 py-3">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DoctorsRoutes
