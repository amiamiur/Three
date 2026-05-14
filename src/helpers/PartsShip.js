import * as THREE from 'three';

export class PartsShip{
    constructor(){
        this.ship = null;
    }

    addCabin(group){
        this.ship = group;
        const geometry = new THREE.CylinderGeometry( 1.8, 5, 5, 8, 1, false, 0.29, 3 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        material.side = 2;
        material.roughness = 0.5;
        material.metalness = 0.5;
        const cylinder = new THREE.Mesh( geometry, material );
        this.ship.add( cylinder );

    }
}