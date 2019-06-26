class Player{
    constructor(health, shield, scene){
        this.scene = scene;
        this.health = health;
        this.shield = shield;
        this.attackPower = 100;
        this.gravityVector = 2.75;
    }

    matchSpritePositionToContainer(){
        this.sprite.position.x = this.container.position.x;
        this.sprite.position.y = this.container.position.y + 3;
        this.sprite.position.z = this.container.position.z;
    }

    run(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//33, 39, true, 100
    }

    attack(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//66, 70, true, 80
        return this.attackPower;
    }

    takeDamage(damage){
        this.health -= damage;
    }

    idle(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//0, 3, true, 500
    }

    turn(direction){
        this.sprite.invertU = direction;
    }

    die(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//55, 62, false, 100
    }

}

class Jedi extends Player{
    constructor(health, shield, spritePath, scene){
        super(health, shield, spritePath, scene);
        this.forcePower = 100;
        this.health = health;
        this.shield = shield;
        this.maxJumpHeight = 25;
        this.jumping = false;
        this.blocking = false;
        this.slashing = false;
        this.scene = scene;
        this.attackPower = 100;
        this.vectors = {x: 250, y: 11, z: -2.5};
        this.spritePath = spritePath;
        this.spriteManager = new BABYLON.SpriteManager('player-manager', this.spritePath, 112, 112, this.scene);
        this.sprite = new BABYLON.Sprite('player', this.spriteManager);
        this.sprite.width = 15;
        this.sprite.height = 15;
        this.sprite.cellIndex = 0;
        this.sprite.position = new BABYLON.Vector3(this.vectorX, this.vectorY+3, this.vectorZ);
        this.container = new BABYLON.MeshBuilder.CreateBox('player-container', {height: 10, width: 5}, this.scene);
        this.container.position = new BABYLON.Vector3(this.vectors.x, this.vectors.y, this.vectors.z);
        this.containerMaterial = new BABYLON.StandardMaterial('player-container', this.scene);
        this.containerMaterial.wireframe = false;
        this.containerMaterial.alpha = 0;
        this.container.material = this.containerMaterial;
    }

    saberAttack(troopers){
        if(troopers.length >= 1){
            for(let i = 0; i < troopers.length; i++){
                if(this.container.intersectsMesh(troopers[i].npc.container)){
                    if(troopers[i].npc.shield === 100){
                        troopers[i].npc.shield -= this.attackPower;
                        //console.log(`Health: ${troopers[i].npc.health} Shield: ${troopers[i].npc.shield}`);
                        return;
                    }
                    if(troopers[i].npc.shield === 0 && troopers[i].npc.health === 100){
                        troopers[i].npc.health -= this.attackPower;
                        //console.log(`Health: ${troopers[i].npc.health} Shield: ${troopers[i].npc.shield}`);
                        return;
                    }
                }
            }
        }
    }

    force(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//66, 70, true, 80
    }

    // forcePush(troopers, bolts){

    // }

    block(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//4, 5, false, 100
        return true;
    }

    jump(start, end, loop, speed){
        if(this.container.position.y < 22){
            this.container.position.y += 11;
            this.sprite.playAnimation(44, 46, false, 100);
            this.matchSpritePositionToContainer();
            this.jumping = true;
        }
        if(this.jumping == true && this.container.position.y > 11){
            this.container.position.y -= 11;
        }
        if(this.container.position.y === 11){
            this.jumping = false;
        }
    }
}

class Stormtrooper extends Player{
    constructor(health, shield, spritePath, scene){
        super(health, shield, spritePath, scene);
        this.forcePower = 100;
        this.health = health;
        this.shield = shield;
        this.scene = scene;
        this.speed = 0.5;
        this.vectors = {x: 40, y: 11, z: -2.5};
        this.spritePath = spritePath;
        this.spriteManager = new BABYLON.SpriteManager('trooper-manager', this.spritePath, 112, 112, this.scene);
        this.sprite = new BABYLON.Sprite('player', this.spriteManager);
        this.sprite.width = 15;
        this.sprite.height = 15;
        this.sprite.cellIndex = 0;
        this.sprite.position = new BABYLON.Vector3(this.vectorX, this.vectorY+3, this.vectorZ);
        this.container = new BABYLON.MeshBuilder.CreateBox('trooper-container', {height: 10, width: 10}, this.scene);
        this.container.position = new BABYLON.Vector3(this.spawn(), this.vectors.y, this.vectors.z);
        this.containerMaterial = new BABYLON.StandardMaterial('player-container', this.scene);
        this.containerMaterial.wireframe = false;
        this.containerMaterial.alpha = 0;
        this.container.material = this.containerMaterial;
    }

    spawn(){
        let spawPoint = Math.floor(Math.random() * 500) + 10; 
        return spawPoint;
    }
}

class Bolt{
    constructor(trooper, spritePath, scene){
        this.scene = scene;
        this.trooper = trooper;
        this.power = 50;
        this.spritePath = spritePath;
        this.spriteManager = new BABYLON.SpriteManager('bolt-manager', this.spritePath, 100, 100, this.scene);
        this.sprite = new BABYLON.Sprite('bolt', this.spriteManager);
        this.sprite.width = 15;
        this.sprite.height = 15;
        this.sprite.cellIndex = 0;
        this.container = new BABYLON.MeshBuilder.CreateBox('bolt', {height: 2, width: 7}, this.scene);
        this.container.position = new BABYLON.Vector3(this.trooper.npc.container.position.x, 11.78, -2.5);
        this.containerMaterial = new BABYLON.StandardMaterial('bolt-container', this.scene);
        this.containerMaterial.wireframe = false;
        this.containerMaterial.alpha = 0;
        this.container.material = this.containerMaterial;
    }

    boltDirectionTrajectory(player){
        if(player.container.position.x < this.container.position.x){
            this.container.position.x -= 0.75;
            this.matchSpritePositionToContainer();
            return this.container.position.x;
        }

        if(player.container.position.x > this.container.position.x){
            this.container.position.x += 0.75;
            this.matchSpritePositionToContainer();
            return this.container.position.x;
        }
    }

    hit(player){
        if(this.container.intersectsMesh(player.container) && player.blocking == true){
            
            if(player.health < 400){
                player.health += 25;
            }
            return true;
        }
        if(this.container.intersectsMesh(player.container)){
            if(player.shield > 0){
                player.shield -= this.power;
                return true;
            }

            if(player.shield == 0 && player.health > 0){
                player.health -= this.power;
                return true;
            }
        }
    }

    destroy(hit, boltsArray, index){
        if(hit){
            boltsArray[index].container.dispose();
            boltsArray[index].sprite.dispose();
            boltsArray[index].spriteManager.dispose();
            boltsArray[index].containerMaterial.dispose();
            boltsArray.splice(index, 1);
        }
    }

    matchSpritePositionToContainer(){
        this.sprite.position.x = this.container.position.x;
        this.sprite.position.y = this.container.position.y;
        this.sprite.position.z = this.container.position.z;
    }

    damage(player){
        player.health -= this.power;
    }
}

// class forcePush{
//     constructor(){

//     }

// }