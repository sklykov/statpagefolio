// Imports
import StartQuiz from "./StartQuiz";
import { useState } from "react";
import CardsQuiz from "./quiz_types/CardsQuiz";

let variants = ["Var 1", "Var 2", "Var 3", "Var 4"];

// Component specification
export default function QuizSection(props) {
  const [quizStarted, setQuizStart] = useState(props.quizStarted); // will be set by the buttons below
  const [chosenQuizType, setQuizType] = useState("NONE"); // selected type of quiz

  // TODO: add retrieving the variants if the quiz started or start managing some complex state by useReducer

  // Dynamic returning of components - depending on the state quiz: started or ended
  if (!quizStarted) {
    // Returning couple of buttons to start different quiz types
    return (
      <section>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Flipping Cards
        </StartQuiz>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Variants
        </StartQuiz>
      </section>
    );
  } else {
    // Returning the quiz game field and ending button
    return (
      <section>
        <span>{`Chosen Quiz: ${chosenQuizType}`}</span>
        <div>
          {chosenQuizType === "Variants" ? (
            <CardsQuiz variants={variants} />
          ) : <div> Flipping Cards Quiz Placeholder </div>}
        </div>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Actual Quiz
        </StartQuiz>
      </section>
    );
  }
}
