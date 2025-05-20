import React, { useEffect, useState } from 'react';
import { report_fetchreviewers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Listofreviewers() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_fetchreviewers(conference_id).then((res) => {
        setData(res.data);
        console.log(res.data);
        console.log(conference_id);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, []);

  const redirectToHome = () => {
    navigate('/select-conference');
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.reviewer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(item => ({
        "Reviewer ID": toSentenceCase(item.reviewer_id),
        Track: toSentenceCase(item.track_name),
        Name: toSentenceCase(item.name),
        Affiliation: toSentenceCase(item.affiliation),
        Country: toSentenceCase(item.country),
        Email: item.email,
        Mobile: item.mobile
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "List of Reviewers");
    XLSX.writeFile(workbook, "List_of_Reviewers_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("List of Reviewers", 14, 10);
    doc.autoTable({
      head: [
        ["Reviewer ID", "Track", "Name", "Affiliation", "Country", "Email", "Mobile"]
      ],
      body: data.map(item => [
        toSentenceCase(item.reviewer_id),
        toSentenceCase(item.track_name),
        toSentenceCase(item.name),
        toSentenceCase(item.affiliation),
        toSentenceCase(item.country),
        item.email,
        item.mobile
      ])
    });
    doc.save("List_of_Reviewers_Report.pdf");
  }

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
          <u>List of Reviewers</u>
        </div>
        {/* Search Bar */}
        <div className="absolute right-0 mr-4">
          <input
            type="text"
            placeholder="Search by Reviewer ID or Name"
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

      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Reviewer ID</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Affiliation</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Country</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.reviewer_id)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.track_name)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.name)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.affiliation)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.country)}</td>
                <td className="whitespace -nowrap px-4 py-2 font-medium text-gray-900">{item.email}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Listofreviewers;