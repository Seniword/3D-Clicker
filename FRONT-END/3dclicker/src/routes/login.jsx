import React, {Fragment} from "react";
import {ConnectionForm} from '../components/forms'
import {useNavigate} from "react-router-dom";


export const Login = (props) => {

    const {setIsConnected} = props;
    const navigate = useNavigate()

    const showRegisterForm = (e) => {
        e.preventDefault();

        navigate("/register");
    }

    return (
        <Fragment>
            <ConnectionForm setIsConnected={setIsConnected}/>

            <p className="centered">Vous n'avez pas de compte ?</p>
            <a className="centered" href="register" onClick={showRegisterForm}>Créez-en un ici.</a>
        </Fragment>
    )
}