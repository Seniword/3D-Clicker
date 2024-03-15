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
import {useState} from "react";
import instance from "./InstanceHttp";

function App() {
    const [isConnected, setIsConnected] = useState(!!localStorage.jwtToken)
    const [money, setMoney] = useState(0)
    const [weapons, setWeapons] = useState([])

    //supprime le jwt de l'utilisateur et définit l'état sur déconnecté
    const disconnect = () => {
        localStorage.removeItem('jwtToken')
        instance.defaults.headers.common['Authorization'] = '';
        setIsConnected(false)
    }

    // sauvegarde les données de l'utilisateur
    const saveUserInfos = () => {

        const user = {
            money : money,
            weapons : weapons,
        }

        instance
            .post('/saveUserInfos', user)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {console.error(err)})
    }

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
                                {isConnected
                                    ? <li><Link onClick={() => {saveUserInfos(); disconnect();}}>Se déconnecter</Link></li>

                                    : <li><Link to="/login">Se connecter</Link></li>}
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
                <Route path="game" element={<Game isConnected={isConnected}
                                                    money={money}
                                                    setMoney={setMoney}
                                                    weapons={weapons}
                                                    setWeapons={setWeapons}
                                                />} />
            </Routes>
        </Router>
    )
}

export default App;