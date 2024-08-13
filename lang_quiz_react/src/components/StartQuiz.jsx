import { useContext } from 'react';
import { ThemeContext } from '../store/ThemeContextProvider'; 
import '../styles/StartQuiz.css';

// Component specification, automatically make it importable by the root components
export default function StartQuiz({quizState, setQuizState, children}) {
    const {theme} = useContext(ThemeContext); 

    // CSS styles switching depending on the selected theme type
    const cssClassStartBtn = `start-quiz-button start-quiz-button-${theme}`; 
    const cssClassStopBtn = `stop-quiz-button stop-quiz-button-${theme}`; 

    // Update complex quiz state - with flag for started quiz and its type
    const changeQuizState = () => {
        setQuizState(prevState => {
            if (!prevState.started) {
                return {started: true, quizType: children};
            } else {
                return {started: false, quizType: null};
            }
        });
    }
    
    // Render button content depending on the state
    if (!quizState.started) {
        return (<button onClick={changeQuizState} className={cssClassStartBtn}> Start {children}! </button>); 
    } else {
        return (<button onClick={changeQuizState} className={cssClassStopBtn}> End {quizState.quizType}... </button>); 
    }
}
