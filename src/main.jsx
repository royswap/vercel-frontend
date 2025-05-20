import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Admin_Layout from './Admin_Layout.jsx'
import ConferenceCreation from './components/ConferenceCreation.jsx'
import ConferenceSelection from './components/ConferenceSelection.jsx'
import AuthorRegistration from './components/AuthorRegistration.jsx'
import ReviewPaper from './components/ReviewPaper.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// const router=createBrowserRouter([
//   {
//     path:'/authors-registration',
//     element:<AuthorRegistration/>
//   },{
//     path:'/review-format',
//     element:<ReviewPaper />
//   }
// ])

{/* <Route
          path="/authors-registration"
          element={<AuthorRegistration />}
        />
        <Route
          path="/review-format"
          element={<ReviewPaper />}
        /> */}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// ReactDOM.createRoot(document.getElementById('root1')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
