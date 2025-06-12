import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchauthorwork, report_authorwisepaper } from '../services/ConferenceServices';

function PaperDetails() {
  const [paperDetails, setPaperDetails] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const conference_id = state?.paperId;

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_authorwisepaper(conference_id)
        .then((res) => {
          // Assuming the API returns a single paper detail object
          setPaperDetails(res.data);
          console.log(res.data);
          
        })
        .catch((err) => {
          console.error(err); // Handle any errors
        });
    }
  }, []);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <button onClick={goBack} className="mb-4 text-blue-500">
        &larr; Back
      </button>
      {paperDetails ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{paperDetails.paper_title}</h2>
          <p><strong>Track Name:</strong> {paperDetails.track_name || 'N/A'}</p>
          <p><strong>PDF:</strong> <a href="/path-to-pdf" target="_blank" rel="noopener noreferrer">View PDF</a></p>
          {/* Add more fields if needed */}
        </div>
      ) : (
        <p>No paper details available.</p>
      )}
    </div>
  );
}

export default PaperDetails;
