import React, { useState, useEffect } from 'react';
import { getalltracks } from '../services/ConferenceServices';
import { getallauthorworksbytrack } from '../services/ConferenceServices';
import { getallreviewersbytrack } from '../services/ConferenceServices';
import { createPaperallot } from '../services/ConferenceServices';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

const PaperManagement = () => {
  // Sample data for the table
  const initialData = [
    { author: 'John Doe', date: '24/05/1995', profession: 'Web Developer' },
    { author: 'Jane Doe', date: '04/11/1980', profession: 'Web Designer' },
    { author: 'Gary Barlow', date: '24/05/1995', profession: 'Singer' },
    { author: 'Alice Smith', date: '15/02/1990', profession: 'Graphic Designer' },
    { author: 'Bob Johnson', date: '20/03/1985', profession: 'Software Engineer' },
    { author: 'Carol White', date: '30/06/1987', profession: 'Project Manager' },
    { author: 'Dave Brown', date: '05/09/1992', profession: 'Data Scientist' },
    { author: 'Eve Davis', date: '12/12/1983', profession: 'UX Designer' },
    { author: 'Frank Miller', date: '22/07/1991', profession: 'Product Owner' }
  ];

  const [tracks, setTracks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [reviewers, setReviewers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      getalltracks(conference_id).then((res) => {
        setTracks(res.data.tracks);
      }).catch((err) => {

      })
    } else {
      setShowPopup(true);
    }

  }, [])

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [selectedReviewerName, setSelectedReviewerName] = useState('');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [success, setSuccess] = useState(false);
  const itemsPerPage = 5;

  // Filter data based on the search term
  const filteredData = initialData.filter(item =>
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute the current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Compute the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [papers, setPapers] = useState([]);
  const handleTrackChange = (event) => {
    const trackId = event.target.value;
    //setSelectedTrackId(trackId);
    console.log('Selected track ID:', trackId);
    getallauthorworksbytrack(trackId).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setPapers(res.data);
      } else {
        setPapers([]);
        // console.log('No data found for this track');
      }
    }).catch((err) => {

    })
    getallreviewersbytrack(trackId).then((res) => {
      setReviewers(res.data);
    }).catch(() => {

    })
  };

  const handleRowClick = (id, name) => {
    setSelectedPaper(name);
    setSelectedPaperId(id);
    // Add any additional logic you need here
  };
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedReviewer = reviewers.find(reviewer => reviewer._id === selectedId);
    if (selectedReviewer) {
      // console.log("Selected Reviewer ID:", selectedReviewer._id);
      // console.log("Selected Reviewer Name:", selectedReviewer.name);
      // Add any additional logic you need here
      setSelectedReviewerId(selectedReviewer._id)
      setSelectedReviewerName(selectedReviewer.name);
    }
  };
  const [data, setData] = useState([]);
  const handleAdd = (e) => {
    e.preventDefault();
    const newData = { reviewer: selectedReviewerName, paper: selectedPaper, reviewer_id: selectedReviewerId, authorwork_id: selectedPaperId };
    setData([...data, newData]);
  }
  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };
  const handleAllDelete = () => {
    setData([]);
  };
  const finalsubmit = () => {
    if (data.length <= 0) {
      alert('Please select data');
      return;
    }

    // Function to check for duplicates based on reviewer_id and authorwork_id
    const hasDuplicates = () => {
      const seen = new Set();
      for (const item of data) {
        const key = `${item.reviewer_id}-${item.authorwork_id}`;
        if (seen.has(key)) {
          return true;
        }
        seen.add(key);
      }
      return false;
    };

    if (hasDuplicates()) {
      alert('Duplicate entries found.');
      return;
    }

    // If no duplicates, proceed with processing data
    const outputData = data.map((item) => ({
      reviewer_id: item.reviewer_id,
      authorwork_id: item.authorwork_id,
    }));

    createPaperallot(outputData)
      .then((res) => {
        setSuccess(true);
        handleAllDelete();

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000); // 5000 milliseconds = 5 seconds
      })
      .catch((err) => {
        let errorMessage = 'An error occurred. Please try again later.'; // Default error message

        if (err.response) {
          if (err.response.status === 400) {
            // Handle specific duplicate data error here
            errorMessage = err.response.data.error || 'Duplicate data error.';
          } else if (err.response.status === 500) {
            // Handle other server-side errors
            errorMessage = 'Server error. Please try again later.';
          } else {
            // Handle other HTTP errors
            errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
          }
        } else if (err.message) {
          // Handle network errors or unexpected errors
          errorMessage = err.message;
        }

        // Display error message to the user
        alert(errorMessage);
      });
  };
  const handleRedirect = () => {
    // history.push('/another-page'); // Change '/another-page' to the actual path you want to redirect to
    navigate('/select-conference');
  };

  const redirectToHome = () => {
    navigate('/select-conference'); //redirection by home icon 
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
      className="cursor-pointer w-8 h-8 mb-10"
      onClick={redirectToHome}
    />
    <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl mb-10">
      <u>Allot Papers to Reviewers</u>
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
      {success && (
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
          <span className="font-medium">Success!</span> assigned paper to reviewer successfully!
        </div>
      )}
      {/* Row 1 */}
      <div className="md:grid md:grid-cols-2 md:gap-4">
        
        {/* Column 1 */}
        <div className="bg-white p-4 border border-zinc-700 rounded shadow-md">
          <div className='text-xl mb-4 text-center'>Allotment Of Papers</div>
          <form onSubmit={handleAdd} >
            <div className='mb-4'>
              <label
                htmlFor="track"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Track</span>
                <select
                  id="track"
                  name="track"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  onChange={handleTrackChange}
                  required
                >
                  <option selected>Select an option</option>
                  {tracks.map((track) => (
                    <option key={track._id} value={track._id}>
                      {toSentenceCase(track.track_name)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='mb-4'>
              <label
                htmlFor="reviewers"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Reviewers</span>
                <select
                  id="reviewers"
                  name="reviewers"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  onChange={handleSelectChange}
                  required
                >
                  <option>Select an option</option>
                  {reviewers.map((reviewer) => (
                    <option className='text-sm font-medium text-gray-600 gap-5 '  
                    key={reviewer._id} value={reviewer._id}>
                      {toSentenceCase(reviewer.name)} - {reviewer.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='mb-4'>
              <label
                htmlFor="paper"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">Paper</span>
                <input
                  type="text"
                  id="paper"
                  name="paper"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  value={toSentenceCase(selectedPaper)}
                  required
                />
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Column 2 */}
        <div className="bg-white p-4 border border-zinc-700 rounded shadow-md cursor-pointer">
          <div className='flex items-center justify-between text-xl mb-4'>
            <div>List Of Papers</div>
            <div className="relative">
              <label htmlFor="Search" className="sr-only">Search</label>
              <input
                type="text"
                id="Search"
                placeholder="Search for..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm p-3"
              />
              <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button type="button" className="text-gray-600 hover:text-gray-700">
                  <span className="sr-only">Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
          <div className='mt-4'>
            <div className="rounded-lg border border-gray-200">
              <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className="ltr:text-left rtl:text-right">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {papers.map((item, index) => (
                      <tr key={index} onClick={() => handleRowClick(item._id, item.title)}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.name)}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.title)}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                <ol className="flex justify-end gap-1 text-xs font-medium">
                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                      className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    >
                      <span className="sr-only">Prev Page</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>

                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={() => handlePageChange(index + 1)}
                        className={`block size-8 rounded border ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-100 bg-white text-gray-900'} text-center leading-8`}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}

                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    >
                      <span className="sr-only">Next Page</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Row 2 */}
      <div className="bg-white p-4 border border-zinc-700 rounded shadow-md mt-10">
        {/*
      Heads up! 👋
      This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
    */}

        <div className="overflow-x-auto overflow-y-auto max-h-[200px]"> {/* Added overflow classes and max height */}
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Reviewer Name</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Paper</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{toSentenceCase(item.reviewer)}</td>

                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{toSentenceCase(item.paper)}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <button
                        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                        title="Delete Product"
                        onClick={() => handleDelete(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>

          </div>
        </div>
        {/* for button */}
        <div className="md:space-x-6 md:gap-4">
          {/* Base */}

          <a
            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
            href="#"
            onClick={finalsubmit}
          >
            Submit
          </a>

          {/* Border */}

          <a
            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
            href="#"
            onClick={handleAllDelete}
          >
            Delete
          </a>
        </div>
      </div>

    </div>
  );
};

export default PaperManagement;
