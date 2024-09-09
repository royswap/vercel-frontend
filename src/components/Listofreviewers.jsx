import React, { useEffect, useState } from 'react'
import { report_fetchreviewers } from '../services/ConferenceServices'
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';


function Listofreviewers() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // <-- Initialize navigate
  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_fetchreviewers(conference_id).then((res) => {
        setData(res.data);
      }).catch((err) => {

      })
    }
  }, []);

  const redirectToHome = () => {
    navigate('/select-conference'); // <-- This will navigate to the select-conference page
  };

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/*
      Heads up! 👋
    
      This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
    */}
      {/* Home Icon */}
      <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // <-- Add this onClick handler
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Affiliation</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Country</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.track_name}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.name}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.affiliation}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.country}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.email}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.mobile}</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Listofreviewers