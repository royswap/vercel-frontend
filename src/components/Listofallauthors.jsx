import React, { useEffect, useState } from 'react';
import { fetchallauthors } from '../services/ConferenceServices'; // Adjust the import based on your file structure
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Listofallauthors() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      fetchallauthors(conference_id)
        .then((res) => {
          console.log("API Response:", res); // Log the response for debugging
          setData(res.data); // Update state with fetched data
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate('/select-conference'); // Navigate to the select-conference page
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
          onClick={redirectToHome} // Add this onClick handler
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Affiliation</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Country</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author/Co-Author</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="whitespace-nowrap px-4 py-2 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}> {/* Ensure unique key */}
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.name)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item.mobile}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item.email}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.affiliation)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.country)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.author_coauthor)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.paper_title)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.track_name)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Listofallauthors;
