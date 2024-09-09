import React, { useState, useEffect } from 'react';
import { getalltracks } from '../services/ConferenceServices';
import { emailsend } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';


function ReviewInvitation() {
  const [tracks, setTracks] = useState([]);
  const [trackId, setTrackId] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');

  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      getalltracks(conference_id)
        .then((res) => {
          setTracks(res.data.tracks);
        })
        .catch((err) => {
          // Handle error
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      trackId,
      date,
      name,
      designation,
    };
    console.log(formData);
    emailsend(trackId,date,name,designation).then((res)=>{
      console.log(res.data);
    }).catch((err)=>{

    })
    // Here you can add the logic to send the formData to your server or handle it as needed
  };

  const redirectToHome = () => {
    navigate('/select-conference'); //redirection by home icon 
  };

  return (
    <div className='w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50'>
      {/* Home Icon */}
      <div className="w-full text-left ">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
      </div>
      <div className='flex items-center justify-center text-3xl )'>Review Details</div>
      <div className='mt-1 p-4'>
        <form onSubmit={handleSubmit}>
          <div className='m-2'>
            <label
              htmlFor="track"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700">Track</span>
              <select
                id="track"
                name="track"
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                required
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
              >
                <option value="" disabled>Select an option</option>
                {tracks.map((track) => (
                  <option key={track._id} value={track._id}>
                    {track.track_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='m-2'>
            <label
              htmlFor="toDate"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700">Due Date for Review</span>
              <input
                type="date"
                id="toDate"
                name="toDate"
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <div className='m-4'>
            Thank you for your willingness to serve as a reviewer. Peer review is one of the most important activities of our Society, and your help is appreciated. Written comments are usually the most helpful part of a review. Please provide comments on the second page or on separate sheets. The grading section below is intended to help identify key points for written comments, and also to allow comparisons among different reviewers. A good paper should have a high overall score, but does not have to score well in all aspects to be acceptable. For example, a concise, critical review paper is a valuable publication, although it might have little intrinsic originality. A paper that introduces important new concepts might be valuable even with limited experimental work. <br /> <br /> Please accept this invitation of review in the revert mail along with mentioning your conflict of interest. Without this your acceptance to this invitaion will not be considered.<br />Regards
          </div>
          <div className="flex gap-4 m-2">
            <div className="flex-1 m-2">
              <label
                htmlFor="name"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Name</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div className="flex-1 m-2">
              <label
                htmlFor="designation"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Designation</span>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <button
              type="submit"
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
              >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewInvitation;
