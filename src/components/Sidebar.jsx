import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    // Set the initial value based on the current window size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Menus = [
    {
      title: 'Create Conference',
      src: 'Chart_fill',
      path: '/create-conference',
    },
    {
      title: 'Conference',
      src: 'Chat',
      path: '/select-conference',
      subMenu: [
        { title: 'Committee', path: '/committee' },
        { title: 'Members', path: '/Members' },
        { title: 'Track', path: '/tracks' },
        { title: 'Reviewers', path: '/reviewers-registration' },
        { title: 'Check Plagiarism', path: '/select-conference/sub5' },
        { title: 'Send for Copyright', path: '/select-conference/sub6' },
        { title: 'Author Registration', path: '/authors-registration' },
      ],
    },
    // Add more menus with submenus as needed
    { title: 'Reviewer Invitation', path: '/reviewer-invitation' },
    { title: 'Allot Paper', src: 'Calendar', path: '/allot-paper' },
    { title: 'Review Format', src: 'Search', path: '/review-format' },
    { title: 'Report', src: 'Chart', path: '/select-conference',subMenu: [
         {title:'List of Papers',path:'/listofpapers'},
        //  {title:'Paper Details',path:'/paperdetails'},
         {title:'Authors-wise List of Papers',path:'/authorwisepapers'},
         {title:'Track-wise List of Papers',path:'/trackwisepapers'},
         {title:'TPC Members',path:'/tpcmembers'},
         {title:'List of Reviewers',path:'/listofreviewers'},
         {title:'List of First Authors',path:'/listoffirstauthors'},
         {title:'List of All Authors',path:'/Listofallauthors'},
         {title:'List of Papers with Status and Last Date of Upload',path:'/papers_status_last_upload_date'},
         {title:'List of Papers with Reviewers',path:'/papers_with_reviewers'},
         {title:'List of Papers Allotted to the Reviewers',path:'/paper_allot_reviewer_report'},
         {title:'List of Papers Sent for Copyright',path:'/paper_sent_copy_right'},
         {title:'List of Committee Members',path:'/list_committee_members'},
    ] }
  ];

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <div className="flex">
      <div className={` ${open ? 'w-72' : 'w-20 '} bg-yellow-500 h-auto p-5 pt-8 relative duration-300` }>
        {/* <img
          src="./src/assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && 'rotate-180'}`}
          onClick={() => setOpen(!open)}
        /> */}
        <div>
        
        </div>
        {/* <div className="flex gap-x-4 items-center">
          <img
            src="./src/assets/logo.png"
            className={`cursor-pointer duration-500 ${open && 'rotate-[360deg]'}`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${!open && 'scale-0'}`}
          >
            
          </h1>
        </div> */}
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li key={index} className="relative">
              <Link to={Menu.path}><div
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4 ${Menu.gap ? 'mt-9' : 'mt-2'} ${index === 0 && 'bg-light-white'}`}
                onClick={() => toggleSubMenu(index)}
              >
                {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
                <span className={`${!open && 'hidden'} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </div></Link>
              {Menu.subMenu && activeMenu === index && (
                <ul className={`${!open && 'hidden'} pl-12 mt-2 space-y-2`}>
                  {Menu.subMenu.map((subMenuItem, subIndex) => (
                    <li key={subIndex} className={`text-black text-sm ml-4`}>
                      <Link to={subMenuItem.path} className={`hover:text-white`}>
                        {subMenuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li> 
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
