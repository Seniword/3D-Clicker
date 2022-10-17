import React, {useState, useEffect, Fragment} from "react";
import axios from 'axios';
import {RegisterForm, ConnectionForm} from '../components/forms'

const instance = axios.create({
    baseURL : 'http://localhost:8000/'
})

export const Login = () => {

    const [logType, setLogType] = useState('');
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            email : email
        }

        instance
            .post('/logType', user)
            .then((data) => {setLogType(data.data)})
            .catch((err) => {console.error(err)})
    }

    return (
        <Fragment>
            {(logType === '')
                ? <form method="post" onSubmit={(e) => {handleSubmit(e)}}>
                    <label>
                        Mail :
                        <input type="text" value={email} onChange={handleEmailChange} />
                    </label>
                    <input type="submit" value="Connexion / Inscription" />
                </form>
                : logType === 'register'
                    ? <RegisterForm
                        email={email}
                        handleEmailChange={handleEmailChange}
                        setLogType={setLogType}/>
                    : <ConnectionForm
                        email={email}
                        onEmailChange={handleEmailChange}
                        setLogType={setLogType}/>
            }
        </Fragment>
    )
}