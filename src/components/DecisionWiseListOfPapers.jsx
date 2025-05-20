import React, { useState, useEffect } from 'react';
import { report_allpapers } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function DecisionWiseListOfPapers() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_allpapers(conference_id)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
          console.log(conference_id);
        })
        .catch((err) => {
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
    toSentenceCase(item.author_name).includes(toSentenceCase(searchTerm)) || 
    toSentenceCase(item.paper_title).includes(toSentenceCase(searchTerm))
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(item => ({
        Id: item._id,
        Title: toSentenceCase(item.paper_title),
        Author: toSentenceCase(item.author_name),
        Decision: item.decision
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Decisionwise Papers');
    XLSX.writeFile(workbook, 'Decisionwise_Papers_Report.xlsx');
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Decisionwise Papers Report", 14, 10);
    doc.autoTable({
      head: [['Id', 'Title', 'Author', 'Decision']],
      body: data.map(item => [
        item._id,
        toSentenceCase(item.paper_title),
        toSentenceCase(item.author_name),
        item.decision
      ]),
    });
    doc.save('Decisionwise_Papers_Report.pdf');
  }
  


  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50'>
      <div className="flex items-center justify-between mb-8">
        <div>
          <img
            src={homeIcon}
            alt="Home"
            className="cursor-pointer w-8 h-8"
            onClick={redirectToHome}
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-3xl font-semibold">
            <u>Decision Wise List of Papers</u>
          </h2>
        </div>
        <div className="flex justify-end w-full">
          <input
            type="text"
            placeholder="Search by Author or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded p-2"
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

      <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Set max height for vertical scrolling */}
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Decision</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item._id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {toSentenceCase(item.paper_title)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.author_name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {item.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DecisionWiseListOfPapers;