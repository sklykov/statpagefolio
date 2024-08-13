// Overall imports
import './styles/App.css';

// Components and React stuff importing
import NavBar from './components/ui/NavBar'; 
import QuizSection from './components/QuizSection';
import { ThemeContext } from './store/ThemeContextProvider';
import { useContext, useState, useRef, useEffect } from "react";  // access some changes in the state
import AboutInfo from './components/ui/AboutInfo';

// Main component of the webpage - App
export default function App() {
  // Context value below can be used if only the ThemeContext.Provider is wrapping this component, see index.js
  const {theme} = useContext(ThemeContext);

  // handling switching of the dark / light styling
  let cssClasses = `App ${theme}`;  // CSS classes for switching the styles 

  // Show info about the project as the dialog window opened as modal
  const [openedInfo, openInfo] = useState(false);  // manage state of opened / closed Info window
  const dialogRef = useRef();  // Ref - for accessing the <dialog> built-in properties

  // Login handling (placeholder)
  const [userCredentials, setLoginInfo] = useState({user: "demo", password: "test"});

  // Quiz state: started / finished (not yet started)
  const [quizState, setQuizState] = useState({started: false, quizType: null}); 

  // Provide logic for showModal() and close() methods for <dialog> below connected to the state openedInfo
  // This function will be fired then the associated state had been changed in the child component (NavBar)
  useEffect(() => {
    if (openedInfo) {
      if (dialogRef.current) {
        dialogRef.current.showModal();  // for deeming the background and make it inactive
      }
    } else {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }, [openedInfo, dialogRef]);  // dependencies for revoking this function again, if the <dialog> rendered and if its state changed

  return (
    <main className={cssClasses} id="main-body">
      <header className="App-header">

        <NavBar
          openInfoWindow={openInfo}
          dialogWin={dialogRef}
          userInfo={userCredentials}
          setLoginInfo={setLoginInfo}
        />

        {!quizState.started ? (
          <h3>
            Quiz for training new words / learn them better through various quiz types
          </h3>
        ) : (
          <h3> Active quiz: {quizState.quizType} </h3>
        )}
        {!quizState.started && (
          <p>
            The goal is to compose the web app based on React that helps to
            learn new words
          </p>
        )}
      </header>
      
      <AboutInfo
        opened={openedInfo}
        openInfoWinFunction={openInfo}
        ref={dialogRef}
      />

      <QuizSection
        quizState={quizState}
        setQuizState={setQuizState}
        userInfo={userCredentials}
      />
      
    </main>
  );
}
