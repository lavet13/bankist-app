import { Routes, Route } from 'react-router-dom';

import Authentication from './routes/authentication/authentication.component';
import Navigation from './routes/navigation/navigation.component';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Authentication />} />
      </Route>
    </Routes>
  );
};

export default App;
