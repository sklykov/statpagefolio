// Overall imports
import './styles/App.css';

// Components and React stuff importing
import NavBar from './components/ui/NavBar'; 
import QuizSection from './components/QuizSection';
import { ThemeContext } from './store/ThemeContextProvider';
import { useContext, useState, useRef } from "react";  // access some changes in the state
import AboutInfo from './components/ui/AboutInfo';

// Main component of the webpage - App
export default function App() {
  // Context value below can be used if only the ThemeContext.Provider is wrapping this component, see index.js
  const {theme} = useContext(ThemeContext);

  // handling switching of the dark / light styling
  let cssClasses = `App ${theme}`;  // CSS classes for switching the styles 

  // Show info as the dialog window
  const [openedInfo, openInfo] = useState(false);  // manage state of opened / closed Info window
  // 1 Ref - for accessing the <dialog> properties, 2 - for not attempting closing not opened before window
  const dialogRef = useRef();

  // Page elements specification using the JSX syntax
  return (
      <main className={cssClasses} id="main-body">
        <header className="App-header"> 
          <NavBar openInfoWindow={openInfo} dialogWin={dialogRef} />
          {/* TODO: switch dynamically info below  */}
          <h3> Quiz for training new words / learn them better </h3>
          <p> The goal is to compose the web app that helps to learn new words </p>
        </header>
        <AboutInfo opened={openedInfo} openInfoWinFunction={openInfo} ref={dialogRef} />
        <QuizSection quizStarted={false} />
      </main>
  );
}
