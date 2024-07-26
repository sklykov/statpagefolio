import { useContext } from 'react';
import { ThemeContext } from '../store/ThemeContextProvider'; 
import '../styles/StartQuiz.css';

// Component specification, automatically make it importable by the root components
export default function StartQuiz({quizStarted, setQuizStart, chosenQuizType, setQuizType, children}) {
    const {theme} = useContext(ThemeContext); 

    // CSS styles switching depending on the selected theme type
    const cssClassStartBtn = `start-quiz-button start-quiz-button-${theme}`; 
    const cssClassStopBtn = `stop-quiz-button stop-quiz-button-${theme}`; 

    const changeQuizState = () => {
        if (!quizStarted) {
            setQuizType(children);  // save selected quiz type
        }
        setQuizStart(flagStarted => !flagStarted);  // NOTE: change flag based on previous value in the recommended way
    }
    
    if (!quizStarted) {
        return (<button onClick={changeQuizState} className={cssClassStartBtn}> Start {children}! </button>); 
    } else {
        return (<button onClick={changeQuizState} className={cssClassStopBtn}> End {chosenQuizType}... </button>); 
    }
}
