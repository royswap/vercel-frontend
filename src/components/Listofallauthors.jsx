import React, { useEffect, useState } from 'react';
import { fetchallauthors } from '../services/ConferenceServices'; // Adjust the import based on your file structure
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Listofallauthors() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
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

  // Filtered data based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // Add this onClick handler
        />
      

      <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>List of All Authors</u>
        </div>
        {/* Search Bar */}
        <div className="absolute right-0 mr-4">
        <input
          type="text"
          placeholder="Search by author name..."
          className="w-64 pl-2 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto"> {/* Set max height and enable vertical scrolling */}
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="whitespace-nowrap px-4 py-2 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
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
    </div>
  );
}

export default Listofallauthors;