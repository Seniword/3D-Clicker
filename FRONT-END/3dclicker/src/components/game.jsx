import {Fragment, useEffect, useState} from "react";
import instance from "../InstanceHttp"
import {useNavigate} from "react-router-dom";
import {init} from "../ThreeJS/game"
import {Weapons} from "./weapons.jsx";

export const Game = (props) => {

    const {isConnected, money, setMoney, weapons, setWeapons} = props
    const navigate = useNavigate();

    const [requireUpdate, setRequireUpdate] = useState(false)

    useEffect(() => {

        const interval = setInterval(() => {
            let span = document.getElementById("update");
            if(span !== null)
            {
                span.remove();
                setRequireUpdate(true)
            }
        }, 100);
        return () => clearInterval(interval);
    })

    useEffect(() => {
        // on définit le header avec le token jwt
        instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`

        //on récupère les données utilisateur, ici, son argent et ses dégâts (avec les armes) seulement s'il est connecté
        instance
            .get("/getMoney", )
            .then((data) => {
                setMoney(data.data.money);
            })
            .catch(() => {
                instance.defaults.headers.common['Authorization'] = ``
                localStorage.removeItem("jwtToken")
                navigate("/")
            });

        instance
            .get("/getWeapons")
            .then((data) => {
                instance
                    .post("/getWeaponData", data.data)
                    .then((data) => {
                        setWeapons(data.data)
                    })
                    .catch((err) => console.error(err));
            })
            .catch(() => navigate("/"));

        init();

    }, [isConnected])

    let allWeapons;
    let DPSsum = 0;
    let DPCsum = 0;
    //récupération des dégâts des armes pour l'afficher sur le front
    allWeapons = weapons.map((weapon, index) => {
        DPCsum += weapon.dpc * weapon.quantity;
        DPSsum += weapon.dps * weapon.quantity;
        return <Weapons weapon={weapon} key={index} money={money} setMoney={setMoney}/>
        }
    );

    //besoin de ce use effect pour remettre à jour et dans la DB et pour l'affichage front l'argent du joueur
    //car à chaque fois qu'un monstre est éliminé, il gagne de l'argent
    useEffect(() => {
        instance
            .get("/getMoney")
            .then((data) => {
                setMoney(data.data.money);
                setRequireUpdate(false)
            })
            .catch((err) => console.error(err));

    }, [requireUpdate])

    return (
        <Fragment>
            <div className="gameElements">
                <div className="dpsElementsList">
                    {allWeapons}
                </div>
                <div id="ThreeJS"></div>
                <div className="map"></div>
            </div>
            <div className="statsPanel">
                <p className="DPC" id="DPC">DPC : <span className="bold">{DPCsum}</span></p>
                <p className="DPS" id="DPS">DPS : <span className="bold">{DPSsum}</span></p>
                <p className="Money">Money : <span className="bold">{money}</span></p>
            </div>
        </Fragment>
    )
}