import './styles/App.css';
import './styles/AppDark.css';
import './styles/AppLight.css';

// Components and React stuff importing
import NavBar from './components/NavBar'; 
import { useState } from "react";  // access some changes in the state

// Main component - App
function App() {
  // handling switching of the dark / light styling
  const [pickedStyle, setStyle] = useState('Default');  // state passed to the components
  let classDefApp = `App ${pickedStyle}`;  // CSS classes for switching the styles 

  // Page elements specification as JSX
  return (
    <div className={classDefApp}>
      <NavBar pickedStyle={pickedStyle} setStyle={setStyle} />
      <header className="App-header"> 
        <h3> Quiz for training new words / learn them better </h3>
        <p> The goal is to compose the web app that helps to learn new words </p>
      </header>
    </div>
  );
}

export default App;
