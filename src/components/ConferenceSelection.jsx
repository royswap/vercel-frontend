// Conference selction page
import React, { useEffect, useState } from 'react';
import { getAllConference } from '../services/ConferenceServices';
import { getConferenceById } from '../services/ConferenceServices';

function ConferenceSelection() {
  const [conferences, setConference] = useState([]);
  const [selectedconference, setSelectedConference] = useState([]);
  const [temp, setTemp] = useState();
  const [data, SetData] = useState(true);

  useEffect(() => {
    getAllConference().then((Response) => {
      setConference(Response.data);
      SetData(false);
    }).catch((err) => {
      console.log(err);
    })
  }, []);
  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      getConferenceById(conference_id).then((Response) => {
        setSelectedConference(Response.data);
      }).catch((err) => {
        console.log(err);
      })
    }
    setTemp(0);
  }, [temp]);

  const handleConferenceChange = (event) => {
    const selectedConferenceId = event.target.value;
    //console.log(selectedConferenceId);
    sessionStorage.setItem('con', selectedConferenceId);
    // alert("conference set successfully done");
    // getSelectedConference();
    setTemp(1);
  };
  // const getSelectedConference=()=>{
  //   const conference_id=sessionStorage.getItem('con');
  //   console.log(conference_id);
  //   if (conference_id) {
  //     getConferenceByid(conference_id).then((Response)=>{
  //       Setselectedconference(Response.data);
  //     }).catch((err)=>{
  //        console.log(err);
  //     })
  //     //throw new Error('Conference ID not found in session storage.');
  //   } 

  // };

  return (
    <div className="w-full h-full border-3 shadow-sm p-3 mb-5 bg-slate-50 rounded-lg overflow-auto">
      {data ? (
        <div>
          Loading..
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">

          {/* Column 1 */}
          <div className="md:w-1/4 w-full bg-white p-4 h-full overflow-auto">
            <div>
              <label
                htmlFor="expectedSubmissions"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Select Conference</span>
                <select
                  id="expectedSubmissions"
                  name="expectedSubmissions"
                  onChange={handleConferenceChange}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                >
                  <option value="" selected>Select an option</option>
                  {conferences.map((con) => (
                    <option key={con._id} value={con._id}>{con.conference_title}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Column 2 */}
          <div className="md:w-3/4 w-full bg-white p-4 border border-zinc-700 rounded h-full">
            <div className="flex items-center justify-center text-4xl mb-4">Conference</div>
            <form className="space-y-6 m-3 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="conferenceTitle"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Conference Title</span>
                    <input
                      type="text"
                      id="conferenceTitle"
                      name="conferenceTitle"
                      value={selectedconference.conference_title}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="shortName"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Short Name</span>
                    <input
                      type="text"
                      id="shortName"
                      name="shortName"
                      value={selectedconference.short_name}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="website"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Website</span>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={selectedconference.website}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="venue"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Venue</span>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={selectedconference.venue}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Address</span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={selectedconference.address}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="place"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Place</span>
                    <input
                      type="text"
                      id="place"
                      name="place"
                      value={selectedconference.place}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">State</span>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={selectedconference.state}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Country</span>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={selectedconference.country}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">From Date</span>
                    <input
                      type="text"
                      id="fromDate"
                      name="fromDate"
                      value={selectedconference.from_date}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="toDate"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">To Date</span>
                    <input
                      type="date"
                      id="toDate"
                      name="toDate"
                      value={selectedconference.to_date}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="dateOfCallForPaper"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Date Of Call For Paper</span>
                    <input
                      type="date"
                      id="dateOfCallForPaper"
                      name="dateOfCallForPaper"
                      value={selectedconference.date_of_call_for_paper}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="lastDateForSubmission"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">Last Date For Submission Paper</span>
                    <input
                      type="date"
                      id="lastDateForSubmission"
                      name="lastDateForSubmission"
                      value={selectedconference.last_date_paper_sub}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="expectedSubmissions"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">How Many Submissions Do You Expect</span>
                    <input
                      id="expectedSubmissions"
                      name="expectedSubmissions"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled
                      value={selectedconference.number_of_papers}
                    />

                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>

  );
}

export default ConferenceSelection;
