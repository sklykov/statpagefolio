import './styles/App.css';
import './styles/AppDark.css';  // set explicitly the dark mode for the page
import Bar from './components/Bar.js'; 

function App() {
  // Page elements specification
  return (
    <div className="App">
      <Bar />
      <header className="App-header"> 
        <h3> Quiz for training new words / learn them better </h3>
        <p> The goal is to compose the web app that helps to learn new words </p>
      </header>
    </div>
  );
}

export default App;
