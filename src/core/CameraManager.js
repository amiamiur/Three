
//=============================\\
// Менеджер управления камерой \\
//==============================\\
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {CAMERA_CONFIG} from '../config/camera.js';

export class CameraManager{
    constructor(rendererDomElement){
        this.camera = null;
        this.rendererDomElement = rendererDomElement;
    }

    create(){
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_CONFIG.fov, 
            window.innerWidth / window.innerHeight, 
            CAMERA_CONFIG.near, 
            CAMERA_CONFIG.far
        );
        this.camera.position.set(
            CAMERA_CONFIG.position.x,
            CAMERA_CONFIG.position.y,
            CAMERA_CONFIG.position.z,
        )
        this.camera.lookAt(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        )
        return this.camera
    }

    onWindowResize(camera){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    createControls(){
        const {enablePan, autoRotate, dampingFactor, enableDamping, target, rotateSpeed} = CAMERA_CONFIG.controls;
        this.controls = new OrbitControls(this.camera, this.rendererDomElement)

        this.controls.enableDamping = enableDamping;
        this.controls.enablePan = enablePan;
        this.controls.autoRotate = autoRotate;
        this.controls.dampingFactor = dampingFactor;
        this.controls.rotateSpeed = rotateSpeed;

        this.controls.target.set(target.x, target.y, target.z);

        return this.controls;

    }

    update(){
        if(this.controls){
            this.controls.update();
        }
    }
    
    
    getCamera(){
        return this.camera
    }
}