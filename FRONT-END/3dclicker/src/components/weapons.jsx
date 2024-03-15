import {getPlayerDamage} from "../ThreeJS/game";
import instance from "../InstanceHttp";

export const Weapons = (props) => {

    const {weapon, money, setMoney} = props;

    console.log(weapon);

    // function permettant d'incrémenter le nombre d'objet à acheter en un clic
    const increaseBuyNumber = (e) => {
        let div = e.target.parentNode;
        let button = div.children[0];
        switch(button.textContent)
        {
            case "Buy 1" :
                button.textContent = "Buy 10";
                break;

            case "Buy 10" :
                button.textContent = "Buy 100";
                break;

            case "Buy 100" :
                button.textContent = "Buy MAX";
                break;

            case "Buy MAX" :
                break;
        }
    }

    // function permettant de réduire le nombre d'objet à acheter en un clic
    const reduceBuyNumber = (e) => {
        let div = e.target.parentNode;
        let button = div.children[0];
        switch(button.textContent)
        {
            case "Buy 1" :
                break;

            case "Buy 10" :
                button.textContent = "Buy 1";
                break;

            case "Buy 100" :
                button.textContent = "Buy 10";
                break;

            case "Buy MAX" :
                button.textContent = "Buy 100";
                break;
        }
    }

    // fonction pour acheter l'arme sur lequel on clique
    const buyWeapon = (e) => {
        switch(e.target.textContent){
            case "Buy 1" :
                if(money >= weapon.price){
                    weapon.quantity += 1;
                    setMoney(money - weapon.price);

                    instance
                        .post("/setMoney", {money : money - weapon.price})
                        .then()
                        .catch((err) => console.error(err));

                    instance
                        .post("/setWeapons", {quantity: weapon.quantity, name: weapon.name})
                        .then(() => getPlayerDamage())
                        .catch((err) => console.error(err));

                }
                break;

            case "Buy 10" :
                if(money >= weapon.price * 10){
                    weapon.quantity += 10;
                    setMoney(money - weapon.price * 10);
                    instance
                        .post("/setMoney", {money : money - weapon.price * 10})
                        .then()
                        .catch((err) => console.error(err));

                    instance
                        .post("/setWeapons", {quantity: weapon.quantity, name: weapon.name})
                        .then(() => getPlayerDamage())
                        .catch((err) => console.error(err))
                }
                break;

            case "Buy 100" :
                if(money >= weapon.price * 100){
                    weapon.quantity += 100;
                    setMoney(money - weapon.price * 100);

                    instance
                        .post("/setMoney", {money : money - weapon.price * 100})
                        .then(() => getPlayerDamage())
                        .catch((err) => console.error(err));

                    instance
                        .post("/setWeapons", {quantity: weapon.quantity, name: weapon.name})
                        .then(() => getPlayerDamage())
                        .catch((err) => console.error(err))
                }
                break;

            case "Buy MAX" :
                let total = money / weapon.price;
                weapon.quantity += total;
                setMoney(money - weapon.price * total);

                instance
                    .post("/setMoney", {money : money - weapon.price * total})
                    .then()
                    .catch((err) => console.error(err));

                instance
                    .post("/setWeapons", {quantity: weapon.quantity, name: weapon.name})
                    .then(() => getPlayerDamage())
                    .catch((err) => console.error(err))
                break;
        }
    }


    return(
            <div className="weaponsDiv">
                {weapon.name}
                <div className="weaponsMenu">
                    <p>Qty : {weapon.quantity}</p>
                    {weapon.dpc !== 0 ?
                        <p className="DPCWeapon">
                            {"DPC : " + weapon.dpc}
                        </p>
                        : ''}

                    {weapon.dps !== 0 ?
                        <p className="DPSWeapon">
                            {"DPS : " + weapon.dps}
                        </p>
                        : ''}

                    <p>Price : {weapon.price}</p>
                    <div className="buttons">
                        <div className="buyButton" onClick={buyWeapon}>Buy 1</div>
                        <button className="plus" onClick={increaseBuyNumber}>+</button>
                        <button className="minus" onClick={reduceBuyNumber}>-</button>
                    </div>
                </div>
            </div>
        )
}