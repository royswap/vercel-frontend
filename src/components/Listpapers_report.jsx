import React, { useState, useEffect } from "react";
import { report_allpapers } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import homeIcon from "../assets/home36.png";

// Modal Component for Paper Details
const PaperDetailsModal = ({ isOpen, onClose, paperDetails }) => {
  if (!isOpen) return null;

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded shadow-lg w-100">
        <h2 className="text-2xl font-bold mb-4">Paper Details</h2>
        <p>
          <strong>Paper ID:</strong> {paperDetails.paper_id}
        </p>
        <p>
          <strong>Paper Name:</strong> {toSentenceCase(paperDetails.paper_title)}
        </p>
        <p>
          <strong>Keywords:</strong> {toSentenceCase(paperDetails.keywords)}
        </p>
        <p>
          <strong>Affiliation:</strong> {toSentenceCase(paperDetails.affiliation)}
        </p>
        <p>
          <strong>Abstract:</strong> {toSentenceCase(paperDetails.abstract)}
        </p>
        <p>
          <strong>Track Name:</strong> {toSentenceCase(paperDetails.track_name)}
        </p>
        <p>
          <strong>Author:</strong> {toSentenceCase(paperDetails.author_name)}
        </p>
        <p>
          <strong>Co-authors:</strong> {toSentenceCase(paperDetails.coAuthors)}
        </p>
        <p>
          <strong>PDF:</strong>{" "}
          {paperDetails.pdfLink ? (
            <a
              href={paperDetails.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          ) : (
            "No PDF available"
          )}
        </p>
        <button
          onClick={onClose}
          className="mt-4 py-2 px-4 rounded text-black-500 border border-indigo-600 bg-indigo-200 hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

function Listpapers_report() {
  const [data, setData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      report_allpapers(conference_id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

  const redirectToHome = () => {
    navigate("/select-conference");
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        ID: item._id,
        Title: item.paper_title,
        "Track Name": item.track_name,
        Author: item.author_name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Papers");
    XLSX.writeFile(workbook, "Papers_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("List of Papers Report", 14, 10);

    const tableColumn = ["ID", "Title", "Track Name", "Author"];
    const tableRows = data.map((item) => [
      item._id,
      item.paper_title,
      item.track_name,
      item.author_name,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Papers_Report.pdf");
  };

  const filteredData = data.filter((item) =>
    item.paper_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <img
            src={homeIcon}
            alt="Home"
            className="cursor-pointer w-8 h-8"
            onClick={redirectToHome}
          />
        </div>
        <div className="absolute right-0 mr-10">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search paper title"
            className="px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-3xl font-semibold">
            <u>List of Papers</u>
          </h2>
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

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Id
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Track Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Author Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
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
      {isModalOpen && selectedPaper && (
        <PaperDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          paperDetails={{
            paper_id: selectedPaper._id,
            paper_title: selectedPaper.paper_title,
            author_name: selectedPaper.author_name || "N/A",
            coAuthors: selectedPaper.coauthor_name,
            track_name: selectedPaper.track_name,
            keywords: selectedPaper.keywords,
            affiliation: selectedPaper.affiliation,
            pdfLink: selectedPaper.pdf,
          }}
        />
      )}
    </div>
  );
}

export default Listpapers_report;
