import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import StudentDashboard from './components/StudentDashboard'
import AdminDashboard from './components/AdminDashboard'
import './App.css'
import InstructorDashboard from './components/InstructorDashboard'
import ViewAllCourseByStudent from './components/student-components/ViewAllCourseByStudent'
import SearchCourseByTitle from './components/student-components/SearchCourseByTitle'
import MyEnrollments from './components/student-components/MyEnrollments'
import EnrollmentRequests from './components/EnrollmentRequests'
import InstructorCourseList from './components/InstructorCourseList'
import CreateCourseForm from './components/CreateCourseForm'
import AdminCourseManager from './components/AdminCourseManager'
import UserManagement from './components/UserManagement'
import UploadMaterial from './components/UploadMaterial'
import AdminOverview from './components/AdminOverview'
import StudentOverview from './components/StudentOverview'
import InstructorOverview from './components/InstructorOverview'

function App() {
  return (
    <div className="app-shell">
      <header className="page-intro">
        <h1>Capstone Learning Hub</h1>
        <p>Manage student, instructor, and admin workflows with a cleaner, more polished interface.</p>
      </header>
      <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />

      <Route path='/student-dashboard' element={<StudentDashboard />} >
        <Route index element={<StudentOverview />} />
        <Route path='view-all-courses' element={<ViewAllCourseByStudent />} />
        <Route path='search-course-by-title' element={<SearchCourseByTitle />} />
        <Route path='my-enrollments' element={<MyEnrollments />} />
      </Route>

      <Route path='/instructor-dashboard' element={<InstructorDashboard />} >
        <Route index element={<InstructorOverview />} />
        <Route path='my-courses' element={<InstructorCourseList />} />
        <Route path='enrollment-requests' element={<EnrollmentRequests />} />
        <Route path='upload-materials' element={<UploadMaterial />} />
      </Route>
      <Route path='/admin-dashboard' element={<AdminDashboard />} >
        <Route index element={<AdminOverview />} />
        <Route path='manage-courses' element={<AdminCourseManager />} />
        <Route path='create-course' element={<CreateCourseForm />} />
        <Route path='user-management' element={<UserManagement />} />
      </Route>
      <Route path='/login' element={<Login />} />
    </Routes>
    </div>
  )

}

export default App
