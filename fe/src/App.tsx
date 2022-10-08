import { Routes, Route } from 'react-router-dom'
import Routers from 'router';
function App() {
  return (
    <div id="App">
      <Routes>
        {
          Routers.map(o => <Route path={o.path} element={<o.element />} />)
        }
      </Routes>
    </div>
  );
}

export default App;
