const fs = require('fs');
const path = require('path');

const files = [
  'c:/New folder/Gym/Fronted/src/pages/WorkoutPlanner.jsx',
  'c:/New folder/Gym/Fronted/src/pages/UserProfile.jsx',
  'c:/New folder/Gym/Fronted/src/pages/ProgressTracker.jsx',
  'c:/New folder/Gym/Fronted/src/pages/Plans.jsx',
  'c:/New folder/Gym/Fronted/src/pages/Login.jsx',
  'c:/New folder/Gym/Fronted/src/pages/DietPlanner.jsx',
  'c:/New folder/Gym/Fronted/src/pages/Dashboard.jsx',
  'c:/New folder/Gym/Admin-Panel/src/pages/Dashboard.jsx'
];

const oldUrl = 'https://gym-fitness-uvnr.onrender.com';
const newUrl = 'https://gym-fitness-wg3l.onrender.com';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const updatedContent = content.split(oldUrl).join(newUrl);
    if (content !== updatedContent) {
      fs.writeFileSync(file, updatedContent);
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes for ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
