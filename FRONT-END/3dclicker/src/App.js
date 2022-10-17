import {
    BrowserRouter as Router,
    Link,
    Routes,
    Route,
} from "react-router-dom";
import './App.css';
import {Home} from './routes/home'
import {About} from './routes/about'
import {Contact} from './routes/contact'
import {Login} from './routes/login'

function App() {
  return (
      <Router>
          <h1>3DClicker</h1>
          <p className="subtitle">A simple idle game, made interesting thanks to the 3D !</p>
          <nav>
              <ul>
                  <li><a href="/about">En savoir plus</a></li>
                  <li><a href="/contact">Me contacter</a></li>
                  <li><a href="/login">Se connecter</a></li>
              </ul>
          </nav>

          <Routes>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
          </Routes>
      </Router>
  )
}

export default App;
