import React, {Fragment} from "react";
import {useNavigate} from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate();

    if(localStorage.getItem('jwtToken'))
    {
        navigate("/game")
    }

    return (
        <Fragment>
            <h2>Bienvenue !</h2>

            <p>Veuillez accéder au menu afin de vous connecter, ou enregistrer votre compte pour pouvoir jouer !</p>
        </Fragment>
    )
}