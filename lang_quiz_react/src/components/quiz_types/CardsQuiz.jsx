import styles from './CardsQuiz.module.css';

export default function CardsQuiz({variants}) {
    return (
      <div className={styles.quizBox}>
        <div> Question placeholder (?) </div>
        <ul className={styles.variantsBox}>
          {variants.map(variant => {
            // Note that always the HTML tags should be always returned to be rendered and displayed
            return (<li key={variant} className={styles.variant}> {variant} </li>);
          })}
        </ul>
      </div>
    ); 
}
