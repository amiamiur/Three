import * as THREE from 'three';
import { TextureLoader } from '../core/TextureLoader.js';

export class PartsShip{
    constructor(){
        this.ship = null;
        this.textureLoader = new TextureLoader();
    }

    addCabin(group){
        this.ship = group;
        const geometry = new THREE.CylinderGeometry( 1.8, 5, 5, 8, 1, false, 0.29, 3 );
        const map = this.textureLoader.load(0);
        const material = new THREE.MeshBasicMaterial( { map: map } );
        material.side = 2;
        const cylinder = new THREE.Mesh( geometry, material );
        this.ship.add( cylinder );

    }
}