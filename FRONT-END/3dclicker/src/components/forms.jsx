import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
    baseURL: 'http://localhost/8000/'
})

export const RegisterForm = (props) => {

    const navigate = useNavigate();

    const {email, handleEmailChange, setLogType} = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState([]);

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

            console.log(user)

            instance
                .post('/signup', user)
                .then((data) => {
                    switch(data.data){
                        case "Mail found":
                            setErrors(prevState => [...prevState, "Votre email est déjà liée à un compte. Veuillez vous connecter."])
                            navigate("/");

                        case "User saved." :
                            //TODO : Gerer le jwt
                            navigate("/")
                    }
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

export const ConnectionForm = () => {

    return(
        <p>Connection</p>
        )
}