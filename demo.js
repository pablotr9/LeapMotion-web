var scene, camera, renderer, mesh;
var meshFloor;
var textureloader;
var elf;

var isFullscreen = false;
var main_menu = null;
var menu_middle = 0;
var controlHandId = 0;
var controlHandActive = false;
var selectedOption = 1;
var lastSelectedOption = 0;
var fist = false;
var fingersExtended = 0;
var goneAway = false;
var mover = 1;

function setPos(num) {
	if (num <= 3 && num >= 1) {
		selectedOption = num;
	}
}

var player = { height: 3.3, speed: 0.09, turnSpeed: Math.PI * 0.02 };

function createLights() {
	scene.add( new THREE.AmbientLight( 0x6f6666 ) );
	var pointLight = new THREE.PointLight(0xfefefe);
	pointLight.position.set(0,20,20);
	scene.add(pointLight);
}

function createPatio() {
	elf = new THREE.Object3D();
	var loadingManager = new THREE.LoadingManager( function () {
		scene.add( elf );
	} );

	var loader = new THREE.ColladaLoader( loadingManager );
	loader.load( './models/patio.dae', function ( collada ) {
		collada.scene.scale.x = 0.2;
		collada.scene.scale.y = 0.2;
		collada.scene.scale.z = 0.2;
		elf = collada.scene;
	} );
}

function checkCollition(x, z) {
	var check = false;
	if (z > -8.0 && z <= 0.0) {
		if (x < 2.30 && x > -5.0) {
			check = true;
		}
	} else if (z < 22.0) {
		if (x < 13.0 && x > -13.0) {
			check = true;
		}
	}
	return true;
}

function init() {

	// Inicio de render
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.enabled = true;

	// Creacion de escena
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcce0ff );
	scene.fog = new THREE.Fog( 0xcce0ff, 50, 100 );

	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

	createLights();
	createPatio();

	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0, player.height, 0));

	document.body.appendChild(renderer.domElement);
	
	renderer.render(scene, camera);


	var controller = Leap.loop({enableGestures: true}, function(frame){
		if(frame.valid && frame.gestures.length > 0){
		  frame.gestures.forEach(function(gesture){
			  switch (gesture.type){
				case "circle":

				if(gesture.radius > 35)
					  window.location.href = "index.html"
					break;
			  }
		  });
		}
	  });

	// Movimiento de mano
	Leap.loop({ background: true }, {
		hand: function (hand) {
			console.log(camera.position)
			fingersExtended = 0;
			for (var i = 0; i < 5; i++) {
				fingersExtended += hand.fingers[i].extended;
			}
			/*
			console.log("Fingers extended " + fingersExtended);
			console.log("PALM NORMAL: " + hand.palmNormal)
			*/

			if (!fingersExtended) { fist = true; } else { fist = false; }
			//camera.position.y = player.height;

			controlHandId = hand.id;
			controlHandActive = true;
			if (fist || fingersExtended == 1) {
				if(camera.position.z > 0.5 && camera.position.z < 22){
					window.location.href = "vistaImagenes.html?habitacion=Patio";
				}

				if(camera.position.z > 22 && camera.position.z < 50){
					window.location.href = "vistaImagenes.html?habitacion=Habitacion1";
				}
			}


			if(camera.position.z > 0.5 && camera.position.z < 22){
				document.getElementById("info-message").innerHTML = "<p>Estas en el <strong>Patio</strong></p><p> Si quieres ver imágenes reales sobre el y su información, <br> <strong>cierra el puño</strong>"
			}

			if(camera.position.z > 22 && camera.position.z < 50){
				document.getElementById("info-message").innerHTML = "<p>Estas en la <strong>Habitacion 1</strong></p><p> Si quieres ver imágenes reales sobre el y su información, <br> <strong>cierra el puño</strong>"
			}
			// LEFT / RIGHT

			if (hand.palmNormal[0] < -0.7 && fingersExtended > 1) {
				camera.rotation.y += 0.03;
			} 

			if (hand.palmNormal[0] > 0.7 && fingersExtended > 1) {
				camera.rotation.y -= 0.03;
			} 

			// TOP / BOTTTOM
			//camera.position.y = player.height;
			/*
			if (hand.palmNormal[2] < -0.6 && fingersExtended > 1) {
				//camera.rotation.x -= 0.005;
				camera.rotateX(0.01)
			} 

			if (hand.palmNormal[2] > 0.7 && fingersExtended > 1) {
				//camera.rotation.x += 0.005;
				camera.rotateX(-0.01)
			} 
			*/

			if (hand.palmPosition[2] > 70  && fingersExtended > 1) {	
				//console.log(hand.palmPosition[2])	
				/*
				camera.position.x += Math.sin(camera.rotation.y) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
				*/
				if (checkCollition(camera.position.x, camera.position.z + player.speed))
					camera.translateZ(player.speed);
			}


			if (hand.palmPosition[0] < -70  && fingersExtended > 1) {
				/*
				camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
				*/
				if (checkCollition(camera.position.x - player.speed, camera.position))
					camera.translateX(-player.speed);
			}


			if (hand.palmPosition[0] > 70  && fingersExtended > 1) {
				/*
				camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
				*/
				if (checkCollition(camera.position.x + player.speed, camera.position.z))
					camera.translateX(player.speed);
			}
			
			if (hand. palmPosition[2] < -70  && fingersExtended > 1) {	
				//console.log(hand.palmPosition[2])		
				/*
				camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
				camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
				*/
				if (checkCollition(camera.position.x, camera.position.z - player.speed))
					camera.translateZ(-player.speed);
			}

			renderer.render(scene, camera);
			//console.log(controlHandId, controlHandActive);
			//console.log(hand.palmNormal, hand.palmPosition, hand.palmVelocity);
			//hand.palmPosition[0] LEFT RIGHT (x)
			//hand.palmPosition[1] UP DOWN (z)
			//hand.palmPosition[1] FORWARD BACKWARD (y)
			//console.log(hand.palmPosition[0], hand.palmPosition[1]);
		}
	})
		.use('handHold')
		.use('handEntry')
}
window.onload = init;
