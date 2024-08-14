import NounArticleQuiz from "./NounArticleQuiz";

export default function QuizManager({ userInfo, quizType }) {

  return (
    <div>
      {quizType === "Article for Noun" ? (
        <NounArticleQuiz userInfo={userInfo}/>
      ) : (
        <div> Flipping Cards Quiz Placeholder </div>
      )}
    </div>
  ); 
}
