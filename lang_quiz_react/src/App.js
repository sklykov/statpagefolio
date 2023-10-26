import './styles/App.css';

// Components and React stuff importing
import NavBar from './components/NavBar'; 
import QuizSection from './components/QuizSection';
import { useState } from "react";  // access some changes in the state

// Main component of the webpage - App
export default function App() {
  // handling switching of the dark / light styling
  const [pickedStyle, setStyle] = useState('Dark');  // state passed to the components
  let cssClasses = `App ${pickedStyle}`;  // CSS classes for switching the styles 

  // Page elements specification in the JSX syntax
  return (
    <main className={cssClasses}>

      <header className="App-header"> 
        <NavBar pickedStyle={pickedStyle} setStyle={setStyle} />
        <h3> Quiz for training new words / learn them better </h3>
        <p> The goal is to compose the web app that helps to learn new words </p>
      </header>

      <QuizSection quizStarted={false} pickedStyle={pickedStyle}/>

    </main>
  );
}
