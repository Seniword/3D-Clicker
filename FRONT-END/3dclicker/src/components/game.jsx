import {Fragment} from "react";
import instance from "../InstanceHttp"
import * as THREE from "three";
import {useNavigate} from "react-router-dom";

export const Game = () => {

    const navigate = useNavigate();

    instance
        .get("/isAuth")
        .then((data) => {
            if(data.data !== "access authorized")
            {
                localStorage.removeItem('jwtToken');
                navigate('/')
            }
        })
        .catch((err) => console.error(err));

    return (
        <Fragment>
            <p>Cc c le je</p>
        </Fragment>
    )
}