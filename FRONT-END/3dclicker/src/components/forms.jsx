import React, {useState, Fragment} from "react";
import { useNavigate } from "react-router-dom";
import instance from '../InstanceHttp.js';

export const RegisterForm = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState([]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password !== passwordConfirm)
        {
            setErrors(prevState => [...prevState, 'Les mots de passe saisis ne correspondent pas.']);
            return;
        }
        else
        {
            setErrors([])
            const user = {
                email : email,
                username : username,
                password : password
            }

            instance
                .post('/signup', user)
                .then((data) => {
                    localStorage.setItem('jwtToken', data.data);
                    instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`;

                    navigate('/classSelection');
                })
                .catch((err) => console.error(err));
        }
    }

    return(
        <Fragment>
            {errors.map((message) => <p>{message}</p>)}
            <form method='post' onSubmit={(e) => {handleSubmit(e)}}>
                <label>
                    Mail :
                    <input type="text" value={email} onChange={handleEmailChange}/>
                </label>
                <br/>
                <label>
                    Username :
                    <input type="text" value={username} onChange={handleUsernameChange}/>
                </label>
                <br/>
                <label>
                    Password :
                    <input type="password" value={password} onChange={handlePasswordChange} required/>
                </label>
                <br/>
                <label>
                    Password Confirmation :
                    <input type="password" value={passwordConfirm} onChange={handlePasswordConfirmChange} required/>
                </label>
                <br />
                <input type="submit" value="Inscription" />
            </form>
        </Fragment>
    )
}

export const ConnectionForm = (props) => {

    const {setIsConnected} = props;
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            username : username,
            password : password
        }

        instance
            .post('/signin', user)
            .then((data) => {
                localStorage.setItem('jwtToken', data.data);
                instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`;
                setIsConnected(true);

                navigate('/game');
            })
            .catch((err) => console.error(err));
    }

    return(
        <form method="post" onSubmit={(e) => {handleSubmit(e)}}>
            <label>
                Nom d'utilisateur :
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <label>
                Mot de passe :
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <input type="submit" value="Me connecter" />
        </form>
        )
}