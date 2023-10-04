// Switcher of the state made by useState - for the reference
function ModeSwitch(props) {
    const mode = props.mode;  const setMode = props.setMode;
    const switchMode = () => {
        if (mode === "Quiz") {
            setMode("Learn");
        } else {
            setMode("Quiz");
        } 
    }
    return (
        <button className="mode-button" onClick={switchMode}> {mode} </button>
    ); 
}

export default ModeSwitch;