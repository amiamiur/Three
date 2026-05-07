import * as THREE from 'three';
import { LIGHT_CONFIG } from '../config/light.js';

export class LightManager {
    constructor(scene){
        this.scene = scene;
        this.lights = {};
    }

    createAll(){
        this._createAmbientLight();
        this._createMainLight();
    }

    _createMainLight(){
        const config = LIGHT_CONFIG.main;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.main = light;
    }

    _createAmbientLight(){
        const config = LIGHT_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
    }

    getLight(name){
        return this.lights[name];
    }
}