var scene, camera, renderer, mesh;
var meshFloor;
var cuenta = 0;

var texture;


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

var keyboard = {};
var player = { height: 1.5, speed: 0.1, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function init() {

	texture = new THREE.TextureLoader().load( "./textures/checkered.png" );
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

	
	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1.5, 1.5, 1.5),
		new THREE.MeshBasicMaterial({ color: 0x2244ff, wireframe: USE_WIREFRAME })
	);
	mesh.position.y += 1; // Move the mesh up 1 meter
	scene.add(mesh);


	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100, 100, 100),
		new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
	);
	meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
	scene.add(meshFloor);

	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0, player.height, 0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);
	document.body.appendChild(renderer.domElement);



	renderer.render(scene, camera);






	Leap.loop({ background: true }, {
		hand: function (hand) {
			

			cuenta += 1;
			fingersExtended = 0;
			for (var i = 0; i < 5; i++) {
				fingersExtended += hand.fingers[i].extended;
			}

			//console.log(fingersExtended);

			if (!fingersExtended) { fist = true; } else { fist = false; }


			controlHandId = hand.id;
			controlHandActive = true;
			if (fist || fingersExtended == 1) {
				//--
			}

			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;

			
			if (hand.palmPosition[2] > 70  && fingersExtended > 1) {	
				//console.log(hand.palmPosition[2])	
				camera.position.x += Math.sin(camera.rotation.y) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
				cuenta = 0;

			}


			if (hand.palmPosition[0] < -70  && fingersExtended > 1) {
				camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
				cuenta = 0;

			}


			if (hand.palmPosition[0] > 70  && fingersExtended > 1) {
				camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
				camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
				cuenta = 0;

			}
			
			if (hand. palmPosition[2] < -70  && fingersExtended > 1) {	
				//console.log(hand.palmPosition[2])		
				camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
				camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
				cuenta = 0;

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
