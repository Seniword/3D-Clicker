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
        instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`

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
    allWeapons = weapons.map((weapon, index) => {
        DPCsum += weapon.dpc * weapon.quantity;
        DPSsum += weapon.dps * weapon.quantity;
        return <Weapons weapon={weapon} key={index} money={money} setMoney={setMoney}/>
        }
    );

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