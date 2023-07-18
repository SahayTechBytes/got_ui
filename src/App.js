
import './App.css';
import HouseDropdown from './components/HouseDropdown/HouseDropdown';
import { Container } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <Container>
          <h1>Welcome to Game of Thrones Page</h1>
          <p>Click on the dropdown to see the houses pesent in GOT</p>
          <HouseDropdown />
      </Container>
     
      
    </div>
  );
}

export default App;
