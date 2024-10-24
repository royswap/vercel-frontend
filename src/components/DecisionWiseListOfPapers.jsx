import React, { useState, useEffect } from 'react';
import { report_allpapers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function DecisionWiseListOfPapers() {
  const [data, setData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_allpapers(conference_id)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
          console.log(conference_id);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate('/select-conference');
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
  };

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50'>
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
            <u>Decision Wise List of Papers</u>
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr>
              <th className="whitespace -nowrap px-4 py-2 font-medium text-gray-900">Id</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Decision</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handlePaperClick(item)}
              >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item._id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.paper_title)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.author_name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DecisionWiseListOfPapers;