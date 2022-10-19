import {Fragment, useState} from "react";
import instance from '../InstanceHttp.js';
import {useNavigate} from "react-router-dom";

export const ClassSelection = () => {

    const navigate = useNavigate();

    const [value, setValue] = useState('');

    const handleValue = (e) => {
        setValue(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            classChoice : value
        }

        instance
            .post("/classSelection", user)
            .then((data) => {console.log(data.data)})
            .catch((err) => console.error(err));

        navigate('/game')
    }

    return(
        <Fragment>
            <form method="post" onSubmit={(e) => {handleSubmit(e)}}>
                <label>
                    <input type="radio" name="classChoice" value="Warrior" onClick={handleValue}/>
                    Guerrier
                </label>
                <label>
                    <input type="radio" name="classChoice" value="Battle Mage" onClick={handleValue}/>
                    Mage de bataille
                </label>
                <label>
                    <input type="radio" name="classChoice" value="Archer" onClick={handleValue}/>
                    Archer
                </label>
                <label>
                    <input type="radio" name="classChoice" value="Mage" onClick={handleValue}/>
                    Magicien
                </label>
                <input type="submit" value="Choisir ma classe"/>
            </form>
        </Fragment>
    )
}