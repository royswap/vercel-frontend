import React, { useEffect, useState } from 'react';
import { getallmembersoftpcbyconid } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Tpcmembers() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate('/select-conference');
  };

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con'); 
    if (conference_id) {
      getallmembersoftpcbyconid(conference_id)
        .then((response) => {
          setMembers(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching TPC members:', error);
        });
    }
  }, []);

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Filtered members based on search term
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      members.map((member) => ({
        Name: toSentenceCase(member.name),
        Email: member.email,
        Mobile: member.mobile,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TPC Members');
    XLSX.writeFile(workbook, 'TPC_Members_Report.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('TPC Members Report', 14, 10, { align: 'center' });
    doc.autoTable({
      head: [['Name', 'Email', 'Mobile']],
      body: members.map((member) => [
        toSentenceCase(member.name),
        member.email,
        member.mobile,
      ]),
    });
    doc.save('TPC_Members_Report.pdf');
  }

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />

      <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>TPC Members</u>
        </div>
        <div className="absolute right-0 mr-4">
        <input
          type="text"
          placeholder="Search by member name..."
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
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member._id}> {/* Ensure each row has a unique key */}
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(member.name)}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{member.email}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{member.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tpcmembers;