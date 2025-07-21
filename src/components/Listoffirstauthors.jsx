import React, { useEffect, useState } from "react";
import { report_fetchfirstsuthors } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Listoffirstauthors() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      report_fetchfirstsuthors(conference_id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate("/select-conference"); // Navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Name: toSentenceCase(item.name),
        Mobile: item.mobile,
        Email: item.email,
        Affiliation: toSentenceCase(item.affiliation),
        Country: toSentenceCase(item.country),
        Title: toSentenceCase(item.paper_title),
        Track: toSentenceCase(item.track_name),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "List of First Authors");
    XLSX.writeFile(workbook, "List_of_First_Authors_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("List of First Authors", 14, 10);
    doc.autoTable({
      head: [
        [
          "Name",
          "Mobile",
          "Email",
          "Affiliation",
          "Country",
          "Title",
          "Track",
        ],
      ],
      body: data.map((item) => [
        toSentenceCase(item.name),
        item.mobile,
        item.email,
        toSentenceCase(item.affiliation),
        toSentenceCase(item.country),
        toSentenceCase(item.paper_title),
        toSentenceCase(item.track_name),
      ]),
    });
    doc.save("List_of_First_Authors_Report.pdf");
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50">
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome} // Add this onClick handler
        />

        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>List of First Authors</u>
        </div>
        {/* Search Bar */}
        <div className="absolute right-0 mr-4">
          <input
            type="text"
            placeholder="Search by author name..."
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

      {/* Table with vertical scroll only */}
      <div className="overflow-y-auto max-h-96">
        {" "}
        {/* Set max height and enable vertical scrolling */}
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Mobile
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Email
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Affiliation
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Country
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Track
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="whitespace-nowrap px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {toSentenceCase(item.name)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {item.mobile}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {item.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {toSentenceCase(item.affiliation)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {toSentenceCase(item.country)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {toSentenceCase(item.paper_title)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {toSentenceCase(item.track_name)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Listoffirstauthors;
