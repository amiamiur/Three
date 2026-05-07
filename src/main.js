//=============================\\
// Главный файл - точка запуска\\
//==============================\\
import * as THREE from 'three';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import {TestObject} from './helpers/test.js';

class Game{

    constructor(){
        this.SceneManager = null;
        this.CameraManager = null;
        this.LightManager = null;
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
        this.cameraManager.createControls

        this.LightManager = new LightManager(scene);
        this.LightManager.createAll();

        const geometry = new THREE.SphereGeometry(5,5,5);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        this.cube = new THREE.Mesh(geometry,material);
        
        this.test = new TestObject(scene);
        this.test.createAll();
        
        window.addEventListener('resize', () => this.onWindowResize());

        this.animate()
    }

    onWindowResize(){
        this.CameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    animate = () =>{
        requestAnimationFrame(this.animate);


        this.test.cube.rotation.y += 0.01;
        this.test.cube.rotation.x += 0.01;
        this.cameraManager.update();

        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera());
    }
}

const game = new Game();
