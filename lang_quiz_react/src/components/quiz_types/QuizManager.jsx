import CardsQuiz from "./CardsQuiz";

function fetchUserData(userCredentials) {
  // console.log("Logged in:", userCredentials);
  let data = null; 

  if (userCredentials.user === "demo") {
    data = {variants: ["Var 1", "Var 2", "Var 3", "Var 4"]};
  }
  return data;
}

export default function QuizManager({ userInfo, quizType }) {
  let userData = fetchUserData(userInfo);

  if (userData !== null) {
    return (
        <div>
          {quizType === "Variants" ? (
            <CardsQuiz variants={userData.variants} />
          ) : (
            <div> Flipping Cards Quiz Placeholder </div>
          )}
        </div>
      ); 
  } else {
    return <div> User Not Found, cannot set up Quiz... </div>
  }
}
