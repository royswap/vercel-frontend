import React, { useEffect, useState } from "react";
import { gellAllusersBeforDate, gellmembersbycom, getallcommittees } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Listofallmembers() {
    const [data, setData] = useState([]);
    const [oldmembers, setOldmembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [conference_name, setConference_name] = useState('');
    const [committees, setCommittees] = useState([]);
    
    const navigate = useNavigate(); // <-- Initialize navigate
    
    useEffect(() => {
        const conference_id = sessionStorage.getItem("con");
        if (conference_id) {
          getallcommittees(conference_id)
            .then((res) => {
                setCommittees(res.data.committee);
                setConference_name(res.data.conferenceName);
                // SetData(false);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }, []);

    const getoldmembers = () => {
        const conference_id = sessionStorage.getItem("con");
        if (conference_id) {
          gellAllusersBeforDate(conference_id)
            .then((res) => {
              setOldmembers(res.data);
              console.log(res.data);
              
            })
            .catch((err) => {});
        }
      };

      const redirectToHome = () => {
        navigate('/select-conference'); // <-- This will navigate to the select-conference page
      };
    
      const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      };
    
    return (
        <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded overflow-auto bg-slate-50">
      {/* Home Icon and Title in One Line */}
      <div className="relative flex items-center">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>List of All Members</u>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Conference ID Missing
            </h2>
            <p className="mb-4">Please select a conference to proceed.</p>
            <button
              onClick={handleRedirect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Conference Selection
            </button>
          </div>
        </div>
      )}
      {data ? (
        <div>Loading..</div>
      ) : (
        <>
          <div className="md:flex justify-between">
            <div className="m-2 md:m-4">
              <h2 className="text-xl md:text-2xl text font-semibold text-black">
                Conference Name : {toSentenceCase(conference_name)}
              </h2>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Member ID</th>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {data.map((member) => (
                    <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.mobile}</td>
                    <td>{member.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </>
        )}
    </div>
    );
}

export default Listofallmembers;

