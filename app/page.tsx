import React from 'react';

const BASE_PATH = "your-base-path-here";
const withBase = (path) => `${BASE_PATH}${path}`;

// Other imports...

const projectsData = [
  { img: withBase("/images/taiwan-cityscape.jpg"), ... },
  { img: withBase("/images/profile-photo.jpg"), ... },
  // Rest of the projects...
];

const App = () => {
  return (
    <div>
      <img src={withBase("/images/taiwan-cityscape.jpg")} alt="Taiwan Landscape" />
      <img src={withBase("/images/profile-photo.jpg")} alt="Profile" />
      <a href={withBase("/cv/Ignatius_Harry_CV.pdf")}>Download CV</a>
      {/* Other components... */}
    </div>
  );
};

export default App;
