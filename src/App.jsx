import { Routes, Route } from 'react-router-dom';

import Home from './routes/home/home.component';

const App = () => {
  return (
    <Routes>
      <Route path='/' element>
        <Route index element={<Home />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
