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

class Game{

    constructor(){
        this.SceneManager = null;
        this.CameraManager = null;
        this.LightManager = null;
        this.ModelLoader = null;
        this.renderer = null;
        this.test = null;
        
        this.init();
    }

    init(){
        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();

        this.LightManager = new LightManager(scene);
        this.LightManager.createAll();

        // const geometry = new THREE.SphereGeometry(5,5,5);
        // const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        // this.cube = new THREE.Mesh(geometry,material);
        
        this.test = new TestObject(scene);
        this.test.createAll();

        this.generator = new Generator(scene);
        this.generator.generateAll();

        // this.ModelLoader = new ModelLoader(scene);
        // this.ModelLoader.load();

        this.ShipGenerator = new ShipGenerator(scene);
        this.ShipGenerator.createShip();
        
        window.addEventListener('resize', () => this.onWindowResize());

        this.animate()
    }

    onWindowResize(){
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    animate = () =>{
        requestAnimationFrame(this.animate);


        // this.test.cube.rotation.y += 0.01;
        // this.test.cube.rotation.x += 0.01;
        this.cameraManager.update();
        this.sceneManager.update(this.generator.stars);

        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera());
    }
}

const game = new Game();
