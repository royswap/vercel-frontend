import React, { useState, useEffect } from 'react';
import { report_allpapers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

// Modal Component for Paper Details
const PaperDetailsModal = ({ isOpen, onClose, paperDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Paper Details</h2>
        <p><strong>Paper Name:</strong> {paperDetails.paper_title}</p>
        <p><strong>Track Name:</strong> {paperDetails.track_name}</p>
        <p><strong>Author:</strong> {paperDetails.author_name}</p>
        <p><strong>Co-authors:</strong> {paperDetails.coAuthors}</p>
        <p><strong>PDF:</strong> {paperDetails.pdfLink ? (
          <a href={paperDetails.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
        ) : (
          "No PDF available"
        )}</p>
        
        <button onClick={onClose} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
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

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50'>
      <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Similarity rating (0-100)</th>
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
                  {item.paper_title}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.track_name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.similarity_rating}
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
            paper_title: selectedPaper.paper_title,
            author_name: selectedPaper.author_name
             || "N/A", // Adjust based on your data structure
            coAuthors: selectedPaper.coauthor_name, // Default to empty array if no co-authors
            track_name: selectedPaper.track_name,
            pdfLink: selectedPaper.pdf, // Safely access pdfLink
          }}
        />
      )}
    </div>
  );
}

export default Listpapers_report;
