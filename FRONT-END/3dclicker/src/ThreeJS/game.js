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

var WIDTH = 1000
var HEIGHT = 600

export function init() {

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
    camera.position.z = 0;
    camera.position.y = 3;
    camera.position.x = 0;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0);

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

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    // scene.add( line );

    let healthBar = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        polygonOffset: true,
        polygonOffsetFactor: -2.0,
        polygonOffsetUnits: -4.0,
        side: THREE.DoubleSide
    }))
    healthBar.position.set(0, 1, 0);
    scene.add(healthBar)

    let damageBar = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -2.0,
        side: THREE.DoubleSide
    }))
    damageBar.position.set(0, 1, 0);
    scene.add(damageBar)

    let textureLoader = new THREE.TextureLoader();
    let colorMap = textureLoader.load("../../textures/floor/forest_floor_albedo.png")
    let normalMap = textureLoader.load("../../textures/floor/forest_floor_Normal-dx.png")
    let aoMap = textureLoader.load("../../textures/floor/forest_floor_ao.png")

    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(50, 50);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(50, 50);
    aoMap.wrapS = THREE.RepeatWrapping;
    aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(50, 50);


    let floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({
        map : colorMap,
        normalMap : normalMap,
        aoMap : aoMap,
        // color : 0xffffff,
        side: THREE.DoubleSide
    }));

    floor.rotation.x = Math.PI/2
    floor.position.set(0, -1, 0)
    scene.add(floor)

    clock = new THREE.Clock();

    raycaster = new THREE.Raycaster();

    let mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'pointerup', function ( event ) {

        if ( moved === false ) {

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects )
            {
                attackMonster();
            }
        }
    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {
            checkIntersection( event.clientX, event.clientY );
        }

    }

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

    function attackMonster()
    {
        if (isNaN(health)) health = monsterStats.health

        damageDone = (DPCsum / monsterStats.health) * 100; // damage done in %hp

        health -= damageDone;

        setHp(healthBar, health/100)

        if(health <= 0) summonNewMonster();
    }

    getPlayerDamage()

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

    function animate() {

        // Render loop

        requestAnimationFrame( animate );

        controls.update();

        let delta = clock.getDelta();

        mixer.update(delta);

        renderer.render( scene, camera )
    }

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.outputEncoding = THREE.sRGBEncoding;

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI/2 - 0.60;
    controls.maxPolarAngle = Math.PI/2 - 0.60;
    controls.update();

    let moved = false;

    controls.addEventListener( 'change', function ()
    {
        moved = true;
    });

    window.addEventListener( 'pointerdown', function ()
    {
        moved = false;
    });

    let hasChild = false;
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