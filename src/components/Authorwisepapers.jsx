import React, { useEffect, useState } from 'react'
import { report_authorwisepaper } from '../services/ConferenceServices'
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function Authorwisepapers() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // <-- Initialize navigate
  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      report_authorwisepaper(conference_id).then((res) => {
        setData(res.data);
        console.log(res.data);
      }).catch((err) => {

      })
    }
  }, [])

  const redirectToHome = () => {
    navigate('/select-conference'); //redirection by home icon 
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}
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
              {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th> */}
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Track Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">First Author Country</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Co-authors</th>
              {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Copyright form, question or upload</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Copy right form submitted</th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.paper_title)}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.track_name)}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.first_author)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.first_author_email}</td>

                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.first_author_country)}</td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.co_authors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Authorwisepapers