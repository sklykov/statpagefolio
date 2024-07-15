import { useContext } from 'react';
import { ThemeContext } from '../store/ThemeContextProvider'; 
import '../styles/StartQuiz.css';

// Component specification, automatically make it importable by the root components
export default function StartQuiz(props) {
    const {theme} = useContext(ThemeContext); 
    let quizStarted = props.quizStarted; const setQuizStart = props.setQuizStart;
    const chosenQuizType = props.chosenQuizType; const setQuizType = props.setQuizType;
    const cssClassStartBtn = `start-quiz-button start-quiz-button-${theme}`; 
    const cssClassStopBtn = `stop-quiz-button stop-quiz-button-${theme}`; 

    const changeQuizState = () => {
        if (!quizStarted){
            setQuizType(props.children);  // save selected quiz type
        }
        setQuizStart(flagStarted => !flagStarted);  // NOTE: change flag based on previous value in the recommended way
    }
    if (!props.quizStarted) {
        return (<button onClick={changeQuizState} className={cssClassStartBtn}> Start {props.children}! </button>); 
    } else {
        return (<button onClick={changeQuizState} className={cssClassStopBtn}> End {chosenQuizType}... </button>); 
    }
}
