import NounArticleQuiz from "./NounArticleQuiz";

export default function QuizManager({ userInfo, quizState }) {

  if (quizState.started) {
    return (
      <div>
        {quizState.quizType === "Article for Noun" ? (
          <NounArticleQuiz userInfo={userInfo}/>
        ) : (
          <div> Flipping Cards Quiz Placeholder </div>
        )}
      </div>
    ); 
  }
}
