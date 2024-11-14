export default function TimerBar({ progress }) {
  let widthProgress = `${progress}%`;  // converting remaining time to color filling below by using child div width property

  // Progress Bar simulation inspired by: https://stackoverflow.com/questions/7190898/progress-bar-with-html-and-css  
  return (
    <div
      style={{
        backgroundColor: "slategray",
        width: "16rem",
        height: "1.25rem",
        border: "8px grey solid",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          width: widthProgress,
          backgroundColor: "darkgreen",
          height: "100%",
        }}
      ></div>
    </div>
  );
}
