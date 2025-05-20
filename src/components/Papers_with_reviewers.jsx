import React, { useEffect, useState } from "react";
import { fetchpaperwithreviewer } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Papers_with_reviewers() {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const filteredPapers = papers.filter((paper) => {
    return (
      paper.paper_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.reviewers.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      papers.map((paper) => ({
        Track: toSentenceCase(paper.track_name),
        Title: toSentenceCase(paper.paper_title),
        "First Author": toSentenceCase(paper.name),
        "Co-Authors": toSentenceCase(paper.co_authors),
        Reviewers: toSentenceCase(paper.reviewers),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Papers with Reviewers");
    XLSX.writeFile(workbook, "Papers_with_Reviewers_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("List of Papers with Reviewers", 14, 10);
    doc.autoTable({
      head: [
        ["Track", "Title", "First Author", "Co-Authors", "Reviewers"],
      ],
      body: papers.map((paper) => [
        toSentenceCase(paper.track_name),
        toSentenceCase(paper.paper_title),
        toSentenceCase(paper.name),
        toSentenceCase(paper.co_authors),
        toSentenceCase(paper.reviewers),
      ]),
    });
    doc.save("Papers_with_Reviewers_Report.pdf");
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
          <u>List of Papers with Reviewers</u>
        </div>

      {/* Search Bar */}
      <div className="absolute right-0 mr-4">
        <input
          type="text"
          placeholder="Search by Paper Title or Reviewer"
          className="w-64 pl-2 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredPapers.map((paper) => (
              <tr key={paper._id || paper.title}> {/* Ensure unique key */}
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {toSentenceCase(paper.track_name || "N/A")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {toSentenceCase(paper.paper_title || "N/A")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {toSentenceCase(paper.name || "N/A")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {toSentenceCase(paper.co_authors || "N/A")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {toSentenceCase(paper.reviewers || "N/A")}
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