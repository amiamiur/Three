import * as THREE from 'three';
import { TEXTURES_CONFIG } from '../config/texture.js';

export class TextureLoader{
    constructor(){
        this.textureLoader = new THREE.TextureLoader();
    }

    load(index){
        let ship_config = '';
        if (index === 0){
            ship_config = TEXTURES_CONFIG.url.ship.albedo;
        }
        const texture = this.textureLoader.load(ship_config);
        return texture;
    }
}
