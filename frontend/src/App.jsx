import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register';
import WorkoutPage from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutView from './pages/WorkoutView';
import ExerciseHistory from './pages/History';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><Login /></div>} />
        <Route path="/register" element={<div><Register /></div>} />
        <Route path="/workout" element={<div><WorkoutPage /></div>} />
        <Route path="/createWorkout" element={<div><CreateWorkout /></div>} />
        <Route path="/workoutView" element={<div><WorkoutView /></div>} />
        <Route path="/workoutHistory" element={<div><ExerciseHistory /></div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
