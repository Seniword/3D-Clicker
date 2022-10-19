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
import {RegisterForm} from "./components/forms";
import {ClassSelection} from "./components/classSelection";
import {Game} from "./components/game";
import {useEffect, useState} from "react";

function App() {

    const [logState, setLogState] = useState('')
    const [isConnected, setIsConnected] = useState(false)

    const disconnect = () => {
        localStorage.removeItem('jwtToken')
        setIsConnected(false)
    }

    useEffect(() => {

        console.log(isConnected)

        localStorage.jwtToken
        ? setLogState(<li><Link onClick={() => {disconnect()}}>Se déconnecter</Link></li>)

        : setLogState(<li><Link to="/login">Se connecter</Link></li>)
    }, [isConnected])


  return (
      <Router>
          <div className="bg">
              <img src="img/BG.jpg" alt="Campaign road leading to a hill, with mountains and the sunset in the background"/>
          </div>
          <div className="container">
              <h1 className="title">3DClicker</h1>
              <nav>
                  <ul>
                      <li className="menu">Menu
                          <ul className="submenu">
                              <li><Link to="/about">En savoir plus</Link></li>
                              <li><Link to="/contact">Me contacter</Link></li>
                              {logState}
                          </ul>
                      </li>
                  </ul>
              </nav>
          </div>



          <Routes>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login setIsConnected={setIsConnected}/>} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="classSelection" element={<ClassSelection />} />
              <Route path="game" element={<Game />} />
          </Routes>
      </Router>
  )
}

export default App;
