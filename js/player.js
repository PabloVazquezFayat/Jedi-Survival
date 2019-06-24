class Player{
    constructor(health, shield, scene){
        this.scene = scene;
        this.health = health;
        this.shield = shield;
        this.attackPower = 100;
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
        this.scene = scene;
        this.attackPower = 100;
        this.vectors = {x: 40, y: 11, z: -2.5};
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

    force(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//66, 70, true, 80
    }

    block(start, end, loop, speed){
        this.sprite.playAnimation(start, end, loop, speed);//4, 5, false, 100
        return true;
    }
}

class Stormtrooper extends Player{
    constructor(health, shield, spritePath, scene){
        super(health, shield, spritePath, scene);
        this.forcePower = 100;
        this.health = health;
        this.shield = shield;
        this.scene = scene;
        this.vectors = {x: 40, y: 11, z: -2.5};
        this.spritePath = spritePath;
        this.spriteManager = new BABYLON.SpriteManager('player-manager', this.spritePath, 112, 112, this.scene);
        this.sprite = new BABYLON.Sprite('player', this.spriteManager);
        this.sprite.width = 15;
        this.sprite.height = 15;
        this.sprite.cellIndex = 0;
        this.sprite.position = new BABYLON.Vector3(this.vectorX, this.vectorY+3, this.vectorZ);
        this.container = new BABYLON.MeshBuilder.CreateBox('player-container', {height: 10, width: 10}, this.scene);
        this.container.position = new BABYLON.Vector3(this.spawn(), this.vectors.y, this.vectors.z);
        this.containerMaterial = new BABYLON.StandardMaterial('player-container', this.scene);
        this.containerMaterial.wireframe = true;
        this.containerMaterial.alpha = 1;
        this.container.material = this.containerMaterial;
    }

    spawn(){
        let spawPoint = Math.floor(Math.random() * 100) + 10; 
        return spawPoint;
    }
}
