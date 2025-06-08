import React, { useState, useEffect } from 'react';
import { getalltracks, createTracks, deleteTrack } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

function TrackRegistration() {
  const [tracks, setTracks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conference_name, setConference_name] = useState([]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [temp, setTemp] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [data,SetData]=useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      getalltracks(conference_id)
        .then((res) => {
          setTracks(res.data.tracks);
          setConference_name(res.data.conferenceName);
          SetData(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setShowPopup(true);
    }
  }, [temp]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const handleDeleteClick = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
  };

  const removeTrack = (id) => {
    deleteTrack(id)
      .then((res) => {
        setTemp((prevTemp) => prevTemp + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const anyNameExistsInTrack = (trackNames) => {
    return trackNames.some((name) =>
      tracks.some((track) => track.track_name === name)
    );
  };

  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  const handleforsave = () => {
    if (!hasDuplicates(items) && !anyNameExistsInTrack(items)) {
      setLoading(true);
      const com = {
        tracks: items
      };
      const conference_id = sessionStorage.getItem('con');
      if (conference_id) {
        createTracks(conference_id, com)
          .then((res) => {
            setLoading(false);
            setTemp((prevTemp) => prevTemp + 1);
            setSuccess(true);
            setItems([]);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else {
      alert('Duplicate entry');
    }
  };

  const handleRedirect = () => {
   // history.push('/another-page'); // Change '/another-page' to the actual path you want to redirect to
   navigate('/select-conference');
  };

  const redirectToHome = () => {
    navigate('/select-conference'); //redirection by home icon 
  };

  // Function to format conference name in proper title case
  const toTitleCase = (str) => {
    if (!str) return '';
    const minorWords = ['on', 'and', 'the', 'in', 'of', 'for', 'with'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (word === 'ai') return 'AI'; // Special case for "AI"
        if (index === 0 || !minorWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
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
      <u>Create the Tracks</u>
    </div>
  </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Conference ID Missing</h2>
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
     ):(
      <>
      <div>{success && (
        <div
          className="flex items-center justify-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-4.293-3.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="font-medium">Success!</span> Tracks submitted successfully!
        </div>
      )}</div>
      <div className='w-full m-6'>
        <h2 className='text-2xl text font-semibold text-black'>Conference Name: {toTitleCase(conference_name)}</h2>
      </div>
      <div className='w-full md:flex'>
        {/* for form */}
        <div className='w-full m-3 h-96 border border-2 border-cyan-700'>
          <div className='text-center text-xl'>
            <h2>Track</h2>
          </div>
          <div className='p-4'>
            <div className="relative">
              <input
                type="search"
                id="search"
                className="block w-full p-3 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder=""
                value={inputValue}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="text-black absolute end-2.5 bottom-2.5  bg-slate-300  hover:bg-slate-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-3 py-1 " 
                onClick={handleAddClick}
              >
                ADD
              </button>
            </div>
          </div>
          <div className='w-96 h-48 ml-5 overflow-auto'>
            <ul className="p-4 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item}</span>
                  <button
                    className="text-red-600 hover:text-red-800 text-2xl"
                    onClick={() => handleDeleteClick(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex items-center justify-center mt-6'>
            <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
          href="#"
              onClick={handleforsave}
            >
              Save
            </a>
          </div>
          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          )}
        </div>
        {/* for table */}
        <div className='w-full m-3 h-96 border border-2 border-cyan-700 overflow-auto'>
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tracks.map((track) => (
                  <tr key={track._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {track.track_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => removeTrack(track._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </>
     )}
    </div>
  );
}

export default TrackRegistration;
