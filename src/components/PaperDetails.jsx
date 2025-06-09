import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import { fetchauthorwork } from '../services/ConferenceServices';

   function PaperDetails() {
     const [paperDetails, setPaperDetails] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const navigate = useNavigate();
     const { paperId } = useParams(); // Extract paperId from the URL

     useEffect(() => {
       if (!paperId) {
         setError('No paper ID provided.');
         setLoading(false);
         return;
       }

       // Fetch the specific paper details using the paperId
       fetchauthorwork(paperId)
         .then((res) => {
           if (!res.data) {
             throw new Error('No paper found with this ID.');
           }
           setPaperDetails(res.data);
           console.log('Fetched paper details:', res.data);
         })
         .catch((err) => {
           console.error('Error fetching paper details:', err);
           setError('Failed to load paper details. Please try again.');
         })
         .finally(() => {
           setLoading(false);
         });
     }, [paperId]);

     const goBack = () => {
       navigate(-1); // Go back to the previous page
     };

     return (
       <div className="p-4 bg-white rounded shadow-md max-w-3xl mx-auto mt-5">
         <button onClick={goBack} className="mb-4 text-blue-500 hover:underline">
           ← Back
         </button>

         {loading ? (
           <p className="text-center text-gray-500">Loading paper details...</p>
         ) : error ? (
           <p className="text-center text-red-500">{error}</p>
         ) : paperDetails ? (
           <div>
             <h2 className="text-2xl font-bold mb-4">{paperDetails.title}</h2>
             <p className="mb-2">
               <strong>Track:</strong> {paperDetails.track?.track_name || 'N/A'}
             </p>
             <p className="mb-2">
               <strong>Author:</strong> {paperDetails.name} ({paperDetails.email})
             </p>
             {paperDetails.co_authors?.length > 0 && (
               <div className="mb-2">
                 <strong>Co-Authors:</strong>
                 <ul className="list-disc ml-5">
                   {paperDetails.co_authors.map((coAuthor, index) => (
                     <li key={index}>
                       {coAuthor.name} ({coAuthor.email})
                       {coAuthor.isCorrespondingAuthor && ' - Corresponding Author'}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
             <p className="mb-2">
               <strong>Keywords:</strong> {paperDetails.keywords || 'N/A'}
             </p>
             <p className="mb-2">
               <strong>Abstract:</strong> {paperDetails.abstract || 'N/A'}
             </p>
             {paperDetails.pdfLink && (
               <p className="mb-2">
                 <strong>PDF:</strong>{' '}
                 <a
                   href={paperDetails.pdfLink}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-blue-500 hover:underline"
                 >
                   View PDF
                 </a>
               </p>
             )}
           </div>
         ) : (
           <p className="text-center text-gray-500">No paper details available.</p>
         )}
       </div>
     );
   }

   export default PaperDetails;
