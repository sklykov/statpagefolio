import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../store/ThemeContextProvider'; 
import '../styles/StartQuiz.css';
import { authenticate } from './quiz_data/Auth_mock.js';

// Component specification, automatically make it importable by the root components
export default function StartQuiz({quizState, setQuizState, children, setLoginInfo, userInfo}) {
    const {theme} = useContext(ThemeContext); 

    // CSS styles switching depending on the selected theme type
    const cssClassStartBtn = `start-quiz-button start-quiz-button-${theme}`; 
    const cssClassStopBtn = `stop-quiz-button stop-quiz-button-${theme}`; 

     // State for updating the userInfo state by chaining the useEffect hook
     const [authenticatedFlag, setAuthenticatedFlag] = useState(false);

    // Update complex quiz state - with flag for started quiz and its type
    const changeQuizState = () => {
        setQuizState(prevState => {
            if (!prevState.started) {
                setLoginInfo((prevState => {
                    let newState = {...prevState}; newState.authenticated = "in progress...";
                    return newState;
                }));
                return {started: true, quizType: children};
            } else {
                setLoginInfo((prevState => {
                    let newState = {...prevState}; newState.authenticated = false;
                    return newState;
                }));
                setAuthenticatedFlag(false);  // getting back to the default value of the state
                return {started: false, quizType: null};
            }
        });
    }
    
    // Chained side effect for updating the userInfo state with the authenticatedFlag
    useEffect(() => {
        if (authenticatedFlag === true) {
            setLoginInfo((prevState => {
                let newState = {...prevState}; newState.authenticated = authenticatedFlag;
                return newState;
            }));
        }
    }, [authenticatedFlag, setLoginInfo]); 

    // Add asynchronous call for for changing state and mocking some authentication happening on the server
    useEffect(() => {
        async function makeAuth(userInfo) {
            let authenticated = false; 
            try {
                authenticated = await authenticate(userInfo);
            } catch (error) {
                authenticated = String(error);
            }
            setAuthenticatedFlag(authenticated);
        }
        if (quizState.started && userInfo.authenticated === "in progress...") {
            makeAuth(userInfo);
        }
    }, [quizState, userInfo]);
    
    // Render button content depending on the state
    if (!quizState.started) {
        return (
          <button
            title={"Start the quiz"}
            onClick={changeQuizState}
            className={cssClassStartBtn}
          >
            Start {children}!
          </button>
        ); 
    } else {
        return (
          <button
            onClick={changeQuizState}
            className={cssClassStopBtn}
            title={"Stop the quiz"}
          >
            End {quizState.quizType}...
          </button>
        ); 
    }
}
