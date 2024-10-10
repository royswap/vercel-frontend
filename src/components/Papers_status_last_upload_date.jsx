import React, { useState, useEffect } from "react";
import { report_fetchpaperstatus } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Papers_status_last_upload_date() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // <-- Initialize navigate
  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      report_fetchpaperstatus(conference_id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {});
    }
  }, []);

  const redirectToHome = () => {
    navigate("/select-conference"); // <-- This will navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50">
      {/* Home Icon */}
      <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // <-- Add this onClick handler
        />
      </div>

      <div className="overflow-x-auto">
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
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
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
