import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3000;

const fastify = Fastify({ logger: false });

fastify.register(fastifyStatic, {root: __dirname});
fastify.get('/', (require, reply) => {
    reply.sendFile('index.html');
});

fastify.listen({port: PORT, host: '0.0.0.0'}, () => {
    console.log(`SERVER RUN: http://localhost:${PORT}`);
});

const io = new Server(fastify.server);
const sessions = new Map();

class PlayerData{
    constructor(playerId, playerName, selectModel){
        this.playerId = playerId;
        this.playerName = playerName;
        this.currentModel = selectModel;
        this.position = {x:0, y:0, z:0};
        this.rotation = {x:0, y:0, z:0};
    }
}

io.on('connection', (socket) => {
    socket.on('join', (sessionId, playerName, modelIndex) => {
        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, new Map());
        }
        
        const session = sessions.get(sessionId);
        const playerData = new PlayerData(socket.id, playerName, modelIndex);
        
        session.set(socket.id, playerData);
        
        const otherPlayers = Array.from(session.values()).filter(p => p.id !== socket.id);
        socket.emit('init', otherPlayers);

        socket.broadcast.emit('playerJoined', playerData);
    });
    
    socket.on('move', (position, rotation) => {
        for (const [_, session] of sessions) {
            if (session.has(socket.id)) {
                const player = session.get(socket.id);
                if (player) {
                    player.position = position;
                    player.rotation = rotation;
                    socket.broadcast.emit('playerMoved', { 
                        id: socket.id, 
                        position, 
                        rotation 
                    });
                }
                break;
            }
        }
    });
    
    socket.on('disconnect', () => {
        for (const [sessionId, session] of sessions) {
            if (session.has(socket.id)) {
                session.delete(socket.id);
                socket.broadcast.emit('playerLeft', socket.id);
                if (session.size === 0) {
                    sessions.delete(sessionId);
                }
                break;
            }
        }
    });
});