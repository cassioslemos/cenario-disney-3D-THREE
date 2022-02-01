import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';
import {ColladaLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/ColladaLoader.js';
import {FBXLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';

const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

var camerarotationy = 0; //informa a rotação da camera
var flagaladdin=0; //se a animação do aladdin acabou
var flagpocahontas=0; //se a animação da pocahontas acabou
var flagflora=0; //se a animação da pocahontas acabou
var flagfauna=0; //se a animação da pocahontas acabou
var flagprimavera=0; //se a animação da pocahontas acabou
var flagceu=0; //diz quando trocar o céu
var flagsom=-1; //diz quando trocar o som de ambiente


function cloneFbx( source ) { //clona um objeto fbx

    var cloneLookup = new Map();

    var clone = source.clone();
    
    clone.animations = source.animations;

    parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {

        cloneLookup.set( sourceNode, clonedNode );

    } );

    source.traverse( function ( sourceMesh ) {

        if ( ! sourceMesh.isSkinnedMesh ) return;

        var sourceBones = sourceMesh.skeleton.bones;
        var clonedMesh = cloneLookup.get( sourceMesh );

        clonedMesh.skeleton = sourceMesh.skeleton.clone();

        clonedMesh.skeleton.bones = sourceBones.map( function ( sourceBone ) {

            if ( ! cloneLookup.has( sourceBone ) ) {

                throw new Error( 'THREE.AnimationUtils: Required bones are not descendants of the given object.' );

            }

            return cloneLookup.get( sourceBone );

        } );

        clonedMesh.bind( clonedMesh.skeleton, sourceMesh.bindMatrix );

    } );

    return clone;

}

function parallelTraverse( a, b, callback ) {

    callback( a, b );

    for ( var i = 0; i < a.children.length; i ++ ) {

        parallelTraverse( a.children[ i ], b.children[ i ], callback );

    }

}


function loopAladdin (mixer) { //faz com que o próximo movimento do loop seja de onde o ultimo parou
    var objeto = mixer.getRoot();
    mixer.addEventListener( 'loop', function(e) { 
       if(flagaladdin==0){
           flagaladdin=1;
           objeto.rotateY(degToRad(180));
           objeto.translateX(-3);
           objeto.translateZ(-10);
       }
     } );
}

function loopPocahontas (mixer) { //faz com que o próximo movimento do loop seja de onde o ultimo parou
    var objeto = mixer.getRoot();
    mixer.addEventListener( 'loop', function(e) { 
       if(flagpocahontas==0){
           flagpocahontas=1;
           objeto.rotateY(degToRad(180));
           objeto.translateX(-3);
           objeto.translateZ(-20);
       }
     } );
}

function loopFlora (mixer) { //faz com que o próximo movimento do loop seja de onde o ultimo parou
    var objeto = mixer.getRoot();
    mixer.addEventListener( 'loop', function(e) { 
       if(flagflora==0){
           flagflora=1;
           objeto.rotateY(degToRad(180));
           objeto.translateZ(-100);
       }
     } );
}

function loopFauna (mixer) { //faz com que o próximo movimento do loop seja de onde o ultimo parou
    var objeto = mixer.getRoot();
    mixer.addEventListener( 'loop', function(e) { 
       if(flagfauna==0){
           flagfauna=1;
           objeto.rotateY(degToRad(180));
           objeto.translateZ(-100);
       }
     } );
}

function loopPrimavera (mixer) { //faz com que o próximo movimento do loop seja de onde o ultimo parou
    var objeto = mixer.getRoot();
    mixer.addEventListener( 'loop', function(e) { 
       if(flagprimavera==0){
           flagprimavera=1;
           objeto.rotateY(degToRad(180));
           objeto.translateZ(-50);
       }
     } );
}

function animate (mixers, delta) { //faz animação
           requestAnimationFrame(animate);
           if (mixers){
             for(var i=0; i<mixers.length; i++){
                mixers[i].update(delta);
                if(mixers[i].name=="aladdin"){ //se for animação do aladdin
                   loopAladdin(mixers[i]);
                }
                 if(mixers[i].name=="pocahontas"){ //se for animação da pocahontas
                   loopPocahontas(mixers[i]);
                }
                 if(mixers[i].name=="flora"){ //se for animação da flora
                   loopFlora(mixers[i]);
                }
                 if(mixers[i].name=="fauna"){ //se for animação da fauna
                   loopFauna(mixers[i]);
                }
                 if(mixers[i].name=="primavera"){ //se for animação da primavera
                   loopPrimavera(mixers[i]);
                }
             }
           } 
}

function criaVizinhosFloresta (root, scene,quant,tree) { //cria o chão da floresta e as árvores
    var sorteio; //decide se o terreno vai ter árvore
    for(var i=1; i<=quant; i++){
        var grass = root.clone();
        
        for(var j=1; j<=quant; j++){ 
            var clone = grass.clone();
            clone.translateX(j*50);
            scene.add(clone);
            sorteio = Math.floor(Math.random() * 10);
            if(sorteio==0){
                criarArvore(clone, tree, scene,j*50,0);    
            }
            clone = grass.clone();
            clone.translateX(j*-50);
            scene.add(clone);
            sorteio = Math.floor(Math.random() * 10);
            if(sorteio==0){
                criarArvore(clone, tree, scene,j*-50,0);    
            }
            if(i==1){
                clone = grass.clone();
                clone.translateY(j*50);
                scene.add(clone);
                sorteio = Math.floor(Math.random() * 10);
                if(sorteio==0){
                    criarArvore(clone, tree, scene,0,j+50);    
                }
                if(j!=quant){
                    clone = grass.clone();
                    clone.translateY(j*-50);
                    scene.add(clone);
                    sorteio = Math.floor(Math.random() * 10);
                    if(sorteio==0){
                        criarArvore(clone, tree, scene,0,j-50);    
                    }
                }
            }   
        }
        grass.translateY(i*50);
        for(var j=1; j<=quant; j++){
            var clone = grass.clone();
            clone.translateX(j*50);
            scene.add(clone);
            sorteio = Math.floor(Math.random() * 10);
            if(sorteio==0){
                criarArvore(clone, tree, scene,j*50,i*50);    
            }
            clone = grass.clone();
            clone.translateX(j*-50);
            scene.add(clone);
            sorteio = Math.floor(Math.random() * 10);
            if(sorteio==0){
                criarArvore(clone, tree, scene,j*-50,i*50);    
            } 
        }
        if(i!=quant){
            grass = root.clone();
            grass.translateY(i*-50);
            for(var j=1; j<=quant; j++){
                var clone = grass.clone();
                clone.translateX(j*50);
                scene.add(clone);
                sorteio = Math.floor(Math.random() * 10);
                if(sorteio==0){
                    criarArvore(clone, tree, scene,j*50,i*-50);    
                }
                clone = grass.clone();
                clone.translateX(j*-50);
                scene.add(clone);
                sorteio = Math.floor(Math.random() * 10);
                if(sorteio==0){
                    criarArvore(clone, tree, scene,j*-50,i*-50);    
                } 
            }
        }
    }
}
function criaVizinhosDeserto (root, scene,quant, lado, frente) { //cria o chão do deserto
    for(var i=1; i<=quant; i++){
        var sand = root.clone();
        for(var j=1; j<=quant; j++){
            var clone = sand.clone();
            clone.translateX(j*50*lado);
            scene.add(clone);
            if(i==1){
                clone = sand.clone();
                clone.translateY(j*frente*50);
                scene.add(clone);
            }   
        }
        sand = root.clone();
        sand.translateY(i*frente*50);
        for(var j=1; j<=quant; j++){
            var clone = sand.clone();
            clone.translateX(j*50*lado);
            scene.add(clone); 
        }
    }
}
function criaVizinhosCampo (root, scene,quant,lado,frente) { //cria o chão do campo
    for(var i=1; i<=quant; i++){
        var grass = root.clone();
        for(var j=1; j<=quant; j++){
            var clone = grass.clone();
            clone.translateX(j*50*lado);
            scene.add(clone);
            if(i==1){
                clone = grass.clone();
                clone.translateY(j*frente*50);
                scene.add(clone);
            }   
        }
        grass = root.clone();
        grass.translateY(i*frente*50);
        for(var j=1; j<=quant; j++){
            var clone = grass.clone();
            clone.translateX(j*50*lado);
            scene.add(clone); 
        }
    }
}

function criarArvore(root, tree, scene, i,j){ //cria árvores
    var localX = Math.random() * 50; //lugar aleatório
    var localZ = Math.random() * 50;
    var clone = cloneFbx(tree);
    clone.translateX(i+localX);
    clone.translateZ(j+localZ);
    clone.scale.set(10,10,10);
    scene.add(clone);
}

function main() {
  const clock = new THREE.Clock();
  var mixers = []; //guarda animações
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  const fov = 45;
  const aspect = 2;  
  const near = 0.1;
  const far = 150000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 50);
  const scene = new THREE.Scene();
  var geometry = new THREE.SphereGeometry(10000,32,16); //cria esfera do céu
  var SphereMaterials = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("/Textures/skycube_1/sky.jpg"), side: THREE.DoubleSide}); //textura do céu
  var sphere = new THREE.Mesh(geometry,SphereMaterials);
  scene.background = new THREE.Color(0xdddddd);
  scene.add(sphere);
 
    const listener = new THREE.AudioListener();
    camera.add( listener );

    //cria fonte de audio
    const sound = new THREE.Audio( listener );

    // carrega o audio desejado
    const audioLoader = new THREE.AudioLoader();
    
    const skyColor = 0xB1E1FF;  
    const groundColor = 0xB97A20;  
    const intensity = 1;
    const light1 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light1);
  
    
    

    const color = 0xFFFFFF;
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(0, 10, 0);
    light2.target.position.set(-5, 0, 0);
    scene.add(light2);
    scene.add(light2.target);

     
{
    //CARREGADORES DE MODELOS   
    const fbxLoader = new FBXLoader(); 
    const colladaloader = new ColladaLoader();
    const mtlLoader = new MTLLoader();
    const gltfLoader = new GLTFLoader();

    //FLORESTA
    
    geometry = new THREE.PlaneGeometry(50,50 ); //cria plano
    var material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("/Models/Grass/Ground.jpg"), side: THREE.DoubleSide}); //textura grama
    var plane = new THREE.Mesh( geometry, material );
    plane.rotateX(degToRad(90));
    scene.add( plane );
    var quant=6;
    fbxLoader.load('/Models/Grass/3DPaz_fir-tree_01.fbx', (tree) => {
        plane.position.x=0; //reset a posição do plano, pois por algum motivo ela é alterada pelo fbxLoader
        plane.position.y=0;
        plane.position.z=0;
        tree.scale.set(10,10,10);
        tree.translateX(40)
        scene.add(tree);
        criaVizinhosFloresta(plane, scene, quant, tree);
    });

    
    //AGRABAH
    
    colladaloader.load( 'Models/Agrabah/model.dae', function ( collada ) { //cria agrabah
		var city = collada.scene;
        city.translateX(30*-50);
        city.translateY(300);
        city.scale.set(1,1,1);
        city.children[0].children.forEach(child => { //faz sumir linhas brancas
            if (child.type == "LineSegments") {
                child.visible = false;
            }
        });
        scene.add( city );
    } );
    
    colladaloader.load( 'Models/Rock/model.dae', function ( collada ) { //cria rochas do deserto
		var rock = collada.scene;
        rock.children[0].children[1].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false;
            }
        });
        var rock2 = rock.clone();
        rock.translateX(2100);
        rock.translateY(1950);
        rock.rotateZ(degToRad(180));
        rock.scale.set(3,3,3);
        scene.add( rock );
        rock2.translateX(3100);
        rock2.translateY(1100);
        rock2.scale.set(3,3,3);
        scene.add( rock2 );
    } );
    
    colladaloader.load( 'Models/Oasis/model.dae', function ( collada ) { //cria oasis
		var oasis = collada.scene;
        oasis.children[0].children[1].children.forEach(child => {
            child.children.forEach(child2 => {
                child2.children.forEach(child3 => {
                    if (child3.type == "LineSegments") { //remove linhas brancas das arvores
                        child3.visible = false;
                    }
                    child3.children.forEach(child4 => { //remove linhas brancas dos frutos
                        if (child4.type == "LineSegments") {
                            child4.visible = false;
                        }
                    });
                });
            });
            if (child.type == "LineSegments") {
                child.visible = false;
            }
            if (child.name == "instance_27") {
                child.translateZ(150);
            }
        });
        oasis.translateX(2000);
        oasis.translateY(1000);
        oasis.translateZ(-30);
        oasis.scale.set(0.2,0.2,0.2);
        scene.add( oasis );
    } );
    
    
    mtlLoader.load('/Models/Cave%20of%20Wonders/LionGate.mtl', (mtl) => { //cria caverna das maravilhas
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/Cave%20of%20Wonders/LionGate.obj', (root) => {
            root.translateX(-2500);
            root.translateY(20);
            root.translateZ(-3000);
            root.scale.set(0.1,0.1,0.1);
            scene.add(root);
        });  
    });
        
    
    
    
    //MONTANHA PELADA
    
    fbxLoader.load('/Models/Fire/fire.fbx', (fire) => { //cria fogo
        const mixer = new THREE.AnimationMixer(fire); //animação
        const idle = mixer.clipAction(fire.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        fire.translateX(1500);
        fire.translateY(820);
        fire.translateZ(1880);
        scene.add(fire);
    });  
    
    mtlLoader.load('/Models/Mountain/mountain.mtl', (mtl) => { //cria montanha pelada
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/Mountain/mountain.obj', (root) => {
            root.translateX(1500);
            root.translateY(300);
            root.translateZ(2000);
            root.scale.set(1000,1000,1000);
            scene.add(root);
        });  
    });
    
    colladaloader.load( 'Models/Graveyard/model.dae', function ( collada ) { //cria cemitério
		var graveyard = collada.scene;
        graveyard.scale.set(0.3,0.3,0.3)
        graveyard.translateX(500);
        graveyard.translateY(-1700);
        graveyard.children[0].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false;
            }
        });
        scene.add( graveyard );
    } );
    
    
    fbxLoader.load('/Models/Village/village.fbx', (root) => { //cria vilarejo
        root.children[13].visible = false;
        root.translateX(800);
        root.translateZ(1100);
        scene.add(root);
    }); 
    
    
    //TERRA INDÍGENA
    
    mtlLoader.load('/Models/Tenda/tenda.mtl', (mtl) => { //cria tenda
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/Tenda/tenda.obj', (root) => {
            root.scale.set(40,40,40);
            var clone1 = root.clone();
            var clone2 = root.clone();
            root.translateX(4500);
            root.translateY(10);
            root.translateZ(3900);
            scene.add(root);
            clone1.translateX(4550);
            clone1.translateY(10);
            clone1.translateZ(3900);
            scene.add(clone1);
            clone2.translateX(4530);
            clone2.translateY(10);
            clone2.translateZ(3950);
            scene.add(clone2);
        });  
    });

    
    fbxLoader.load('/Models/Grass/3DPaz_fir-tree_01.fbx', (root) => { //cria árvores da terra indígena
        var clone1 = cloneFbx(root);
        var clone2 = cloneFbx(root);
        var clone3 = cloneFbx(root);
        var clone4 = cloneFbx(root);
        var clone5 = cloneFbx(root);
        var clone6 = cloneFbx(root);
        var clone7 = cloneFbx(root);
        root.translateX(4300);
        root.translateZ(3900);
        root.scale.set(10,10,10);
        scene.add(root);
        clone1.translateX(4350);
        clone1.translateZ(3940);
        clone1.scale.set(10,10,10);
        scene.add(clone1);
        clone2.translateX(4250);
        clone2.translateZ(3700);
        clone2.scale.set(10,10,10);
        scene.add(clone2);
        clone3.translateX(4550);
        clone3.translateZ(3650);
        clone3.scale.set(10,10,10);
        scene.add(clone3);
        clone4.translateX(4350);
        clone4.translateZ(4200);
        clone4.scale.set(10,10,10);
        scene.add(clone4);
        clone5.translateX(4150);
        clone5.translateZ(4500);
        clone5.scale.set(10,10,10);
        scene.add(clone5);
        clone6.translateX(4230);
        clone6.translateZ(4480);
        clone6.scale.set(10,10,10);
        scene.add(clone6);
        clone7.translateX(4340);
        clone7.translateZ(4370);
        clone7.scale.set(10,10,10);
        scene.add(clone7);
    }); 
    
    
    gltfLoader.load('/Models/Vovo-Willow/vovo-willow.gltf', (gltf) => { //cria vovó willow
        var root = gltf.scene;
        root.scale.set(8,8,8);
        root.translateX(4170);
        root.translateY(20);
        root.translateZ(4246);
        scene.add(root);
    }); 

    //PAÍS DAS MARAVILHAS
    
    fbxLoader.load('/Models/wonderland/wonderland.fbx', (root) => { //cria país das maravilhas e rei de copas
        root.children[2].visible = false;
        
        //ajuda a colocar objeto de escala muito grande no mapa
        const box = new THREE.Box3().setFromObject( root );
		const center = box.getCenter( new THREE.Vector3() );
		root.position.x += ( root.position.x - center.x );
		root.position.y += ( root.position.y - center.y );
		root.position.z += ( root.position.z - center.z );
		root.translateX(28000);
		root.translateY(-15082);
		root.translateZ(-32500);
        
        root.translateX(3200);
		root.translateZ(3050);
		root.scale.set(0.06,0.06,0.06);

		scene.add( root );
    }); 
    
    
    //A CASA DO MICKEY
    
    mtlLoader.load('/Models/mickey-clubhouse/mickey-clubhouse.mtl', (mtl) => { //cria a casa do mickey
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/mickey-clubhouse/mickey-clubhouse.obj', (root) => {
            root.translateX(-300);
            root.translateY(0.1);
            root.translateZ(1600);
            root.scale.set(8,8,8);
            scene.add(root);
        });  
    });
    
    //HALLOWEEN TOWN
    
    gltfLoader.load('/Models/forest-halloween-town/forest-halloween-town.gltf', (gltf) => { //cria a floresta de halloween town
        var root = gltf.scene;
        root.scale.set(8,8,8);
        root.translateX(2200);
        root.translateY(4);
        root.translateZ(4200);
        scene.add(root);
    }); 
    
    colladaloader.load( 'Models/jacks-house/jacks-house.dae', function ( collada ) { //cria casa do jack
		var root = collada.scene;
        root.scale.set(10,10,10)
        root.translateX(1100);
        root.translateY(30);
        root.translateZ(4200);
        root.rotateY(degToRad(-90));
        root.children[0].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false;
            }
        });
        scene.add( root );
    } );
    
    
    //CASTELOS DOS SONHOS
    
    gltfLoader.load('/Models/castelo-cinderela/castelo-cinderela.gltf', (gltf) => { //cria castelo da cinderela
        var root = gltf.scene;
        root.scale.set(0.4,0.4,0.4);
        root.children[0].children[0].children[0].children[3].visible = false; //apaga mesh indesejada
        root.translateX(-1000);
        root.translateY(-150);
        root.translateZ(3050);
        scene.add(root);
    }); 
    
    gltfLoader.load('/Models/carruagem-cinderela/carruagem-cinderela.gltf', (gltf) => { //cria carruagem da cinderela
        var root = gltf.scene;
        root.scale.set(10,10,10);
        root.translateX(-400);
        root.translateZ(3870);
        root.rotateY(degToRad(180));
        scene.add(root);
    }); 
    
    //DOMINAÇÃO ENCANTADA
    
    
    gltfLoader.load('/Models/sleeping-beauty-castle/model.gltf', (gltf) => { //cria o castelo da bela adormecida
        var root = gltf.scene;
        root.translateX(-3790);
        root.translateZ(3750);
        root.rotateY(degToRad(120));
        root.scale.set(70,70,70);
        scene.add(root);
    }); 
    
    
    //KOKAUA
    
    fbxLoader.load('/Models/Ilha/ilha.fbx', (root) => { //cria ilha de kokaua
        root.translateX(-4500);
        root.translateY(12);
        root.translateZ(1100);
        root.scale.set(0.5,0.5,0.5);
        scene.add(root);
    }); 
    
   
    
    
    //PERSONAGENS
    
    
    //PERSONAGENS AGRABAH
    
	colladaloader.load( 'Models/Aladdin/Aladdin.dae', function ( collada ) { //cria aladdin
	    var aladdin = collada.scene;
        aladdin.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); //computa vetores normais
            }
        } );
        aladdin.scale.set(5,5,5);
        aladdin.translateY(6.5);
        aladdin.translateZ(-500);
        aladdin.children[0].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false; 
            }
        });
        const mixer = new THREE.AnimationMixer(aladdin);
        const idle = mixer.clipAction(aladdin.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixer.name="aladdin";
        mixers.push(mixer);
        scene.add(aladdin);

    } ); 
    
    colladaloader.load( 'Models/Genie/genie.dae', function ( collada ) { //cria o genio
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.04,0.04,0.04);
        root.translateX(2330);
        root.translateY(37);
        root.translateZ(-1400);
        root.children[0].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false; 
            }
        })
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } ); 
    
    colladaloader.load( 'Models/jasmine/jasmine.dae', function ( collada ) { //cria a jasmim
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateY(6.5);
        root.translateZ(-2500);
        root.rotateY(180);
        root.children[0].children.forEach(child => {
            if (child.type == "LineSegments") {
                child.visible = false; 
            }
        })
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    fbxLoader.load('/Models/Rajah/rajah.fbx', (root) => { //cria o Rajah
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[3]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        root.translateX(-50);
        root.translateY(6.5);
        root.translateZ(-2550);
        root.rotateX(degToRad(-90));
        root.scale.set(0.08,0.08,0.08);
        scene.add(root);
    }); 
    
    fbxLoader.load('/Models/Jafar/jafar.fbx', (root) => { //cria o Jafar
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[3]); 
        idle.clampWhenFinished = true;
        idle.loop = THREE.LoopPingPong
        idle.play();
        mixers.push(mixer);
        root.translateX(-2500);
        root.translateZ(-2700);
        root.rotateY(degToRad(180));
        root.scale.set(7,7,7);
        scene.add(root);
    }); 
    
    
    //PERSONAGENS MONTANHA PELADA
    

    fbxLoader.load('/Models/Chernabog/chernabog.fbx', (root) => {
        const mixer = new THREE.AnimationMixer(root); 
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.children[2].visible=false; //conserta problema de iluminação do modelo
        const idle = mixer.clipAction(root.animations[0]); 
        idle.setLoop(THREE.LoopPingPong);
        idle.setDuration(10);
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        root.translateX(1500);
        root.translateY(820);
        root.translateZ(1880);
        root.scale.set(0.01,0.01,0.01);
        root.rotateX(degToRad(-90));
        root.rotateZ(degToRad(180));
        scene.add(root);
    }); 
    
    
    fbxLoader.load('/Models/Ghosts/ghost1.fbx', (root) => {//cria fantasma comum
        var mixer = new THREE.AnimationMixer(root); 
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.children[2].visible=false;
        root.scale.set(0.005,0.005,0.005);
        var clone1 = cloneFbx(root);
        var clone2 = cloneFbx(root);
        var clone3 = cloneFbx(root);
        var clone4 = cloneFbx(root);
        var clone5 = cloneFbx(root);
        var clone6 = cloneFbx(root);
        root.translateX(520);
        root.translateY(20);
        root.translateZ(1680);
        root.rotateY(90);
        var idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);
        
        mixer = new THREE.AnimationMixer(clone1); 
        clone1.translateX(620);
        clone1.translateY(20);
        clone1.translateZ(1580);
        clone1.rotateY(90);
        idle = mixer.clipAction(clone1.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone1);
        
        mixer = new THREE.AnimationMixer(clone2); 
        clone2.translateX(1500);
        clone2.translateY(820);
        clone2.translateZ(1780);
        idle = mixer.clipAction(clone2.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone2);
        
        mixer = new THREE.AnimationMixer(clone3); 
        clone3.translateX(1600);
        clone3.translateY(820);
        clone3.translateZ(1880);
        clone3.rotateY(degToRad(-90));
        idle = mixer.clipAction(clone3.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone3);
    
        mixer = new THREE.AnimationMixer(clone4); 
        clone4.translateX(1400);
        clone4.translateY(820);
        clone4.translateZ(1880);
        clone4.rotateY(degToRad(90));
        idle = mixer.clipAction(clone4.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone4);
        
        mixer = new THREE.AnimationMixer(clone5); 
        clone5.translateX(900);
        clone5.translateZ(1200);
        clone5.rotateY(degToRad(45));
        idle = mixer.clipAction(clone5.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone5);
        
        mixer = new THREE.AnimationMixer(clone6); 
        clone6.translateX(770);
        clone6.translateY(30);
        clone6.translateZ(1130);
        clone6.rotateY(degToRad(45));
        idle = mixer.clipAction(clone5.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(clone6);
    });
        
    gltfLoader.load('/Models/Ghosts/ghost2.gltf', (gltf) => { //cria fantasma das espadas
        var root = gltf.scene;
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(gltf.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        root.scale.set(0.3,0.3,0.3);
        root.translateX(570);
        root.translateY(20);
        root.translateZ(1640);
        root.rotateY(90);
        scene.add(root);
    }); 

    
    fbxLoader.load('/Models/Ghosts/ghost3.fbx', (root) => { //cria a fantasma encapuzado
        const mixer = new THREE.AnimationMixer(root); 
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        root.translateX(800);
        root.translateZ(1100);
        root.rotateY(degToRad(15));
        root.scale.set(0.06,0.06,0.06);
        scene.add(root);
    }); 
    
    //PERSONAGENS TERRA INDÍGENA
    
    fbxLoader.load('/Models/Pocahontas/pocahontas.fbx', (root) => { //cria pocahontas
        const mixer = new THREE.AnimationMixer(root); 
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixer.name="pocahontas";
        mixers.push(mixer);
        root.translateX(4200);
        root.translateZ(4000);
        root.rotateY(degToRad(90));
        root.scale.set(0.65,0.65,0.65);
        scene.add(root);
    }); 
    
    //PERSONAGENS PAÍS DAS MARAVILHAS
    
    colladaloader.load( 'Models/Alice/alice.dae', function ( collada ) { //cria a alice
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.09,0.09,0.09);
        root.translateX(3287);
        root.translateY(0.5);
        root.translateZ(1732);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/cheshire-cat/cheshire-cat.dae', function ( collada ) { //cria o mestre gato
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(3781);
        root.translateY(38);
        root.translateZ(2363);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/queen-of-hearts/queen-of-hearts.dae', function ( collada ) { //cria a rainha de copas
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(3529);
        root.translateY(114);
        root.translateZ(2567);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/white-rabbit/white-rabbit.dae', function ( collada ) { //cria o coelho branco
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(2776);
        root.translateY(0.5);
        root.translateZ(2596);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    
    //PERSONAGENS A CASA DO MICKEY
    
    colladaloader.load( 'Models/Mickey/mickey.dae', function ( collada ) { //cria o mickey
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(5,5,5);
        root.translateX(-270);
        root.translateZ(1500);
        root.rotateY(degToRad(180));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Minnie/minnie.dae', function ( collada ) { //cria a minnie
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.1,0.1,0.1);
        root.translateX(-395);
        root.translateZ(1665);
        root.rotateY(degToRad(-15));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Donald/donald.dae', function ( collada ) { //cria o donald
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(5,5,5);
        root.translateX(-350);
        root.translateY(2);
        root.translateZ(1640);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } ); 
    
    colladaloader.load( 'Models/Daisy/daisy.dae', function ( collada ) { //cria a margarida
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.1,0.1,0.1);
        root.translateX(-173);
        root.translateZ(1646);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } ); 
    
    colladaloader.load( 'Models/Goofy/goofy.dae', function ( collada ) { //cria o pateta
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(7,7,7);
        root.translateX(-230);
        root.translateZ(1543);
        root.rotateY(degToRad(180));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    mtlLoader.load('/Models/Pluto/pluto.mtl', (mtl) => {  //cria o pluto
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/Pluto/pluto.obj', (root) => {
            root.translateX(-370);
            root.translateY(4);
            root.translateZ(1565);
            root.rotateY(degToRad(-90));
            root.scale.set(6,6,6);
            scene.add(root);
        });  
    });
    
    
    //PERSONAGENS HALLOWEEN TOWN
    
    colladaloader.load( 'Models/Jack/jack.dae', function ( collada ) { //cria Jack Skellington
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(2215);
        root.translateY(3);
        root.translateZ(4200);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    mtlLoader.load('/Models/Zero/Zero.mtl', (mtl) => {  //cria o zero
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('/Models/Zero/Zero.obj', (root) => {
            root.translateX(2200);
            root.translateY(8);
            root.translateZ(4180);
            root.rotateY(degToRad(90));
            root.scale.set(0.1,0.1,0.1);
            scene.add(root);
        });  
    });
    
    colladaloader.load( 'Models/oogie-boogie/oogie-boogie.dae', function ( collada ) { //cria o Monstro Verde
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(1420);
        root.translateZ(4205);
        root.rotateY(degToRad(-90));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    colladaloader.load( 'Models/Sally/sally.dae', function ( collada ) { //cria a Sally
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(1000);
        root.translateZ(4205);
        root.rotateY(degToRad(-90));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.loop = THREE.LoopPingPong;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    //PERSONAGENS CASTELO DOS SONHOS
    
    colladaloader.load( 'Models/Cinderela/cinderela.dae', function ( collada ) { //cria a Aurora
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.1,0.1,0.1);
        root.translateX(-987);
        root.translateY(585);
        root.translateZ(4015);
        root.rotateY(degToRad(-195));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    //PERSONAGENS DOMINAÇÃO ENCANTADA
    
    colladaloader.load( 'Models/Aurora/aurora.dae', function ( collada ) { //cria a Aurora
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.3,0.3,0.3);
        root.translateX(-3815);
        root.translateY(59);
        root.translateZ(3294);
        root.rotateY(degToRad(180));
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Flora/flora.dae', function ( collada ) { //cria a flora
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(-3631);
        root.translateY(400);
        root.translateZ(3365);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        mixer.name="flora";
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Fauna/fauna.dae', function ( collada ) { //cria a fauna
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(-3681);
        root.translateY(350);
        root.translateZ(3355);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        mixer.name="fauna";
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Primavera/primavera.dae', function ( collada ) { //cria a Primavera
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(-3701);
        root.translateY(300);
        root.translateZ(3345);
        root.rotateY(degToRad(90));
        const mixer = new THREE.AnimationMixer(root); 
        mixer.name="primavera";
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    //KOKAUA
    
    colladaloader.load( 'Models/Lilo/lilo.dae', function ( collada ) { //cria a Lilo
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.01,0.01,0.01);
        root.translateX(-3721);
        root.translateY(13.5);
        root.translateZ(1476);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Stitch/stitch.dae', function ( collada ) { //cria o Stitch
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.003,0.003,0.003);
        root.translateX(-3741);
        root.translateY(15);
        root.translateZ(1476);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } ); 
    
    colladaloader.load( 'Models/Angel/angel.dae', function ( collada ) { //cria a Anjinha
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.07,0.07,0.07);
        root.translateX(-3761);
        root.translateY(15);
        root.translateZ(1466);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Cobra/cobra.dae', function ( collada ) { //cria o Cobra Bubbles
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.008,0.008,0.008);
        root.translateX(-3821);
        root.translateY(15);
        root.translateZ(1406);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    fbxLoader.load( 'Models/Gantu/gantu.fbx', function ( root ) { //cria o Gantu
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        
        root.children[0].visible = false;
        root.scale.set(0.008,0.008,0.008);
        root.translateX(-3751);
        root.translateY(26);
        root.translateZ(1056);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    fbxLoader.load( 'Models/Jumba/jumba.fbx', function ( root ) { //cria o Jumba
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        
        root.children[0].visible = false;
        root.scale.set(0.008,0.008,0.008);
        root.translateX(-3751);
        root.translateY(15);
        root.translateZ(1456);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    fbxLoader.load( 'Models/Pleakley/pleakley.fbx', function ( root ) { //cria o Pleakley
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );        
        root.scale.set(0.01,0.01,0.01);
        root.translateX(-3738);
        root.translateY(15);
        root.translateZ(1446);
        root.rotateY(degToRad(-15));
        scene.add(root);

    } );
    
    colladaloader.load( 'Models/Nani/nani.dae', function ( collada ) { //cria a Nani
	    var root = collada.scene;
        root.traverse( function ( node ) {
            if ( node.isSkinnedMesh ) {
                node.geometry.computeVertexNormals(); 
            }
        } );
        root.scale.set(0.008,0.008,0.008);
        root.translateX(-3980);
        root.translateY(15);
        root.translateZ(1206);
        const mixer = new THREE.AnimationMixer(root); 
        const idle = mixer.clipAction(root.animations[0]); 
        idle.clampWhenFinished = true;
        idle.loop = THREE.LoopPingPong;
        idle.play();
        mixers.push(mixer);
        scene.add(root);

    } );
    
    
    //TERRENOS
    
    geometry = new THREE.PlaneGeometry(50,50 );
    material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("/Models/Grass/Ground2.jpg"), side: THREE.DoubleSide}); //textura deserto
    plane = new THREE.Mesh( geometry, material );
    plane.translateX((quant*-50));
    plane.translateZ(quant*-50);
    plane.rotateX(degToRad(90));
    scene.add( plane );
    var quantchao = 100;
    criaVizinhosDeserto(plane, scene, quantchao,-1,-1);
    criaVizinhosDeserto(plane, scene, quantchao,1,-1);
    
    geometry = new THREE.PlaneGeometry(50,50 );
    material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("/Models/Grass/Ground.jpg"), side: THREE.DoubleSide}); //textura grama
    plane = new THREE.Mesh( geometry, material );
    plane.translateX((quant*-50));
    plane.translateZ((quant*-50)+50);
    plane.rotateX(degToRad(90));
    scene.add( plane );
    criaVizinhosCampo(plane, scene, quantchao,-1,1);
    criaVizinhosCampo(plane, scene, quantchao,1,1);
}
  
    
 function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }    
    
    camera.rotateX(degToRad(10));

function render() {

    const fontloader = new THREE.FontLoader(); //carregador de fonte
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    
    //CONTROLE DE CAMERA
    
    
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 65) { //anda com w s a d
            camera.translateX(-0.01);
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) { //cria nome da área

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
        }
        if(event.keyCode == 68) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.translateX(0.01);
        }
        if(event.keyCode == 87) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.translateZ(-0.01);
        }
        if(event.keyCode == 83) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.translateZ(0.01);
        }
        if(event.keyCode == 37) { //rota com direcionais
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.rotateY(degToRad(0.001));
            camerarotationy = camerarotationy + 0.001;
            if(camerarotationy>=360){
                camerarotationy = camerarotationy - 360; 
            }
        }
        if(event.keyCode == 39) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.rotateY(degToRad(-0.001));
            camerarotationy = camerarotationy - 0.001;
            if(camerarotationy<0){
                camerarotationy = 360 - camerarotationy; 
            }
        }
        if(event.keyCode == 38) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.rotateX(degToRad(0.001));
        }
        if(event.keyCode == 40) {
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.rotateX(degToRad(-0.001));
        }
        if(event.keyCode == 70) { //reseta camera
            if(flagsom==-1){
                fontloader.load( 'Fonts/forest.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
                flagsom=0;
                audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
            camera.rotation.y = degToRad(0);
            if(camerarotationy>90 && camerarotationy<270){ 
                        camerarotationy = 180;
           }
            else{
                camerarotationy=0;
            }
        }
    });
    
    
    //CONTROLE DE CÉU
    
    
    
    if(flagceu==0){ //troca para céu noturno
        if((camera.position.x<=-1500 && camera.position.x>=-5000 && camera.position.z<=-500 && camera.position.z>=-5000) /*agrabah*/ || (camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600)/*montanha pelada*/ || (camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900)/*halloween town*/){
            flagceu=1;
            light1.intensity = 0.5;
            light2.intensity = 0.5;
            sphere.material.map = new THREE.TextureLoader().load( "/Textures/skycube_1/sky2.jpg" );
            sphere.material.map.needsUpdate=true;
        }
    }
    if(flagceu==1){ //troca para céu diurno
        if((camera.position.x>-1500 || camera.position.x<-5000 || camera.position.z>-500 || camera.position.z<-5000) /*agrabah*/ && (camera.position.x<50 || camera.position.x>2617 || camera.position.z<600 || camera.position.z>3600)/*montanha pelada*/ && (camera.position.x<-50 || camera.position.x>=4000 || camera.position.z<=3600 || camera.position.z>4900)/*halloween town*/){
            flagceu=0;
            light1.intensity = 1;
            light2.intensity = 1;
            sphere.material.map = new THREE.TextureLoader().load( "/Textures/skycube_1/sky.jpg" );
            sphere.material.map.needsUpdate=true;
        }
    }
    
    
    
    //SOM E NOME DE CENÁRIO
    
    
    
    if(flagsom==0){ 
        if(camera.position.x>=-5000 && camera.position.x<=5000 && camera.position.z<-250 && camera.position.z>=-5000){ //troca para musica de agrabah e cria nome na tela
            flagsom=1;
            sound.stop();
            audioLoader.load( 'Sounds/agrabah.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/agrabah.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Agrabah', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffed90 }), new THREE.MeshBasicMaterial({color: 0xfef2b1 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        if(camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600){ //troca para musica da montanha pelada e cria nome na tela
            flagsom=2;
            sound.stop();
            audioLoader.load( 'Sounds/montanha-pelada.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/montanha-pelada.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Montanha Pelada', {
                        font: font,
                        size: 6,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x0c1624 }), new THREE.MeshBasicMaterial({color: 0x122136 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        if(camera.position.x>4000 && camera.position.x<=4800 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica da Terra indigena e cria nome na tela
            flagsom=3;
            sound.stop();
            audioLoader.load( 'Sounds/terra-indigena.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/terra-indigena.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Terra Indigena', {
                        font: font,
                        size: 8,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xec5f00 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x>2617 && camera.position.x<=4800 && camera.position.z>=-250 && camera.position.z<=3600){ //troca para musica do País das Maravilhas e cria nome na tela
            flagsom=4;
            sound.stop();
            audioLoader.load( 'Sounds/wonderland.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/wonderland.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'País das Maravilhas', {
                        font: font,
                        size: 10,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xdcb800 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>=600 && camera.position.z<=2500){ //troca para musica a casa do mickey e cria nome na tela
            flagsom=5;
            sound.stop();
            audioLoader.load( 'Sounds/mickey-clubhouse.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/mickey-clubhouse.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'A Casa do Mickey', {
                        font: font,
                        size: 9,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xffffff })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
            flagsom=6;
            sound.stop();
            audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Halloween Town', {
                        font: font,
                        size: 9,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica castelos dos sonhos e cria nome na tela
            flagsom=7;
            sound.stop();
            audioLoader.load( 'Sounds/castelo-dos-sonhos.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/castelo-dos-sonhos.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Castelos dos Sonhos', {
                        font: font,
                        size: 9,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x4ac6ec })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica dominação encantada e cria nome na tela
            flagsom=8;
            sound.stop();
            audioLoader.load( 'Sounds/dominacao-encantada.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/dominacao-encantada.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Dominação Encantada', {
                        font: font,
                        size: 8,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd700 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
        if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>-250 && camera.position.z<=2500){ //troca para musica Kokaua e cria nome na tela
            flagsom=9;
            sound.stop();
            audioLoader.load( 'Sounds/kokaua.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 1 );
                sound.play();
            });
            fontloader.load( 'Fonts/kokaua.json', function ( font ) {

                    const geometry = new THREE.TextGeometry( 'Kokaua', {
                        font: font,
                        size: 8,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xff0000 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-60);
                    textMesh.translateZ(-100);
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
        }
        
    }

    
    if(flagsom!=0 && flagsom>0){ //troca para musica da floresta e e cria nome na tela
        if((camera.position.x<-5000 || camera.position.x>5000 || camera.position.z>-250 || camera.position.z<-5000) /*agrabah*/ && (camera.position.x<50 || camera.position.x>2617 || camera.position.z<600 || camera.position.z>3600)/*montanha pelada*/ && (camera.position.x<=4000 || camera.position.x>=4800 || camera.position.z<=3600 || camera.position.z>4900)/*terra indigena*/ && (camera.position.x<=2617 || camera.position.x>4800 || camera.position.z<-250 || camera.position.z>3600)/*país das maravilhas*/ && (camera.position.x<-2000 || camera.position.x>=50 || camera.position.z<600 || camera.position.z>2500)/*a casa do mickey*/ && (camera.position.x<50 || camera.position.x>=4000 || camera.position.z<=3600 || camera.position.z>4900)/*halloween town*/ && (camera.position.x<-2000 || camera.position.x>=50 || camera.position.z<=2500 || camera.position.z>4900)/*castelos dos sonhos*/ &&
          (camera.position.x>=-2000 || camera.position.x<=-5700 || camera.position.z<=2500 || camera.position.z>4900)/*dominação encantada*/ &&(camera.position.x>=-2000 || camera.position.x<=-5700 || camera.position.z<=-250 || camera.position.z>2500)/*kokaua*/ ){
            fontloader.load( 'Fonts/forest.json', function ( font ) { //cria nome da área

                    const geometry = new THREE.TextGeometry( 'Floresta', {
                        font: font,
                        size: 20,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: false,
                    } );

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x32230f }), new THREE.MeshBasicMaterial({color: 0x4b3516 })]);
                    textMesh.position.x = camera.position.x;
                    textMesh.position.y = camera.position.y;
                    textMesh.position.z = camera.position.z;
                    textMesh.rotation.x = camera.rotation.x;
                    textMesh.rotation.y = camera.rotation.y;
                    textMesh.translateX(-40);
                    textMesh.translateZ(-100);
                    
                    if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                        textMesh.rotateX(degToRad(180));
                        textMesh.rotateY(degToRad(180));
                        textMesh.translateX(-80);
                    }
                    scene.add(textMesh);
                    setTimeout(function () {
                        scene.remove(textMesh);
                    }, 4000);
                } );
            flagsom=0;
            sound.stop();
            audioLoader.load( 'Sounds/ambient.mp3', function( buffer ) { //toca musica
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 0.3 );
                sound.play();
            });
        }
        else {
            if(flagsom==1){//confere se atravessou algumas das fronteiras de agrabah
                if(camera.position.x>2617 && camera.position.x<=4800 && camera.position.z>=-250 && camera.position.z<=3600){ //troca para musica do País das Maravilhas e cria nome na tela 
                        flagsom=4;
                        sound.stop();
                        audioLoader.load( 'Sounds/wonderland.mp3', function( buffer ) {
                            sound.setBuffer( buffer );
                            sound.setLoop( true );
                            sound.setVolume( 1 );
                            sound.play();
                        });
                        fontloader.load( 'Fonts/wonderland.json', function ( font ) {

                                const geometry = new THREE.TextGeometry( 'País das Maravilhas', {
                                    font: font,
                                    size: 10,
                                    height: 5,
                                    curveSegments: 12,
                                    bevelEnabled: false,
                                } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xdcb800 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>-250 && camera.position.z<=2500){ //troca para musica Kokaua e cria nome na tela
                    flagsom=9;
                    sound.stop();
                    audioLoader.load( 'Sounds/kokaua.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/kokaua.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Kokaua', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xff0000 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-60);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
            }
            if(flagsom==2){//confere se atravessou algumas das fronteiras da montanha pelada
                   if(camera.position.x>2617 && camera.position.x<=4800 && camera.position.z>=-250 && camera.position.z<=3600){ //troca para musica do País das Maravilhas e cria nome na tela 
                        flagsom=4;
                        sound.stop();
                        audioLoader.load( 'Sounds/wonderland.mp3', function( buffer ) {
                            sound.setBuffer( buffer );
                            sound.setLoop( true );
                            sound.setVolume( 1 );
                            sound.play();
                        });
                        fontloader.load( 'Fonts/wonderland.json', function ( font ) {

                                const geometry = new THREE.TextGeometry( 'País das Maravilhas', {
                                    font: font,
                                    size: 10,
                                    height: 5,
                                    curveSegments: 12,
                                    bevelEnabled: false,
                                } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xdcb800 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>=600 && camera.position.z<=2500){ //troca para musica a casa do mickey e cria nome na tela
                    flagsom=5;
                    sound.stop();
                    audioLoader.load( 'Sounds/mickey-clubhouse.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/mickey-clubhouse.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'A Casa do Mickey', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xffffff })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
                    flagsom=6;
                    sound.stop();
                    audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Halloween Town', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica castelos dos sonhos e cria nome na tela
                    flagsom=7;
                    sound.stop();
                    audioLoader.load( 'Sounds/castelo-dos-sonhos.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/castelo-dos-sonhos.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Castelos dos Sonhos', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x4ac6ec })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
            }
            
            if(flagsom==3){//confere se atravessou algumas das fronteiras da terra indigena
                   if(camera.position.x>2617 && camera.position.x<=4800 && camera.position.z>=-250 && camera.position.z<=3600){ //troca para musica do País das Maravilhas e cria nome na tela 
                        flagsom=4;
                        sound.stop();
                        audioLoader.load( 'Sounds/wonderland.mp3', function( buffer ) {
                            sound.setBuffer( buffer );
                            sound.setLoop( true );
                            sound.setVolume( 1 );
                            sound.play();
                        });
                        fontloader.load( 'Fonts/wonderland.json', function ( font ) {

                                const geometry = new THREE.TextGeometry( 'País das Maravilhas', {
                                    font: font,
                                    size: 10,
                                    height: 5,
                                    curveSegments: 12,
                                    bevelEnabled: false,
                                } );

                         const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xdcb800 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
                    flagsom=6;
                    sound.stop();
                    audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Halloween Town', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
            }
            
            if(flagsom==4){//confere se atravessou algumas das fronteiras do país das maravilhas
                if(camera.position.x>=-5000 && camera.position.x<=5000 && camera.position.z<-250 && camera.position.z>=-5000){ //troca para musica de agrabah e cria nome na tela
                flagsom=1;
                sound.stop();
                audioLoader.load( 'Sounds/agrabah.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 1 );
                    sound.play();
                });
                fontloader.load( 'Fonts/agrabah.json', function ( font ) {

                        const geometry = new THREE.TextGeometry( 'Agrabah', {
                            font: font,
                            size: 20,
                            height: 5,
                            curveSegments: 12,
                            bevelEnabled: false,
                        } );

                    const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffed90 }), new THREE.MeshBasicMaterial({color: 0xfef2b1 })]);
                        textMesh.position.x = camera.position.x;
                        textMesh.position.y = camera.position.y;
                        textMesh.position.z = camera.position.z;
                        textMesh.rotation.x = camera.rotation.x;
                        textMesh.rotation.y = camera.rotation.y;
                        textMesh.translateX(-40);
                        textMesh.translateZ(-100);
                        if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                            textMesh.rotateX(degToRad(180));
                            textMesh.rotateY(degToRad(180));
                            textMesh.translateX(-80);
                        }
                        scene.add(textMesh);
                        setTimeout(function () {
                            scene.remove(textMesh);
                        }, 4000);
                    } );
            }
                if(camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600){ //troca para musica da montanha pelada e cria nome na tela
                    flagsom=2;
                    sound.stop();
                    audioLoader.load( 'Sounds/montanha-pelada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/montanha-pelada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Montanha Pelada', {
                                font: font,
                                size: 6,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x0c1624 }), new THREE.MeshBasicMaterial({color: 0x122136 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                if(camera.position.x>4000 && camera.position.x<=4800 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica da Terra indigena e cria nome na tela
                    flagsom=3;
                    sound.stop();
                    audioLoader.load( 'Sounds/terra-indigena.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/terra-indigena.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Terra Indigena', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xec5f00 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
                    flagsom=6;
                    sound.stop();
                    audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Halloween Town', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
            }
            
            if(flagsom==5){//confere se atravessou algumas das fronteiras da casa do mickey
                if(camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600){ //troca para musica da montanha pelada e cria nome na tela
                    flagsom=2;
                    sound.stop();
                    audioLoader.load( 'Sounds/montanha-pelada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/montanha-pelada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Montanha Pelada', {
                                font: font,
                                size: 6,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x0c1624 }), new THREE.MeshBasicMaterial({color: 0x122136 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica castelos dos sonhos e cria nome na tela
                    flagsom=7;
                    sound.stop();
                    audioLoader.load( 'Sounds/castelo-dos-sonhos.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/castelo-dos-sonhos.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Castelos dos Sonhos', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x4ac6ec })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica dominação encantada e cria nome na tela
                    flagsom=8;
                    sound.stop();
                    audioLoader.load( 'Sounds/dominacao-encantada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/dominacao-encantada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Dominação Encantada', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd700 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>-250 && camera.position.z<=2500){ //troca para musica Kokaua e cria nome na tela
                    flagsom=9;
                    sound.stop();
                    audioLoader.load( 'Sounds/kokaua.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/kokaua.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Kokaua', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xff0000 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-60);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
            }
            if(flagsom==6){ //confere se atravessou algumas das fronteiras de halloween town
                if(camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600){ //troca para musica da montanha pelada e cria nome na tela
                    flagsom=2;
                    sound.stop();
                    audioLoader.load( 'Sounds/montanha-pelada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/montanha-pelada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Montanha Pelada', {
                                font: font,
                                size: 6,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x0c1624 }), new THREE.MeshBasicMaterial({color: 0x122136 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                if(camera.position.x>4000 && camera.position.x<=4800 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica da Terra indigena e cria nome na tela
                    flagsom=3;
                    sound.stop();
                    audioLoader.load( 'Sounds/terra-indigena.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/terra-indigena.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Terra Indigena', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xec5f00 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }

                if(camera.position.x>2617 && camera.position.x<=4800 && camera.position.z>=-250 && camera.position.z<=3600){ //troca para musica do País das Maravilhas e cria nome na tela
                    flagsom=4;
                    sound.stop();
                    audioLoader.load( 'Sounds/wonderland.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/wonderland.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'País das Maravilhas', {
                                font: font,
                                size: 10,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xdcb800 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica castelos dos sonhos e cria nome na tela
                    flagsom=7;
                    sound.stop();
                    audioLoader.load( 'Sounds/castelo-dos-sonhos.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/castelo-dos-sonhos.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Castelos dos Sonhos', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x4ac6ec })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                
            }
            
            if(flagsom==7){  //confere se atravessou algumas das fronteiras do castelo dos sonhos
                if(camera.position.x>=50 && camera.position.x<=2617 && camera.position.z>=600 && camera.position.z<=3600){ //troca para musica da montanha pelada e cria nome na tela
                    flagsom=2;
                    sound.stop();
                    audioLoader.load( 'Sounds/montanha-pelada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/montanha-pelada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Montanha Pelada', {
                                font: font,
                                size: 6,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0x0c1624 }), new THREE.MeshBasicMaterial({color: 0x122136 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>=600 && camera.position.z<=2500){ //troca para musica a casa do mickey e cria nome na tela
                    flagsom=5;
                    sound.stop();
                    audioLoader.load( 'Sounds/mickey-clubhouse.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/mickey-clubhouse.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'A Casa do Mickey', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xffffff })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }

                if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
                    flagsom=6;
                    sound.stop();
                    audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Halloween Town', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica dominação encantada e cria nome na tela
                    flagsom=8;
                    sound.stop();
                    audioLoader.load( 'Sounds/dominacao-encantada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/dominacao-encantada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Dominação Encantada', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd700 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
            }
            
            if(flagsom==8){ //confere se atravessou algumas das fronteiras da dominação encatada
                if(camera.position.x>=50 && camera.position.x<4000 && camera.position.z>3600 && camera.position.z<=4900){ //troca para musica halloween town e cria nome na tela
                    flagsom=6;
                    sound.stop();
                    audioLoader.load( 'Sounds/halloween-town.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/halloween-town.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Halloween Town', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica castelos dos sonhos e cria nome na tela
                    flagsom=7;
                    sound.stop();
                    audioLoader.load( 'Sounds/castelo-dos-sonhos.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/castelo-dos-sonhos.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Castelos dos Sonhos', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffffff }), new THREE.MeshBasicMaterial({color: 0x4ac6ec })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>-250 && camera.position.z<=2500){ //troca para musica Kokaua e cria nome na tela
                    flagsom=9;
                    sound.stop();
                    audioLoader.load( 'Sounds/kokaua.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/kokaua.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Kokaua', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xff0000 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-60);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
            }
            
            if(flagsom==9){ //confere se atravessou algumas das fronteiras de Kokaua
                if(camera.position.x>=-5000 && camera.position.x<=5000 && camera.position.z<-250 && camera.position.z>=-5000){ //troca para musica de agrabah e cria nome na tela
                flagsom=1;
                sound.stop();
                audioLoader.load( 'Sounds/agrabah.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 1 );
                    sound.play();
                });
                fontloader.load( 'Fonts/agrabah.json', function ( font ) {

                        const geometry = new THREE.TextGeometry( 'Agrabah', {
                            font: font,
                            size: 20,
                            height: 5,
                            curveSegments: 12,
                            bevelEnabled: false,
                        } );

                    const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffed90 }), new THREE.MeshBasicMaterial({color: 0xfef2b1 })]);
                        textMesh.position.x = camera.position.x;
                        textMesh.position.y = camera.position.y;
                        textMesh.position.z = camera.position.z;
                        textMesh.rotation.x = camera.rotation.x;
                        textMesh.rotation.y = camera.rotation.y;
                        textMesh.translateX(-40);
                        textMesh.translateZ(-100);
                        if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                            textMesh.rotateX(degToRad(180));
                            textMesh.rotateY(degToRad(180));
                            textMesh.translateX(-80);
                        }
                        scene.add(textMesh);
                        setTimeout(function () {
                            scene.remove(textMesh);
                        }, 4000);
                    } );
                }
                
                if(camera.position.x>=-2000 && camera.position.x<50 && camera.position.z>=600 && camera.position.z<=2500){ //troca para musica a casa do mickey e cria nome na tela
                    flagsom=5;
                    sound.stop();
                    audioLoader.load( 'Sounds/mickey-clubhouse.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/mickey-clubhouse.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'A Casa do Mickey', {
                                font: font,
                                size: 9,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd606 }), new THREE.MeshBasicMaterial({color: 0xffffff })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
                
                if(camera.position.x<-2000 && camera.position.x>-5700 && camera.position.z>2500 && camera.position.z<=4900){ //troca para musica dominação encantada e cria nome na tela
                    flagsom=8;
                    sound.stop();
                    audioLoader.load( 'Sounds/dominacao-encantada.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( true );
                        sound.setVolume( 1 );
                        sound.play();
                    });
                    fontloader.load( 'Fonts/dominacao-encantada.json', function ( font ) {

                            const geometry = new THREE.TextGeometry( 'Dominação Encantada', {
                                font: font,
                                size: 8,
                                height: 5,
                                curveSegments: 12,
                                bevelEnabled: false,
                            } );

                        const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({color: 0xffd700 }), new THREE.MeshBasicMaterial({color: 0x000000 })]);
                            textMesh.position.x = camera.position.x;
                            textMesh.position.y = camera.position.y;
                            textMesh.position.z = camera.position.z;
                            textMesh.rotation.x = camera.rotation.x;
                            textMesh.rotation.y = camera.rotation.y;
                            textMesh.translateX(-40);
                            textMesh.translateZ(-100);
                            if(camerarotationy>90 && camerarotationy<270){ //vira se tá de cabeça para baixo e de costas
                                textMesh.rotateX(degToRad(180));
                                textMesh.rotateY(degToRad(180));
                                textMesh.translateX(-80);
                            }
                            scene.add(textMesh);
                            setTimeout(function () {
                                scene.remove(textMesh);
                            }, 4000);
                        } );
                }
            }
        }
    }
    renderer.render(scene, camera);
    var delta = clock.getDelta();
    animate(mixers,delta); //chama animação
    if(flagaladdin==1){//zera flag de animação se ativada
        flagaladdin=0;
    }
    if(flagpocahontas==1){//zera flag de animação se ativada
        flagpocahontas=0;
    }
    if(flagflora==1){//zera flag de animação se ativada
        flagflora=0;
    }
    if(flagfauna==1){//zera flag de animação se ativada
        flagfauna=0;
    }
    if(flagprimavera==1){//zera flag de animação se ativada
        flagprimavera=0;
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
main();