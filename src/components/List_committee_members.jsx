import React, { useState, useEffect } from 'react'
import { report_fetchcommitteemembers } from '../services/ConferenceServices'
import { getallcommittees } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function List_committee_members() {
  const [data, setData] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState('');
  
  const navigate = useNavigate(); // <-- Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_fetchcommitteemembers(conference_id).then((res) => {
        const allMembers = Object.values(res.data).flat();
        setData(allMembers);
      }).catch((err) => {

      })

      getallcommittees(conference_id).then((res) => {
        setCommittees(res.data.committee);
      }).catch((err) => {

      })
    }
  }, []);
  const handleCommitteeChange = (event) => {
    setSelectedCommitteeId(event.target.value);
    console.log("Selected Committee ID:", event.target.value); // You can remove this line or use it for debugging
  };

  const redirectToHome = () => {
    navigate('/select-conference'); // <-- This will navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
    {/* Home Icon */}
    <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // <-- Add this onClick handler
        />
      </div>

      <div className="flex justify-end"> {/* Flex container with justify-end to align items to the right */}
        <label
          htmlFor="expectedSubmissions"
          className="block w-64 overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <span className="text-xs font-medium text-gray-700">Select Committee</span>
          <select
            id="expectedSubmissions"
            name="expectedSubmissions"
            className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            onChange={handleCommitteeChange}
          >
            <option value="" selected>Select an option</option>
            {committees.map((con) => (
              <option key={con._id} value={con._id}>{toSentenceCase(con.committee_name)}</option>
            ))}
          </select>
        </label>
      </div>



      <div className="overflow-x-auto mt-3">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Designation</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Country</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.designation)}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.name)}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.mobile}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.email}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.country)}</td>


              </tr>
            ))}


          </tbody>
        </table>
      </div>

    </div>
  )
}

export default List_committee_members