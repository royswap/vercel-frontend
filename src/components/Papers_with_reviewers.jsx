import React, { useEffect, useState } from "react";
import { fetchpaperwithreviewer } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Papers_with_reviewers() {
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/select-conference");
  };

  useEffect(() => {
    fetchpaperwithreviewer()
      .then((response) => {
        console.log(response.data); // Log data to inspect its structure
        setPapers(response.data); // Accessing data directly from response
      })
      .catch((error) => console.error('Error fetching papers:', error));
  }, []);
  

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50">
      {/* Home Icon */}
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
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Track
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                First Author
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Co-Authors
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Reviewers
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {papers.map((paper) => (
              <tr key={paper._id || paper.title}> {/* Ensure unique key */}
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {paper.track_name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {paper.paper_title || "N/A"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {paper.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {paper.co_authors || "N/A"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {paper.reviewers || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Papers_with_reviewers;
