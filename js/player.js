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
        this.container = new BABYLON.MeshBuilder.CreateBox('player-container', {height: 10, width: 10}, this.scene);
        this.container.position = new BABYLON.Vector3(this.vectors.x, this.vectors.y, this.vectors.z);
        this.containerMaterial = new BABYLON.StandardMaterial('player-container', this.scene);
        this.containerMaterial.wireframe = true;
        this.containerMaterial.alpha = 1;
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
        this.containerMaterial.wireframe = true;
        this.containerMaterial.alpha = 1;
        this.container.material = this.containerMaterial;
    }

    spawn(){
        let spawPoint = Math.floor(Math.random() * 500) + 10; 
        return spawPoint;
    }
}

// class blasterBullet(){
//     constructor(){}
// }