import React, { useState, useEffect } from "react";
import { report_fetchpaperstatus } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

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
    navigate("/select-conference");
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const filteredData = data.filter(
    (item) =>
      toSentenceCase(item.name).includes(toSentenceCase(searchTerm)) ||
      toSentenceCase(item.paper_title).includes(toSentenceCase(searchTerm))
  );

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Paper Status Report", 14, 10);
    doc.autoTable({
      head: [
        [
          "Track",
          "Title",
          "First Author",
          "Co-Authors",
          "Keywords",
          "Review By",
          "Latest date of upload",
        ],
      ],
      body: filteredData.map((item) => [
        toSentenceCase(item.track_name),
        toSentenceCase(item.paper_title),
        toSentenceCase(item.name),
        toSentenceCase(item.co_authors),
        toSentenceCase(item.keywords),
        toSentenceCase(item.status),
        item.ldou,
      ]),
    });
    doc.save("Paper_Status_Report.pdf");
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Track: toSentenceCase(item.track_name),
        Title: toSentenceCase(item.paper_title),
        "First Author": toSentenceCase(item.name),
        "Co-Authors": toSentenceCase(item.co_authors),
        Keywords: toSentenceCase(item.keywords),
        "Review By": toSentenceCase(item.status),
        "Latest date of upload": item.ldou,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paper Status");
    XLSX.writeFile(workbook, "Paper_Status_Report.xlsx");
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-slate-50 rounded overflow-auto">
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
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

      {/* Export Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Export to PDF
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
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
                Keywords
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Review By
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Latest date of upload
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
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
