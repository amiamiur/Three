import * as THREE from 'three';
import { PartsShip } from './PartsShip.js';

export class TestObject{
    constructor(scene){
        this.scene = scene;
        this.cube = null;
        this.grid = null;
        this.group = null;
        this.partsShip = new PartsShip();
    }

    createAll(){
        // this._createCube();
        this._createFigure();
        this._createGrid();
    }

    async _createFigure(group){
        this.group = new THREE.Group();    
        this.partsShip.addCabin(this.group, 'rock');
        this.partsShip.addCabin(this.group, 'armor');
        this.partsShip.addCabin(this.group, 'lunar');
        console.log(this.group)
        this.scene.add(this.group);
    }

    _createGrid(){
        const gridHelper = new THREE.GridHelper(70, 20, 'cyan', 'cyan');
        this.scene.add(gridHelper);
    }

    _createAxesHelper(){
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

}