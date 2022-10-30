import './App.css';
import { Button } from '@mui/material';
import TripPlanner from './components/TripPlanner';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className='layout-container'>
        <header>header</header>
        <TripPlanner />
        <footer>footer</footer>
      </div>
    </LocalizationProvider>
  )
}

export default App;
