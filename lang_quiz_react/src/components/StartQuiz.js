// Imports
import './StartQuiz.css';

// Component specification
function StartQuiz(props){
    const quizType = props.quizType; let quizStarted = props.quizStarted; const setQuizStart = props.setQuizStart;
    const chosenQuizType = props.chosenQuizType; const setQuizType = props.setQuizType; 
    const changeQuizState = () => {
        if (!quizStarted){
            setQuizType(quizType);  // save selected quiz type
        }
        setQuizStart(!quizStarted);  // change flag to switch to the selected quiz
    }
    if (!props.quizStarted) {
        return (<button onClick={changeQuizState} className="start-quiz-button"> Start {quizType}! </button>); 
    } else {
        return (<button onClick={changeQuizState} className="end-quiz-button"> End {chosenQuizType}... </button>); 
    }
}

export default StartQuiz;  // make it importable in the parent (root) components
