import React, { useEffect, useRef, useState } from 'react'
import api from '../api/api.js'
import {fetchToken} from './Auth.js'
import moment from 'moment';
import format from 'date-fns/format'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

 
function Home() {
    
    const [data, setData] = useState([]);
    const [message, setMessage] = useState();
    const [open, setOpen] = useState(false)
    const [range, setRange] = useState([
      {
        startDate: (new Date(moment().startOf('month'))),
        endDate: (new Date(moment().endOf('month'))),
        key: 'selection'
      }
    ])
    const [dates, setDates] = useState([]);
    // get the target element to toggle 
    const refOne = useRef(null)
  
    useEffect(() => {
      // event listeners
      document.addEventListener("keydown", hideOnEscape, true)
      document.addEventListener("click", hideOnClickOutside, true)
    }, [])
  
    // hide dropdown on ESC press
    const hideOnEscape = (e) => {
      // console.log(e.key)
      if( e.key === "Escape" ) {
        setOpen(false)
      }
    }
  
    // Hide on outside click
    const hideOnClickOutside = (e) => {
      if( refOne.current && !refOne.current.contains(e.target) ) {
        setOpen(false)
      }
    }
 
    let auth = fetchToken();
    const headers = {
        'Content-Type': 'application/json', 
        'Authorization': auth
    };
    
    const clockIn = () => {
      api.post("/clockin", {}, { headers })
        .then(res => {
            setMessage(res.data.message);
        })
        .catch(err => {
          setMessage(err.response.data.message);
          console.log(err)
        })
    };
    const clockOut = () => {
      api.post("/clockout", {}, { headers })
        .then(res => {
            setMessage(res.data.message);
        })
        .catch(err => {
          setMessage(err.response.data.message);
          console.log(err)
        })
    };
    useEffect(() => {
      if (message) {
          alert(message);
      }
  }, [message]);
    // Function to loop through the current month and update the dates state
    const loopThroughCurrentMonth = () => {
        const dateList = [];
        let currentDate = moment(range[0].startDate).clone();
        while (currentDate.isSameOrBefore(moment(range[0].endDate))) {
            dateList.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day');
        }
        setDates(dateList);
    };
    useEffect(() => {
        loopThroughCurrentMonth();
    }, [range]);

    useEffect(() => {
      api.get(`/getAbsents?start_at=${moment(range[0].startDate).format('YYYY-MM-DD')}&end_at=${moment(range[0].endDate).format('YYYY-MM-DD')}`, {headers})
        .then(res => {
            setData(res.data.data)
        }).catch(err => console.log(err));
    } , [range, message])
   
  return (
    <div className='px-5 py-3'>
        <div className="calendarWrap">
            <input
            value={`${format(range[0].startDate, "yyy-mm-dd")} to ${format(range[0].endDate, "yyy-mm-dd")}`}
            readOnly
            className="inputBox"
            onClick={ () => setOpen(open => !open) }
            />
            <div ref={refOne}>
            {open && 
                <DateRange
                onChange={item => setRange([item.selection])}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                className="calendarElement"
                />
            }
            </div>
        </div>
      <div className='d-flex justify-content-center mt-2'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Clock-In</th>
              <th>Clock-Out</th>
            </tr>
          </thead>
          <tbody>
            {
            dates.map((date, index) => {
                const absentClockIn = data.filter(absent => absent['date'] === date && absent['type'] === "Clock-In");
                const absentClockOut = data.filter(absent => absent['date'] === date && absent['type'] === "Clock-Out");
               return <tr key={index}>
                    <td>{date}</td>
                    <td>{absentClockIn[0]? absentClockIn[0].time : '-'}</td>
                    <td>{absentClockOut[0]? absentClockOut[0].time : '-'}</td>
                </tr>
            })}
          </tbody>
        </table>
      </div>
      
      <div className="button-container">
            <button className="circular-button" onClick={clockIn}>Clock-In</button>
            <button className="circular-button" onClick={clockOut}>Clock-Out</button>
        </div>
      </div>
  )
}
 
export default Home