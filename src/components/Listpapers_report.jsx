import React, { useState, useEffect } from 'react';
import { report_allpapers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

// Modal Component for Paper Details
const PaperDetailsModal = ({ isOpen, onClose, paperDetails }) => {
  if (!isOpen) return null;

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  console.log('Paper Details:', paperDetails);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded shadow-lg w-100">
        <h2 className="text-2xl font-bold mb-4">Paper Details</h2>
        <p><strong>Paper ID:</strong> {paperDetails.paper_id}</p>
        <p><strong>Paper Name:</strong> {toSentenceCase(paperDetails.paper_title)}</p>
        <p><strong>Keywords:</strong> {toSentenceCase(paperDetails.keywords)}</p>
        <p><strong>Affiliation:</strong> {toSentenceCase(paperDetails.affiliation)}</p>
        <p><strong>Abstract:</strong> {toSentenceCase(paperDetails.abstract)}</p>
        <p><strong>Track Name:</strong> {toSentenceCase(paperDetails.track_name)}</p>
        <p><strong>Author:</strong> {toSentenceCase(paperDetails.author_name)}</p>
        <p><strong>Co-authors:</strong> {toSentenceCase(paperDetails.coAuthors)}</p>
        <p><strong>PDF:</strong> {paperDetails.pdfLink ? (
          <a href={paperDetails.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
        ) : (
          "No PDF available"
        )}</p>
        
        <button onClick={onClose} className="mt-4  py-2 px-4 rounded text-black-500 border border-indigo-600 bg-indigo-200 hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500">
          Close
        </button>
      </div>
    </div>
  );
};

function Listpapers_report() {
  const [data, setData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null); // Stores the clicked paper
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
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

  // Function to handle paper click and open modal
  const handlePaperClick = (paper) => {
    setSelectedPaper(paper); // Set the clicked paper as selected
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedPaper(null); // Reset selected paper
  };

  // Redirect to home page
  const redirectToHome = () => {
    navigate('/select-conference');
  };
  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

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
            <u>List of Papers</u>
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author Name</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handlePaperClick(item)} // Open modal on click
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render PaperDetailsModal */}
      {isModalOpen && selectedPaper && (
        <PaperDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          paperDetails={{
            paper_id: selectedPaper._id,
            paper_title: selectedPaper.paper_title,
            author_name: selectedPaper.author_name
             || "N/A", // Adjust based on your data structure
            coAuthors: selectedPaper.coauthor_name, // Default to empty array if no co-authors
            track_name: selectedPaper.track_name,
            keywords: selectedPaper.keywords,
            affiliation: selectedPaper.affiliation,
            pdfLink: selectedPaper.pdf, // Safely access pdfLink
          }}
        />
      )}
    </div>
  );
}

export default Listpapers_report;
