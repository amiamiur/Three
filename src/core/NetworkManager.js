import { io } from 'socket.io-client';

export class NetworkManager{
    constructor(){
        this.socket = null;
        this.sessionId = null;
        this.playerName = null;
        this.modelIndex = null;
        this.onInit = null;
        this.onPlayerJoined = null;
        this.onPlayerMoved = null;
        this.onPlayerLeft = null;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
    }

    connect(sessionId, playerName, modelIndex = 0) {
        this.sessionId = sessionId;
        this.playerName = playerName;
        this.modelIndex = modelIndex;
        this.socket = io();
        
        this.socket.on('connect', () => {
            this.socket.emit('join', sessionId, playerName, modelIndex);
        });
        
        this.socket.on('init', (players) => {
            if (this.onInit) this.onInit(players);
        });
        
        this.socket.on('playerJoined', (player) => {
            if (this.onPlayerJoined) this.onPlayerJoined(player);
        });
        
        this.socket.on('playerMoved', (data) => {
            if (this.onPlayerMoved) this.onPlayerMoved(data);
        });
        this.socket.on('playerLeft', (playerId) => {
            if (this.onPlayerLeft) this.onPlayerLeft(playerId);
        });
        setInterval(() => {
            if (this.socket && this.socket.connected) {
                this.socket.emit('move', this.position, this.rotation);
            }
        }, 50);
    }
    
    sendPosition(position, rotation) {
        this.position = { x: position.x, y: position.y, z: position.z };
        this.rotation = { x: rotation.x, y: rotation.y, z: rotation.z };
    }
}