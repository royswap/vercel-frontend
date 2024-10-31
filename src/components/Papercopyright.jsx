import React, { useEffect, useState } from 'react';
import { report_authorwisepaper } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Papercopyright() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_authorwisepaper(conference_id)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate('/select-conference'); // Redirect to home page
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    toSentenceCase(item.first_author).includes(toSentenceCase(searchTerm)) ||
    toSentenceCase(item.paper_title).includes(toSentenceCase(searchTerm))
  );

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/* Home Icon */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <img
            src={homeIcon}
            alt="Home"
            className="cursor-pointer w-8 h-8"
            onClick={redirectToHome}
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-3xl font-semibold">
            <u>Paper Copyright Information</u>
          </h2>
        </div>
        <div className="flex justify-end w-full mr-80">
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
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author Country</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Co-authors</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Copyright form, question or upload</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Copy right form submitted</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.paper_title)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.track_name)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.first_author)}</td>
 <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.first_author_email}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.first_author_country)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.co_authors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Papercopyright;