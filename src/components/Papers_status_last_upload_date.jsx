import React, { useState, useEffect } from "react";
import { report_fetchpaperstatus } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Papers_status_last_upload_date() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      report_fetchpaperstatus(conference_id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching paper status:", err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate("/select-conference"); // This will navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      toSentenceCase(item.name).includes(toSentenceCase(searchTerm)) ||
      toSentenceCase(item.paper_title).includes(toSentenceCase(searchTerm))
  );

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-slate-50 rounded overflow-auto">
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // Add this onClick handler
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>Paper Status</u>
        </div>

        {/* Search Bar */}
        <div className="absolute right-0 mr-4">
          <input
            type="text"
            placeholder="Search by Author Name or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-2 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
        {" "}
        {/* Set max height for vertical scrolling */}
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
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
                Keywords
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Review By
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Last date of upload
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Score
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Decision
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray- 900">
                  {toSentenceCase(item.track_name)}
                </td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.paper_title)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.name)}
                </td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.co_authors)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.keywords)}
                </td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.status)}
                </td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.ldou}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Papers_status_last_upload_date;
