import './StartQuiz.css';

// Component specification, automatically make it importable by the root components
export default function StartQuiz(props){
    let quizStarted = props.quizStarted; const setQuizStart = props.setQuizStart;
    const chosenQuizType = props.chosenQuizType; const setQuizType = props.setQuizType;
    const cssClass = `start-quiz-button start-quiz-button-${props.pickedStyle}`; 

    const changeQuizState = () => {
        if (!quizStarted){
            setQuizType(props.children);  // save selected quiz type
        }
        setQuizStart(flagStarted => !flagStarted);  // NOTE: change flag based on previous value in the recommended way
    }
    if (!props.quizStarted) {
        return (<button onClick={changeQuizState} className={cssClass}> Start {props.children}! </button>); 
    } else {
        return (<button onClick={changeQuizState} className="end-quiz-button"> End {chosenQuizType}... </button>); 
    }
}
