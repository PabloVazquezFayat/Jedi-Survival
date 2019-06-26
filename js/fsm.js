class FSM{
    constructor(npc, scene){
        this.npc = npc;
        this.scene = scene;
        this.animation = false;
        this.random = Math.round(Math.random());
    }

    npcDie(player, array, index){
        this.npc.die(4, 5, false, 30);

        if(this.random == 0){
            if(player.sprite.invertU == -1){
                this.npc.container.position.x -= 2.0;
                this.npc.container.position.y -= 0.5;
                this.npc.sprite.angle -= (Math.PI/16);
            }else if(player.sprite.invertU == 0){
                this.npc.container.position.x += 2.0;
                this.npc.container.position.y -= 0.5;
                this.npc.sprite.angle += (Math.PI/16);
            }
        }else{
            if(player.sprite.invertU == -1){
                this.npc.container.position.x -= 2.0;
                this.npc.container.position.y += 0.5;
                this.npc.sprite.angle -= (Math.PI/16);
            }else if(player.sprite.invertU == 0){
                this.npc.container.position.x += 2.0;
                this.npc.container.position.y += 0.5;
                this.npc.sprite.angle += (Math.PI/16);
            }
        }
        
        if(this.npc.container.position.y < -10 || this.npc.container.position.y > 20){
            array[index].npc.container.dispose();
            array[index].npc.sprite.dispose();
            array[index].npc.spriteManager.dispose();
            array[index].npc.containerMaterial.dispose();
            array.splice(index, 1);
        }
    }

    npcMove(playerX, chase){

        let playerPosX = Math.ceil(playerX);

        if(chase){
            if(this.npc.container.position.x < playerPosX + 15){//+15
                this.npc.container.position.x += this.npc.speed;
                this.npc.matchSpritePositionToContainer();
            }
    
            if(this.npc.container.position.x > playerPosX - 15){//-15
                this.npc.container.position.x -= this.npc.speed;
                this.npc.matchSpritePositionToContainer();
            }
    
            if(this.npc.container.position.x < playerPosX){
                this.npc.turn(0);
            }else{
                this.npc.turn(-1);
            }
        }

        if(this.animation === false ){
            this.npc.run(0, 3, true, 100);
            this.animation = true;
        }

        if(this.npc.container.position.x === playerPosX + 14.5  || this.npc.container.position.x === playerPosX - 15){
            this.animation = false;
            this.npc.sprite.cellIndex = 6;
        }
    }
}