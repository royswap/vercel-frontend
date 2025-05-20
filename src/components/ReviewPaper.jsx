import React, { useState, useEffect } from 'react';
import { fetchreviewer, getpdf, fetchauthorwork, reviewsubmit } from '../services/ConferenceServices';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home36.png';

const ReviewPaper = () => {
  const [dateReviewed, setDateReviewed] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authorwork, setAuthorWork] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState([
    { qus: '1.Based on your assessment rather than on author statements, what is the new contribution of this paper?', ans: '' },
    { qus: '2.Does the contribution have good archival value, or is it only an incremental to existing knowledge?', ans: '' }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState('');
  const [criteriaData, setCriteriaData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const reviewerId = urlParams.get('reviewerId');
      setAuthorId(urlParams.get('authorWorkId'));
      const authorid = urlParams.get('authorWorkId');
      fetchreviewer(reviewerId).then((Response) => {
        setReviewer(Response.data);
        console.log(Response.data);
      }).catch((err) => {
        console.log(err);
      });
      fetchauthorwork(authorid).then((Response) => {
        setAuthorWork(Response.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, []);

  useEffect(() => {
    const getCurrentDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      let day = currentDate.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    };
    setDateReviewed(getCurrentDate());
  }, []);

  const fetchPdfOnClick = () => {
    getpdf(authorId)
      .then((url) => {
        setPdfUrl(url);
      })
      .catch((error) => {
        console.error('Error fetching PDF:', error);
      });
  };

  const handleRecommendationChange = (event) => {
    setSelectedRecommendation(event.target.value);
  };

  const handleGradeSelection = (criteriaIndex, gradeIndex, grade) => {
    const newCriteriaData = [...criteriaData];
    if (!newCriteriaData[criteriaIndex]) {
      newCriteriaData[criteriaIndex] = { grades: Array(5).fill(null) };
    }
    newCriteriaData[criteriaIndex].grades = newCriteriaData[criteriaIndex].grades.map((g, idx) => (idx === gradeIndex ? grade : null));
    setCriteriaData(newCriteriaData);
  };

  const addCriteriaField = () => {
    setCriteriaData([...criteriaData, { grades: Array(5).fill(null) }]);
  };

  const removeCriteriaField = (index) => {
    setCriteriaData(criteriaData.filter((_, i) => i !== index));
  };

  const handleCriteriaInputChange = (index, value) => {
    const updatedCriteriaData = [...criteriaData];
    if (!updatedCriteriaData[index]) {
      updatedCriteriaData[index] = { grades: Array(5).fill(null) };
    }
    updatedCriteriaData[index].name = value;
    setCriteriaData(updatedCriteriaData);
  };

  const handleAdditionalInputChange = (index, value) => {
    const updatedCriteriaData = [...criteriaData];
    if (!updatedCriteriaData[index]) {
      updatedCriteriaData[index] = { grades: Array(5).fill(null) };
    }
    updatedCriteriaData[index].additional = value;
    setCriteriaData(updatedCriteriaData);
  };

  const calculateTotalScore = () => {
    return criteriaData.reduce((acc, criteria) => {
      return acc + (criteria.grades.find(grade => grade !== null) || 0);
    }, 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {
      reviewerId: reviewer._id,
      paperId: authorId,
      reviewDate: dateReviewed,
      acceptance: selectedRecommendation,
      totalScore: calculateTotalScore()
    };

    const allCriteriaData = criteriaData.map(criteria => ({
      max_grade: criteria.name || '',
      score: criteria.grades.find(grade => grade !== null) || 0,
      min_grade: criteria.additional || '',
    }));

    const requestPayload = {
      name: allCriteriaData,
      review: data,
      coauthor: questionAnswers
    };
    // console.log(requestPayload);

    axios.post('http://localhost:3030/reviewer/reviewsubmit', requestPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response.data);
      alert(response.data.message || 'Review submitted successfully');
    }).catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message);
    });
  };


  const addNewQuestion = () => {
    if (newQuestionText.trim() !== '') {
      setQuestionAnswers([...questionAnswers, { qus: newQuestionText, ans: '' }]);
      setNewQuestionText('');
    }
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updatedQuestions = [...questionAnswers];
    updatedQuestions[index].ans = newAnswer;
    setQuestionAnswers(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestionAnswers(questionAnswers.filter((_, i) => i !== index));
  };

  const redirectToHome = () => {
    navigate('/select-conference'); //redirection by home icon 
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 bg-body-tertiary rounded bg-slate-50container mx-auto px-4">
      <div className="relative flex justify-between items-center mb-6">
    {/* Home Icon */}
    <div className="flex items-center">
      <img
        src={homeIcon}
        alt="Home"
        className="cursor-pointer w-8 h-8"
        onClick={redirectToHome}
      />
    </div>

    {/* Centered Title */}
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <h2 className="text-3xl font-semibold">
        <u>Paper Review Form</u>
      </h2>
    </div>

        <button className="inline-block text-end rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
          onClick={fetchPdfOnClick}>
          View PDF
        </button>

        {pdfUrl && (
          <div className="mt-3">
            <embed src={pdfUrl} type="application/pdf" className="w-full h-96" />
            <a href={pdfUrl} download="filename.pdf" className="bg-gray-500 text-white px-4 py-2 rounded mt-3 inline-block">
              Download PDF
            </a>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="paperTitle" className="block text-gray-700 font-medium mb-2">Paper Title:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              id="paperTitle"
              value={authorwork.title}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dateReviewed" className="block text-gray-700 font-medium mb-2">Date Reviewed:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              id="dateReviewed"
              value={dateReviewed}
              readOnly
            />
          </div>

          <div className="mb-4">
            {questionAnswers.map((question, index) => (
              <div key={index} className="mb-4">
                <label htmlFor={`customQuestionAnswer${index}`} className="block text-gray-700 font-medium mb-1">
                  {question.qus}
                </label>
                <textarea
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  id={`customQuestionAnswer${index}`}
                  rows="3"
                  placeholder="Enter your answer here..."
                  value={question.ans}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                ></textarea>
                <button
                  type="button"
                  className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"

                  onClick={() => deleteQuestion(index)}
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="mb-4 flex items-center">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mr-2"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter new question here..."
              />
              <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={addNewQuestion}>
                Add New Question
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Paper Grading</h3>
            {criteriaData.map((criteria, index) => (
              <div key={index} className="mb-4">
                <div className="mb-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    value={criteria.name || ''}
                    onChange={(e) => handleCriteriaInputChange(index, e.target.value)}
                    placeholder="Enter criteria name..."
                  />
                </div>
                <div className="flex items-center mb-2">
                  {criteria.grades.map((grade, gradeIndex) => (
                    <button
                      key={gradeIndex}
                      type="button"
                      className={`px-4 py-2 rounded mr-2 ${grade !== null ? 'bg-green-500 text-white' : 'bg-gray-300'
                        }`}
                      onClick={() => handleGradeSelection(index, gradeIndex, gradeIndex + 1)}
                    >
                      {gradeIndex + 1}
                    </button>
                  ))}
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    placeholder={`Additional Input`}
                    value={criteria.additional || ''}
                    onChange={(e) => handleAdditionalInputChange(index, e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                  onClick={() => removeCriteriaField(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mb-4 flex items-center">
              <button
                type="button"
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                onClick={addCriteriaField}
              >
                Add Criteria
              </button>
            </div>

          </div>
          <div className="mb-3">
            <label htmlFor="totalScore" className="form-label">
              Total Score:
            </label>
            <input
              type="number"
              className="form-control"
              id="totalScore"
              disabled
              value={calculateTotalScore()}
            />
          </div>
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Recommendation:</p>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  id="acceptWithoutChange"
                  name="recommendation"
                  value="acceptWithoutChange"
                  checked={selectedRecommendation === "acceptWithoutChange"}
                  onChange={handleRecommendationChange}
                />
                <label className="ml-2 text-gray-800" htmlFor="acceptWithoutChange">
                  Accept without change – The paper can be published in its current form.
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  id="acceptWithSuggestedChanges"
                  name="recommendation"
                  value="acceptWithSuggestedChanges"
                  checked={selectedRecommendation === "acceptWithSuggestedChanges"}
                  onChange={handleRecommendationChange}
                />
                <label className="ml-2 text-gray-800" htmlFor="acceptWithSuggestedChanges">
                  Accept with suggested but not mandatory changes – The paper can be published in its current form but could be made stronger by incorporating changes suggested by reviewers found on the following page.
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  id="acceptWithMandatoryChanges"
                  name="recommendation"
                  value="acceptWithMandatoryChanges"
                  checked={selectedRecommendation === "acceptWithMandatoryChanges"}
                  onChange={handleRecommendationChange}
                />
                <label className="ml-2 text-gray-800" htmlFor="acceptWithMandatoryChanges">
                  Accept with mandatory changes – The paper cannot be published in its current form, but is provisionally accepted if the authors incorporate mandatory changes suggested by the reviewers. It is the opinion of this reviewer that the changes are relatively minor and can be incorporated in ten weeks or less. (Reviewer, please provide comments on the following page.)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  id="doNotAccept"
                  name="recommendation"
                  value="doNotAccept"
                  checked={selectedRecommendation === "doNotAccept"}
                  onChange={handleRecommendationChange}
                />
                <label className="ml-2 text-gray-800" htmlFor="doNotAccept">
                  Do not accept – The paper cannot be accepted in its current form. (Reviewer, please provide comments on the following page.)
                </label>
              </div>
            </div>
          </div>



          <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
            <div className="bg-blue-600 text-white text-lg font-semibold rounded-t-lg px-4 py-2">
              Reviewer's Information
            </div>
            <div className="p-4">
              {/* Render reviewer data if available */}
              {reviewer && (
                <>
                  <p className="text-gray-700 mb-2">Reviewer's Name: <span className="font-semibold">{reviewer.name}</span></p>
                  <p className="text-gray-700 mb-2">Mobile No: <span className="font-semibold">{reviewer.mobile}</span></p>
                  <p className="text-gray-700">Reviewer’s E-mail Address: <span className="font-semibold">{reviewer.email}</span></p>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <button type="submit" className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>

      {/* Reviewer’s Information Section */}

    </div>
  );
};

export default ReviewPaper;
