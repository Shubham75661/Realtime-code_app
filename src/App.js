
import './App.css';
// Router
import {BrowserRouter, Routes, Route} from 'react-router-dom'
// Creating a toaster
import { Toaster } from 'react-hot-toast'; 
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <div className="App">
      <div>
        <Toaster
          position='top-right'
          toastOptions={{
            success:{
              theme:{
                primary:"#4aee88",
              }
            }
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/editor/:roomid' element={<EditorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
