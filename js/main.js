window.addEventListener('DOMContentLoaded', function(){

    let canvas = document.getElementById('renderCanvas');
    let engine = new BABYLON.Engine(canvas, true);

    let createScene = function(){
        
        let scene = new BABYLON.Scene(engine);
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        let gravityVector = new BABYLON.Vector3(0, -10.0, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);

        scene.enablePhysics();
        scene.collisionsEnabled = true;

        //scene.debugLayer.show();

        function showWorldAxis(size) {
            var makeTextPlane = function(text, color, size) {
                var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
                dynamicTexture.hasAlpha = true;
                dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
                var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
                plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
                plane.material.backFaceCulling = false;
                plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
                plane.material.diffuseTexture = dynamicTexture;
            return plane;
             };
            var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
              BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
              new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
              ], scene);
            axisX.color = new BABYLON.Color3(1, 0, 0);
            var xChar = makeTextPlane("X", "red", size / 10);
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
            var axisY = BABYLON.Mesh.CreateLines("axisY", [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
                ], scene);
            axisY.color = new BABYLON.Color3(0, 1, 0);
            var yChar = makeTextPlane("Y", "green", size / 10);
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
            var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
                ], scene);
            axisZ.color = new BABYLON.Color3(0, 0, 1);
            var zChar = makeTextPlane("Z", "blue", size / 10);
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
        };
        showWorldAxis(10);

        //CREATE CAMERA 
        let followCamera  = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, -20), scene);
        followCamera.radius = -50;
        followCamera.cameraRotation = 0;
        followCamera.heightOffset = 0;
        followCamera.rotationOffset = 0;
        followCamera.cameraAcceleration = 0.5;//0.005;
        followCamera.maxCameraSpeed = 10;
        
        //SKYLIGHT
        let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        //GROUND
        let ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:500, subdivisions: 2}, scene);
        ground.position = new BABYLON.Vector3(250, 6, -3);
        ground.checkCollisions = true;
        //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        
        //GROUND MATERIAL
        let groundMaterial = new BABYLON.StandardMaterial('ground-material', scene);
        groundMaterial.alpha = 0;
        ground.material = groundMaterial;

        //WORLD BACKGROUND PLANE/IMAGE
        let background = BABYLON.MeshBuilder.CreatePlane('dunes', {width: 500, height: 165, tileSize: 1}, scene);
        background.position = new BABYLON.Vector3(250, 58, 0);//68.50

        //WORLD BACKGROUND IMAGE/MATERIAL/TEXTURE
        let backGroundMaterial = new BABYLON.StandardMaterial('dune-sea', scene);
        backGroundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        backGroundMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
        backGroundMaterial.diffuseTexture = new BABYLON.Texture('./assets/worlds/tatooine-dune-sea.jpg');
        backGroundMaterial.emissiveTexture = new BABYLON.Texture("./assets/worlds/tatooine-dune-sea.jpg", scene);
        background.material = backGroundMaterial;

        //CREATE PLAYER
        let luke = new Jedi(200, 200, "./assets/sprites/ls-sprite-sheet.png", scene);
        luke.matchSpritePositionToContainer();
        followCamera.lockedTarget = luke.container;

        //CREATE STORM-TROOPERs
        let troopers = [];

        setInterval(()=>{
            let random = Math.round(Math.random());
            if(random == 0 && troopers.length < 10){
                let trooper = new Stormtrooper(100, 100, './assets/sprites/st-sprite-sheet.png', scene);
                trooper.matchSpritePositionToContainer();

                let npc = new FSM(trooper);
                troopers.push(npc);

                console.log(troopers);
            }
        }, 2000);

        function engage(player, troopersArray){
            if(troopersArray.length >= 1){

                troopersArray.forEach((trooper, i)=>{
                    if(player.container.intersectsMesh(trooper.npc.container)){
                        if(trooper.npc.shield > 0 ){
                            trooper.npc.shield -= luke.attackPower; 
                        }
                        if(trooper.npc.shield == 0){
                            trooper.npc.health -= luke.attackPower;
                        }
                        console.log(`health: ${trooper.npc.health} shield: ${trooper.npc.shield}`);
                    }
                    //break;
                });
            }
        }

        //REGISTER KEY INPUT EVENTS
        let inputMap = {};
        let animating = false;

        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt)=>{								
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt)=>{								
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: 'l'}, (evt)=>{
            luke.attack(66, 70, false, 30);
            setTimeout(()=>{
               if(!animating){
                luke.block(4, 5, false, 50);
               }else{
                luke.run(33, 39, true, 100);
               }
            }, 200);
            engage(luke, troopers);
        }));

        scene.onBeforeRenderObservable.add(()=>{

            let keydown = false;

            if(inputMap["d"] || inputMap["ArrowRight"]){
                luke.container.position.x += 1.0;
                luke.matchSpritePositionToContainer();
                luke.turn(0);
                keydown=true;
                if(keydown == true && animating == false){
                    luke.run(33, 39, true, 100);
                    animating = true;
                }
            }

            if(inputMap["a"] || inputMap["ArrowLeft"]){
                luke.container.position.x -= 1.0;
                luke.matchSpritePositionToContainer();
                luke.turn(-1);
                keydown=true;
                if(keydown == true && animating == false){
                    luke.run(33, 39, true, 100);
                    animating = true;
                }
            }

            if(inputMap["k"]){
                keydown=true;
                if(keydown == true && animating == false){
                    luke.force(22, 29, false, 100);
                    animating = true;
                }
            }

            if(inputMap["m"]){
                luke.matchSpritePositionToContainer();
                keydown=true;
                if(keydown == true && animating == false){
                    luke.block(4, 5, false, 100);
                    animating = true;
                }
            }
            
            if(keydown == false && animating == true){
                luke.idle(0, 3, true, 500);
                luke.matchSpritePositionToContainer();
                animating = false;
            }

            //PLAYER BOUNDARIES 
            if(luke.container.position.x >= 450){
                luke.container.position.x = 450;
                luke.matchSpritePositionToContainer();
            }

            if(luke.container.position.x <= 50){
                luke.container.position.x = 50;
                luke.matchSpritePositionToContainer();
            }

        });


        scene.onBeforeRenderObservable.add(()=>{
            if(inputMap['w']){
                luke.jump();
            }
        });

        scene.onBeforeRenderObservable.add(()=>{
            //engage(luke, troopers);
            troopers.forEach((trooper, i)=>{
                let random = Math.round(Math.random());
                trooper.npcMove(luke.container.position.x, random);

                if(trooper.npc.health <= 0){
                    trooper.npcDie(luke, troopers, i);
                }
            });
        });

        return scene;
    }


    let scene = createScene();

    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener('resize', function(){
        engine.resize;
    });

});