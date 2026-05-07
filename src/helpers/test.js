import * as THREE from 'three';

export class TestObject{
    constructor(scene){
        this.scene = scene;
        this.cube = null;
        this.grid = null;
    }

    createAll(){
        this._createCube();
        //this._createGrid();
    }

    _createCube(){    
        const geometry = new THREE.BoxGeometry(5,5,5);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        this.cube = new THREE.Mesh(geometry,material);     
        this.scene.add(this.cube);

        return this.cube;
    }

    _createGrid(){
        this.scene.add(this.grid);
    }

}