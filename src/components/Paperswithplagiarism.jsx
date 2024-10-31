import React, { useState, useEffect } from 'react';
import { report_allpapers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Paperswithplagiarism() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_allpapers(conference_id)
        .then((res) => {
          setData(res.data); // Set the paper data
          console.log(res.data);
          console.log(conference_id);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  // Redirect to home page
  const redirectToHome = () => {
    navigate('/select-conference');
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filter data based on search term
  const filteredData = data.filter(item => 
    toSentenceCase(item.author_name).includes(toSentenceCase(searchTerm)) || 
    toSentenceCase(item.paper_title).includes(toSentenceCase(searchTerm))
  );

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50'>
      {/* Flexbox to align Home Icon and Center Title */}
      <div className="flex items-center justify-between mb-8">
        {/* Home Icon */}
        <div>
          <img
            src={homeIcon}
            alt="Home"
            className="cursor-pointer w-8 h-8"
            onClick={redirectToHome}
          />
        </div>

        {/* Centered Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-3xl font-semibold">
            <u>Papers with Plagiarism Check</u>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end w-full">
          <input
            type="text"
            placeholder="Search by Author or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Set max height for vertical scrolling */}
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Similarity Rating(0-100)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item._id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.paper_title)}
                </td>
 <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.track_name)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.author_name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.similarity_rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Paperswithplagiarism;