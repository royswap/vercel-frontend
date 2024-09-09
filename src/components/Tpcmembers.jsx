import React, { useEffect, useState } from 'react';
import { getallmembersoftpcbyconid } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Tpcmembers() {
  const [members, setMembers] = useState([]);
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

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/* Home Icon */}
      <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
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
            {members.map((member) => (
              <tr key={member._id}> {/* Ensure each row has a unique key */}
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{member.name}</td>
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
