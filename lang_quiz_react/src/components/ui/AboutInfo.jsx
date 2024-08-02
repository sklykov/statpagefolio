import styles from './AboutInfo.module.css';
const date = new Date(); const year = date.getFullYear();  // get the actual year

export default function AboutInfo({opened}) {
  return (
    <dialog open={opened} className={styles.aboutWindow}>
      <h3> Information about this project </h3> 
      <p> "Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: "{year}</p>
    </dialog>
  );
}
