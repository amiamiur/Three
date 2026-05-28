//=============================\\
// Главный файл - точка запуска\\
//==============================\\
import * as THREE from 'three';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import {TestObject} from './helpers/test.js';
import {Generator} from './helpers/Generator.js';
import {ShipGenerator} from './helpers/ShipGenerator.js';
import {ModelLoader} from './core/ModelLoader.js';
import { PaneConstructor } from './helpers/PaneConstructor.js';
import { AsteroidManager } from './core/AsteroidManager.js';

class Game{

    constructor(){
        this.SceneManager = null;
        this.CameraManager = null;
        this.LightManager = null;
        this.AsteroidManager = null;
        this.ModelLoader = null;
        this.renderer = null;
        
        this.test = null;
        this.Generator = null;
        this.shipGenerator = null;

        this.model = null;
        this.pane = null;
        
        this.init();
    }

    init(){
        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(this.renderer.domElement);
        
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createOrbitControls();
        //this.cameraManager.createFlyControls();

        this.LightManager = new LightManager(scene);
        this.LightManager.createAll();

        // const geometry = new THREE.SphereGeometry(5,5,5);
        // const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        // this.cube = new THREE.Mesh(geometry,material);
        
        this.test = new TestObject(scene);
        //this.test.createAll();
        this.model = this.test.group;
        //this.model.name = 'Figure';

        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.load(0, 'ships')

        setTimeout(() => {
            this.ship = this.modelLoader.getModel();
            this.asteroidManager = new AsteroidManager(scene, this.ship);
            this.asteroidManager.spawnAsteroids();
        },1000);

        this.generator = new Generator(scene);
        this.generator.generateAll();

        


        // this.ModelLoader = new ModelLoader(scene);
        // this.ModelLoader.load();
        
        //this.pane = new PaneConstructor();
        //this.pane.createAll(this.model);

        this.clock = new THREE.Clock();

        window.addEventListener('resize', () => this.onWindowResize());

        window.addEventListener( 'keydown', (event) => {
            if(event.key === 'a'){
                this.ship.position.z += 0.01;
                this.ship.rotation.z += 0.001;
            }
            if(event.key === 'd'){
                this.ship.position.z -= 0.01;
                this.ship.rotation.z -= 0.001;
            }
            if(event.key === 'w'){
                this.ship.position.y += 0.01;
            }
            if(event.key === 's'){
                this.ship.position.y -= 0.01;
                this.ship.rotation.y -= 0.001;
            }
        })

        this.animate()
    }

    onWindowResize(){
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    animate = () =>{
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();

        this.cameraManager.update(delta);
        this.sceneManager.update(this.generator.stars);

        const camera = this.cameraManager.camera;

        if(this.ship){
            this.ship.position.x += 0.01;

            this.asteroidManager.updateAsteroids();
            //this.ship.position.copy(camera.position);
        }

        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera());
    }
}

const game = new Game();
