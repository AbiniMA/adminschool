import { useEffect, useState } from 'react';
import PrivateRoute from './api/PrivateRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashborad from './sections/Dashborad/Dashborad';
import Login from './sections/Login/Login';
import Studentdetails from './sections/Studentdetails/Studentdetails';
import Studentlist from './sections/Studentlist/Studentlist';
import Header from './layouts/Header';
import Addstudent from './sections/Addstudent/Addstudent';
import CourseTable from './sections/CourseDetails/CourseTable';
import Attendance from './sections/AttendancePage/Attendance';
import Eventlist from './sections/Eventlist/Eventlist';
import FeeHome from './sections/feemanagement/FeeHome';
import LeaveRequest from './sections/Leaverequestmodel/Leaverequest';
import CourseDetails from './sections/CourseDetails/CourseDetails';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setLoginUser={setIsAuthenticated} />}
      />

      <Route
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading} />
        }
      >
        <Route path="/dashboard" element={<Header />}>
          <Route index element={<Dashborad />} />
        </Route>

        <Route path="/students" element={<Header />}>
          <Route index element={<Studentlist />} />
          <Route path="studentview/:id" element={<Studentdetails />} />
          <Route path="addstudent" element={<Addstudent />} />
        </Route>

        <Route path="/Fees" element={<Header />}>
          <Route index element={<FeeHome />} />
        </Route>

        <Route path="/attendence" element={<Header />}>
          <Route index element={<Attendance />} />
          <Route path="leaverequest/:date" element={<LeaveRequest />} />
        </Route>

        <Route path="/events" element={<Header />}>
          <Route index element={<Eventlist />} />
        </Route>

        <Route
          path="/course"
          element={<Header setLoginUser={setIsAuthenticated} />}
        >
          <Route index element={<CourseTable />} />
          <Route path="coursedetails/:id" element={<CourseDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
export default App