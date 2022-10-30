import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, TextField, Typography } from '@mui/material'
import './TripPlanner.css'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useReducer } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { config } from '../config';



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
const createDayActivity = (overrides) => ({
  activityId: -1,
  activityName: '',
  visitingDate: '',
  note: '',
  dayNumber: 0,
  dayActivityId: Math.random().toString(36).slice(2, 7),
  ...overrides,
})
const dayActivitiesReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'add': {
      return [
        ...state,
        payload,
      ]
    }

    case 'updated': {
      const { dayActivityId, ...updatedActivity } = payload;

      return state.map(a => a.dayActivityId === dayActivityId ? updatedActivity : a );
    }
  }
}

const DaysPlanner = () => {
  const daysCount = 3;

  const [dayActivities, dispatch] = useReducer(dayActivitiesReducer, []);

  const [{ isOver, itemType }, drop] = useDrop(() => ({
    accept: 'activity',
    drop: (item, monitor) => {
      const type = monitor.getItemType();
      console.log({ type, item });
      console.log('dropping!');

      if (type === 'activity') {
        const newActivity = createDayActivity({
          activityId: item.id,
          activityName: item.name,
        });

        dispatch({ payload: newActivity, type: 'add' });
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      itemType: monitor.getItemType(),
    }),
  }), []);

  const onActivityChanged = (dayActivityId, updatedKey, updatedValue) => {
    const updatedDayActivity = dayActivities.find(da => da.dayActivityId === dayActivityId);
    
    dispatch({
      type: 'updated',
      payload: {
        dayActivityId,
        ...updatedDayActivity,
        [updatedKey]: updatedValue,
      }
    })
  }

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

      <ul data-is-empty={dayActivities.length === 0} ref={drop} className='selected-day__activities'>
        {
          dayActivities.map((a, i) => (
            <li data-index={i + 1} className='selected-day__activity'>
              <div className='selected-day__hrs'><input type="text" onChange={ev => onActivityChanged(a.dayActivityId, 'visitingDate', ev.target.value)} value={a.visitingDate} /></div>
              <div className='selected-day__name'>{a.activityName}</div>
              <textarea value={a.notes} onChange={ev => onActivityChanged(a.dayActivityId, 'note', ev.target.value)} className='selected-day__notes' name="" id="" cols="30" rows="3"></textarea>
              <div className='selected-day__actions'>
                <button>x</button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

const Activity = (props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'activity',
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    item: props.activity
  }))
  
  return (
    <li ref={drag} className={props.className}>
      {props.children}
    </li>
  )
}
const CATEGORY_ALL_OPTION = 'all';
const Activities = () => {
  const [categories, setCategories] = useState([CATEGORY_ALL_OPTION]);
  const [selectedCategories, setSelectedCategories] = useState({ [CATEGORY_ALL_OPTION]: true });
  const [activities, setActivities] = useState([]);

  const toggleSelectCategory = c => {
    const isAllSelected = c === CATEGORY_ALL_OPTION;
    if (isAllSelected && selectedCategories[CATEGORY_ALL_OPTION]) {
      return;
    }

    if (isAllSelected && !selectedCategories[CATEGORY_ALL_OPTION]) {
      setSelectedCategories({
        [CATEGORY_ALL_OPTION]: true
      });
      return;
    }

    const shouldAllBeUnselected = !isAllSelected && !selectedCategories[c];
    
    setSelectedCategories({
      ...selectedCategories,
      [c]: !selectedCategories[c],
      ...shouldAllBeUnselected && { [CATEGORY_ALL_OPTION]: false }
    })
  }

  useEffect(() => {
    fetch(`${config.API_URL}/activities-categories`)
      .then(r => r.json())
      .then(r => {
        const categories = r.data;
        setCategories([CATEGORY_ALL_OPTION, ...categories]);
      });
  }, []);

  useEffect(() => {
    const categoryAsFilters = Object.keys(selectedCategories).filter(k => !!selectedCategories[k]).join(',');

    fetch(`${config.API_URL}/activities?filter=${categoryAsFilters}`)
      .then(r => r.json())
      .then(r => {
        setActivities(r.data);
      });
  }, [selectedCategories]);

  console.log(selectedCategories);

  return (
    <div className='activities'>
      <ul className='activities__categories'>
        {
          categories.map(c => <li key={c} onClick={() => toggleSelectCategory(c)} className={`activities__category ${selectedCategories[c] ? 'activities__category--selected' : ''}`}>{c}</li>)
        }
      </ul>

      <ul className='activities__list'>
        {
          activities.map(a => <Activity activity={a} className='activity'>{a.name}</Activity>)
        }
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
        <DndProvider backend={HTML5Backend}>
          <DaysPlanner />
          <Activities />
        </DndProvider>
      </section>
    </main>
  )
}

export default TripPlanner