import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, TextField, Typography } from '@mui/material'
import './TripPlanner.css'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Details = () => {
  const options = [
    { label: 'Country1, City1', id: '1' },
    { label: 'Country1, City2', id: '2' },
  ]
  
  return (
    <div className='details'>
      <h2 className='details__title'>Details</h2>

      <div className='details__inputs'>
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="City" />}
        />

        <DesktopDatePicker
          label="Start Date"
          inputFormat="MM/DD/YYYY"
          // value={value}
          // onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />

        <DesktopDatePicker
          label="End Date"
          inputFormat="MM/DD/YYYY"
          // value={value}
          // onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />

        {/* onChange={handleChange('panel1') */}
        {/* expanded === 'panel1' */}
        <Accordion expanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Links
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
              Aliquam eget maximus est, id dignissim quam.
            </Typography>
            test
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Members
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
              Aliquam eget maximus est, id dignissim quam.
            </Typography>
            test
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}

const DayActivity = () => {}
const DaysPlanner = () => {
  const daysCount = 3;
  
  return (
    <div className='days-planner'>
      <ul className='days-planner__days'>
        {
          Array.from({ length: daysCount })
            .map((_, i) => <li
                className='days-planner__day'
              >
                {i + 1}
              </li>
            )
        }
      </ul>

      <ul className='selected-day__activities'>
        <li data-index={1} className='selected-day__activity'>
          <div className='selected-day__hrs'><input type="text" /></div>
          <div className='selected-day__name'>name</div>
          <textarea className='selected-day__notes' name="" id="" cols="30" rows="3"></textarea>
          <div className='selected-day__actions'>
            <button>x</button>
          </div>
        </li>
      </ul>
    </div>
  )
}

const Activities = () => {
  return (
    <div className='activities'>
      <ul className='activities__categories'>
        <li className='activities__category'>cat1</li>
        <li className='activities__category'>cat2</li>
        <li className='activities__category'>cat3</li>
      </ul>

      <ul className='activities__list'>
        <li className='activity'>act11</li>
        <li className='activity'>act12</li>
        <li className='activity'>act13</li>
      </ul>
    </div>
  )
}

const Header = () => {
  return (
    <div className='trip-planner-header'>
      Header
    </div>
  )
}

function TripPlanner () {
  return (
    <main className='trip-planner'>
      <Header />

      <section className='trip-planner-plan'>
        <Details />
        <DaysPlanner />
        <Activities />
      </section>
    </main>
  )
}

export default TripPlanner