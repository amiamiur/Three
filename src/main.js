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
import { NetworkManager } from './core/NetworkManager.js';

class Game{

    constructor(){
        this.SceneManager = null;
        this.CameraManager = null;
        this.LightManager = null;
        this.ModelLoader = null;
        this.renderer = null;
        this.networkManager = null;
        this.remotePlayers = new Map();
        
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
        },1000);

        this.generator = new Generator(scene);
        this.generator.generateAll();

        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        if (sessionId) {
            const playerName = urlParams.get('name') || `Player_${Math.floor(Math.random() * 1000)}`;
            this.networkManager = new NetworkManager();
            
            this.networkManager.onInit = (players) => {
                players.forEach(player => this.addRemotePlayer(player));
            };
            
            this.networkManager.onPlayerJoin = (player) => {
                this.addRemotePlayer(player);
            };
            
            this.networkManager.onPlayerMove = (data) => {
                const remote = this.remotePlayers.get(data.id);
                if (remote) {
                    remote.targetPosition = data.position;
                    remote.targetRotation = data.rotation;
                }
            };
            
            this.networkManager.onPlayerLeave = (id) => {
                const remote = this.remotePlayers.get(id);
                if (remote && remote.model) {
                    this.sceneManager.getScene().remove(remote.model);
                    this.remotePlayers.delete(id);
                }
            };
            
            const modelIndex = 0;
            this.networkManager.connect(sessionId, playerName, modelIndex);
        }
        
        


        // this.ModelLoader = new ModelLoader(scene);
        // this.ModelLoader.load();
        
        //this.pane = new PaneConstructor();
        //this.pane.createAll(this.model);

        this.clock = new THREE.Timer();

        window.addEventListener('resize', () => this.onWindowResize());

        window.addEventListener( 'keydown', (event) => {
            if(event.key === 'a'){
                this.ship.position.z -= 0.01;
                this.ship.rotation.y += 0.01;
            }
            if(event.key === 'd'){
                this.ship.position.z += 0.01;
                this.ship.rotation.y -= 0.01;
            }
            if(event.key === 'w'){
                this.ship.position.x += 0.1;
            }
            if(event.key === 's'){
                this.ship.position.x -= 0.1;
            }
        })

        this.animate()
    }

    updateLocalShip(deltaTime) {
        if (!this.localShip) return;
        
        if (this.networkManager) {
            this.networkManager.sendPosition(
                this.localShip.position,
                this.localShip.rotation
            );
        }
    }

    addRemotePlayer(playerData){
        if (this.remotePlayers.has(playerData.id)) return;
        
        const remoteLoader = new ModelLoader(this.sceneManager.getScene());
        new ShipGenerator(remoteLoader, playerData.modelIndex || 0);
        
        const checkInterval = setInterval(() => {
            if (remoteLoader.model) {
                clearInterval(checkInterval);
                remoteLoader.model.position.copy(playerData.position);
                remoteLoader.model.rotation.copy(playerData.rotation);
                
                this.remotePlayers.set(playerData.id, {
                    model: remoteLoader.model,
                    targetPosition: playerData.position,
                    targetRotation: playerData.rotation
                });
            }
        }, 50);
    }

    onWindowResize(){
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        
        this.updateLocalShip(delta);
        
        const interpolationFactor = 0.3;
        
        for (const [id, remote] of this.remotePlayers) {
            if (!remote.model) continue;
            
            if (remote.targetPosition) {
                remote.model.position.lerp(remote.targetPosition, interpolationFactor);
            }
            
            if (remote.targetRotation) {
                remote.model.rotation.x += (remote.targetRotation.x - remote.model.rotation.x) * interpolationFactor;
                remote.model.rotation.y += (remote.targetRotation.y - remote.model.rotation.y) * interpolationFactor;
                remote.model.rotation.z += (remote.targetRotation.z - remote.model.rotation.z) * interpolationFactor;
            }
        }
        
        if (this.cameraManager) {
            this.renderer.render(this.sceneManager.getScene(), this.cameraManager.getCamera());
        }
    }
}

const game = new Game();
