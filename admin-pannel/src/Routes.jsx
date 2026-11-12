import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import AuthenticatedRoutes from './layouts/AdminRoutesLayout'
import Dashboard from './pages/Admin/Dashboard'
import AddDoctor from './pages/Admin/AddDoctor'
import AllAppointments from './pages/Admin/AllAppointments'
import DoctorsList from './pages/Admin/DoctorsList'
import DoctorsRoutes from './layouts/DoctorsRoutesLayout'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'

const router = createBrowserRouter([
    {
        
        Component: AuthenticatedRoutes,
        children: [
            {
                path: '/',
                Component: Dashboard
            },
            {
                path: '/add-doctor',
                Component: AddDoctor
            },
            {
                path: '/all-appointments',
                Component: AllAppointments
            },
            {
                path: '/doctors-list',
                Component: DoctorsList
            }
        ]
    },

    {
        Component: DoctorsRoutes,
        children: [
            {
                path: "/doctor-dashboard",
                Component: DoctorDashboard
            },
            {
                path: '/doctor-appointments',
                Component: DoctorAppointments
            },
            {
                path: '/doctor-profile',
                Component: DoctorProfile
            }
        ]

    },

    {
        path: 'login',
        Component: Login
    }
])

export default router