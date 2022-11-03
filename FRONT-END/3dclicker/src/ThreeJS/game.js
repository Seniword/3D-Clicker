import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import instance from "../InstanceHttp";

var renderer, scene, camera
var pl;
var raycaster;
const loader = new GLTFLoader();

var mixer, clock, line, model;
let weapons = [];

let DPSsum = 0;
let DPCsum = 0;

let monsterStats = {}

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

// ====== Global Configs ==========

if(window.innerWidth <= 768)
{
    var WIDTH = 450
    var HEIGHT = 500
}
else
{
    var WIDTH = 1000
    var HEIGHT = 600
}


console.log(window.innerWidth, window.innerHeight)

export function init() {

    // instanciation de la caméra utilisée sur la scène
    camera = new THREE.PerspectiveCamera(
        60,
        (window.innerWidth * 100 / 80) / (window.innerHeight * 100 / 80),
        0.1,
        2500);
    camera.position.z = 0;
    camera.position.y = 3;
    camera.position.x = 0;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // instanciation de la scene threejs
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0);

    // instanciation de la lumière
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    let pointLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
    pointLight.target.position.set(0, 0, 0);
    pointLight.position.set(-100, 5, 10);
    pointLight.castShadow = true;
    pointLight.target.position.set(0, 10, 0);
    scene.add(pointLight);
    scene.add(pointLight.target);

    pl = new THREE.PointLight(0xffffff, 0.2);
    pl.position.set( -50, 50, 10);
    pl.castShadow = true;
    scene.add(pl);

    // création de la géométrie utilisée pour trouver ou l'utilisateur clique, non affichée sur la scène
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );

    // création de la barre de vie du monstre
    let healthBar = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        polygonOffset: true,
        polygonOffsetFactor: -2.0,
        polygonOffsetUnits: -4.0,
        side: THREE.DoubleSide
    }))
    healthBar.position.set(0, 1, 0);
    scene.add(healthBar)

    //création de la barre de vie perdue du monstre
    let damageBar = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -2.0,
        side: THREE.DoubleSide
    }))
    damageBar.position.set(0, 1, 0);
    scene.add(damageBar)

    // chargement des textures du sol
    let textureLoader = new THREE.TextureLoader();
    let colorMap = textureLoader.load("../../textures/floor/forest_floor_albedo.png")
    let normalMap = textureLoader.load("../../textures/floor/forest_floor_Normal-dx.png")
    let aoMap = textureLoader.load("../../textures/floor/forest_floor-ao.png")

    // ces lignes permettent de répéter la texture sur la géométrie choisie, afin de ne pas avoir une texture étirée
    // qui aurait un rendu moche, comme si une image en 200x200px était étirée pour en faire 1000x1000.
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(50, 50);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(50, 50);
    aoMap.wrapS = THREE.RepeatWrapping;
    aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(50, 50);


    // création du sol, plus assignation des textures sur la géométrie
    let floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({
        map : colorMap,
        normalMap : normalMap,
        aoMap : aoMap,
        side: THREE.DoubleSide
    }));

    // le sol est tourné afin d'être perpendiculaire au personnage, donc être un sol sur lequel il peut poser ses pieds
    floor.rotation.x = Math.PI/2
    floor.position.set(0, -1, 0)
    scene.add(floor)

    // instaciation d'une horloge afin de pouvoir calculé le temps passé depuis x action
    clock = new THREE.Clock();

    // le raycaster est ce qui va nous aider à savoir ou l'utilisateur clique
    raycaster = new THREE.Raycaster();

    let mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    //une fonction qui va adapter la taille de la scène ThreeJS à la taille de l'écran si jamais cette dernière est
    //changée, par exemple une fenête qui ne prendrait pas tout l'écran changée pour prendre tout l'écran appellerait
    //cette fonction, et changerait la taille de la scène pour s'adapter
    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    //cette fonction permet de détecter le click utilisateur. Ici, si le code détecte une collision entre l'endroit
    //cliqué, et la cible donnée plus bas, alors il lance la fonction attackMonster
    window.addEventListener( 'pointerup', function ( event ) {

        if ( moved === false ) {

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects )
            {
                attackMonster();
            }
        }
    } );

    //cette fonction détecte simplement si le curseur est en mouvement
    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {
            checkIntersection( event.clientX, event.clientY );
        }

    }

    // cette fonction va détecter si il y a contact entre le point cliqué et la cible définie, ici la cible étant model
    function checkIntersection( x, y ) {

        if ( model === undefined ) return;

        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        raycaster.intersectObject( model, true, intersects );

        if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const n = intersects[ 0 ].face.normal.clone();
            n.transformDirection( model.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {

            intersection.intersects = false;

        }
    }

    let health;
    let damageDone;

    //fonction qui va permettre de faire des dégâts au monstre
    function attackMonster()
    {
        if (isNaN(health)) health = monsterStats.health

        damageDone = (DPCsum / monsterStats.health) * 100; // damage done in %hp

        health -= damageDone;

        setHp(healthBar, health/100)

        if(health <= 0) summonNewMonster();
    }

    //fonction appelée pour update les dégâts du joueur au moment ou il se connecte
    getPlayerDamage()

    //fonction permettant d'invoquer un nouveau monstre une fois que l'ancien est mort, et donne des pièces à l'utilisateur
    function summonNewMonster()
    {
        let updateFront = document.createElement("span");
        updateFront.id = "update";
        document.body.appendChild(updateFront)
        let moneyGain = 1 * monsterStats.gold_factor;
        instance
            .get("/getMoney")
            .then((data) => {
                instance
                    .post("/setMoney", {money : data.data.money + moneyGain})
                    .then()
                    .catch((err) => console.error(err))
                })
            .catch((err) => console.error(err))

        scene.remove(model);
        loadMonster();
    }

    function setHp(mesh, width)
    {
        let scaleFactorX = width / mesh.geometry.parameters.width;
        mesh.scale.set( scaleFactorX, 1, 1);
    }

    loadMonster();
    //fonction qui va charger le monstre voulu, ici, Soldier
    function loadMonster()
    {
        loader.load( 'models/Soldier.glb', function ( gltf ) {

            model = gltf.scene;
            scene.add(model);

            model.name = "Soldier";

            model.position.set(0, -1, 0)

            model.traverse(function (object) {

                if (object.isMesh) object.castShadow = true;

            });

            mixer = new THREE.AnimationMixer(gltf.scene)

            let idleAnimation = gltf.animations[0]

            mixer.clipAction(idleAnimation).play();

            instance
                .post('/getMonsterStats', {name : model.name})
                .then((data) => monsterStats = data.data)
                .catch((err) => console.error(err))

            animate();
        });

        health = monsterStats.health;
        setHp(healthBar, 1);
    }

    //fonction la plus importante du code, c'est elle qui va permettre au moteur 3D de se render 60fois par secondes
    //ce qui va nous donner une image fluide
    function animate() {

        // Render loop

        requestAnimationFrame( animate );

        controls.update();

        let delta = clock.getDelta();

        mixer.update(delta);

        renderer.render( scene, camera )
    }

    //le renderer est l'élément qui va permettre d'afficher toute la scène threejs dans notre navigateur
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.outputEncoding = THREE.sRGBEncoding;

    //ceci sert à bouger la caméra afin de pouvoir se balader sur la scène
    var controls = new OrbitControls(camera, renderer.domElement);
    //ces 2 lignes permettent de bloquer la rotation sur l'axe y; l'utilisateur ne peut que tourner de droite à gauche
    //ou inversement, mais pas de haut en bas ou bas en haut
    controls.minPolarAngle = Math.PI/2 - 0.60;
    controls.maxPolarAngle = Math.PI/2 - 0.60;
    controls.update();

    let moved = false;

    // controls.addEventListener( 'change', function ()
    // {
    //     moved = true;
    // });

    window.addEventListener( 'pointerdown', function ()
    {
        moved = false;
    });

    let hasChild = false;
    // le container est l'élément html dans lequel on va mettre notre scène
    var container = document.getElementById( 'ThreeJS' );
    if(hasChild === false && container !== null)
    {
        container.appendChild( renderer.domElement );
        if(container.children[1])
            container.removeChild(container.children[0])
    }
}

export function getPlayerDamage()
{
    DPSsum = 0;
    DPCsum = 0;
    instance
        .get("/getWeapons")
        .then((data) => {
            instance
                .post("/getWeaponData", data.data)
                .then((data) => {
                    weapons = data.data;
                    weapons.forEach(weapon => {
                        DPSsum += weapon.dps * weapon.quantity;
                        DPCsum += weapon.dpc * weapon.quantity;
                    })
                })
                .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err))
}