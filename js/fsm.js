class FSM{
    constructor(npc){
        this.npc = npc;
        this.animation = false;
        this.distance = 0;
    }
    
    npcAttack(){
        if(this.animation == false){
            this.npc.attack(6, 6, false, 100);
        }
        //console.log('attac attack attack');
    }

    npcDie(){
        this.npc.die();
    }

    npcMove(playerPosition){
        if(this.npc.container.position.x < playerPosition + 15){
            this.npc.container.position.x += 0.5;
            this.npc.matchSpritePositionToContainer();
            this.animation = true;
        }

        if(this.npc.container.position.x > playerPosition - 15){
            this.npc.container.position.x -= 0.5;
            this.npc.matchSpritePositionToContainer();
            this.animation = true;
        }

        if(this.animation == true){
            this.npc.run(0, 3, true, 100);
        }

        if(this.npc.container.position.x < playerPosition){
            this.npc.turn(0);
        }else{
            this.npc.turn(-1);
        }

        if(this.npc.container.position.x === playerPosition + 15){
            this.animation = false;
            //this.npc.sprite.cellIndex = 6;
            console.log(this.animation);
        }
        if(this.npc.container.position.x === playerPosition - 15){
            this.animation = false;
            //this.npc.sprite.cellIndex = 6;
            console.log(this.animation);
        }

    }
}