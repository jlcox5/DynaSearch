// Test WebGL and Canvas3d Interface with callbacks
// For Dynasearch Implementation
// User Can edit Parameters in this section to customize scene

var ASSET_PATH = "assets/userObjects/";

var SCENE_BGCOLOR = [0.0,0.0,0.0,1.0];

var CAMERA_POSITION = [20.0,30.0,50.0],
    CAMERA_LOOKAT   = [0.0,0.0,0.0],
    CAMERA_FOV      = [],
    CAMERA_NEAR     = [],
    CAMERA_FAR      = [];

// Model In
//
//                   Filename       Position            Scale     orientation?
//
var MODEL_COUNT = 2;
var MODELS = [ "globe.dae" , "earth1", [-20.0, 0.0, 0.0] ,  [20, 20, 20],
               "globe.dae" , "earth2", [20.0, 0.0, 0.0] ,  [10, 10, 10]   ];
    



//Interface function test

function changeCameraMode(mode) {
   CAMERA_MODE = mode;
}

function addElement(el_name) {

   // Model
   var model = new c3dl.Collada();
   model.init(el_name);
   //cycle.setMaterial(mat);
   scn.addObjectToScene(model);
}

function changeMaterial(a,d,s,shine) {
      var mat = new c3dl.Material();
      mat.setAmbient(a);
      mat.setDiffuse(d);
      mat.setSpecular(s);
      mat.setShininess(shine);
      myRoom.currentSelection.setMaterial(mat);
}


function sphericalToRectangular(r,theta,phi) {
   var x, y, z;

   z = -r * Math.sin(theta) * Math.cos(phi);
   y =  r * Math.sin(theta) * Math.sin(phi);
   x =  r * Math.cos(theta);

   x =  r * Math.cos(phi) * Math.cos(theta);
   y =  r * Math.sin(phi);
   z = -r * Math.cos(phi) * Math.sin(theta);

   return [x,y,z];
}




/*    !!! DO NOT EDIT FROM HERE ONWARD !!!
 * This is the section containing the main function and initialization functions
 * based on the parameters. Should not be edited by user.
 */


//initializaion
function myWebGlInit() {
   c3dl.addMainCallBack(canvasMain, "webgl_canvas");
   preloadModels();
   c3dl.init();
}

myWebGlInit();

// Cameras
var cam;
var CAMERA_MODE = 2;

// Object Selection
var selectedObject;
var mySys;


/*
 * Initialization Functions
 */

// Lights
function initLights() {
   // Lighting
   //  - Positional
   var diffuse = new c3dl.PositionalLight();
   diffuse.setName('diffuse');
   diffuse.setPosition([20,30,50]);
   diffuse.setDiffuse([0.5,0.9,0.7,1.0]);
   diffuse.setSpecular([0.1,0.8,0.4,1.0]);
   diffuse.setOn(true);
   scn.addLight(diffuse);
   //  - Directional (Sun)
   var directional = new c3dl.DirectionalLight();
   directional.setName('dir');
   directional.setDirection([-1,-1,-1]);
   directional.setAmbient([0.0,0.1,0.1,1]);
   directional.setDiffuse([0.0,0.0,0.0,1]);
   directional.setSpecular([0.0,0.1,0.1,1]);
   directional.setOn(true);
   //scn.addLight(directional);
}

// Camera
function initCamera() {
   cam = new c3dl.FreeCamera();
   cam.setPosition(CAMERA_POSITION);
   cam.setLookAtPoint(CAMERA_LOOKAT);
   //setFieldOfView(CAMERA_FOV)
   //setNearClippingPlane(CAMERA_NEAR)
   //setFarClippingPlane(CAMERA_FAR)
   scn.setCamera(cam);
}

// Models
function initObjects() {
   var path, filename_ndx, position_ndx, scale_ndx;

   for (var i = 0; i < MODEL_COUNT; i++) {
      filename_ndx = 4 * i;
      id_ndx = 4 * i + 1;
      position_ndx = 4 * i + 2;
      scale_ndx    = 4 * i + 3;

      path = ASSET_PATH + "webgl/" + MODELS[filename_ndx];

      var model = new c3dl.Collada();
      model.init( path );
      model.setPosition( MODELS[position_ndx] );
      model.setName(     MODELS[position_ndx] )
      model.scale(       MODELS[scale_ndx]    );
      scn.addObjectToScene(model);
   }

}

function preloadModels() {
   var path, filename_ndx;

   for (i = 0; i < MODEL_COUNT; i++) {
      filename_ndx = 4 * i;
      path = ASSET_PATH + "webgl/" + MODELS[filename_ndx];
      c3dl.addModel(path);
   }
}

var mySystem = null;

function addParticleSystem() {
   //This is the new code for the particle system
  //add the particle system
  mySystem = new c3dl.ParticleSystem();
  //position it in the scene, in full view of the camera
  mySystem.setPosition([0,0,0]);
  //set the initial range of velocities possible for each particle
  mySystem.setMinVelocity([-4,-4,-4]);
  mySystem.setMaxVelocity([-2,2,2]);
  //set the range of time (in seconds) that a particle can last
  mySystem.setMinLifetime(1.5);
  mySystem.setMaxLifetime(10);
  //Set the range of colours for particles
  mySystem.setMinColor([0.8,0.4,0.4,0.5]);
  mySystem.setMaxColor([1,0.6,0.6,1]);
  //set range of sizes for particle
  mySystem.setMinSize(0.1);
  mySystem.setMaxSize(0.5);
  //specify how overlapping particles will be rendered
  mySystem.setSrcBlend(c3dl.ONE);
  mySystem.setDstBlend(c3dl.DST_ALPHA);
  //set the texture the particles will use
//psys.setTexture("flare.png");
  //Set the acceleration that will be applied to every particle
  //psys.setAcceleration([0,-5,0]);
  //Set how many particles the system will emit every second
  mySystem.setEmitRate(50);
  //Set the total number of particles available to the system
  mySystem.init(50);

  //add the particle system to the scene
  scn.addObjectToScene(mySystem);
}


/*
 * Main Function
 */
function canvasMain( canvasName ) {
alert("something");
   // Create new c3dl.Scene object
   scn = new c3dl.Scene();
   scn.setCanvasTag(canvasName);
   scn.setBackgroundColor(SCENE_BGCOLOR);
   
   // Create GL context
   renderer = new c3dl.WebGL();
   renderer.createRenderer(this);

   // Attach renderer to scene
   scn.setRenderer(renderer);

   // Lighting
   scn.setAmbientLight([0,0,0,0]);

   scn.init(canvasName);

   if ( renderer.isReady() ) {

      initObjects();
      initLights();
      initCamera();
      addParticleSystem();

      // Add callback functions
      scn.setKeyboardCallback(keyboardReleaseHandler,keyboardPressHandler);
      scn.setMouseCallback(mouseUpHandler,mouseDownHandler,mouseMotionHandler);
      scn.setPickingCallback(pickingHandler);
      scn.setUpdateCallback(updateHandler);

      // Start Scene
      scn.startScene();
   }
}


/* 
 * Callback Functions
 */
function keyboardPressHandler(event) {
   if (event.shiftKey) {
      switch (event.keyCode) {
         case 32 : // Spacebar
            break;
         
      }
   }
}

function keyboardReleaseHandler(event) {
   if (!event.shiftKey) {
      switch (event.keyCode) {
         case 67 : // [C]
            CAMERA_MODE = (CAMERA_MODE + 1) % 4;
            break;
         case 32 : // Spacebar
            break;
         
      }
   } else {

   }
}

var MOUSE_HOLD = false;
var MOUSE_PREV_COORDS = [0,0];

function xevtpos(event) {
   return 2 * (event.clientX / event.target.width) - 1;
}

function yevtpos(event) {
   return 2 * (event.clientY / event.target.height) - 1;
}


function mouseDownHandler(event) {
   if (event.which == 1) {
      MOUSE_HOLD = true;
      MOUSE_PREV_COORDS[0] = xevtpos(event);
      MOUSE_PREV_COORDS[1] = yevtpos(event);
   }
}

function mouseUpHandler(event) {
   if (event.which == 1) {
      MOUSE_HOLD = false;
   }
}

function mouseMotionHandler(event) {

   var scale = 10.0

   var x = xevtpos(event);
   var y = yevtpos(event);

   var deltaX = x - MOUSE_PREV_COORDS[0];
   var deltaY = y - MOUSE_PREV_COORDS[1];

   if (MOUSE_HOLD) {
      switch (CAMERA_MODE) {
         case 0 :
            if (selectedObject != undefined) {
               var movX = c3dl.multiplyVector(cam.getLeft(), -deltaX*scale, movX);
               var movY = c3dl.multiplyVector(cam.getUp(), -deltaY*scale, movY);
               var mov  = c3dl.addVectors(movX,movY,mov);
               var pos  = selectedObject.getPosition();
               pos  = c3dl.addVectors(pos,mov,pos);
               pos[1] = 0.0;
               selectedObject.setPosition(pos);
            }
            break;
         case 1 :
            if ( !(cam instanceof c3dl.FreeCamera) ) {
               // Save camera information
               var pos = cam.getPosition();
               var lookAt = cam.getOrbitPoint();
               // Create new camera
               cam = new c3dl.FreeCamera();
               // Load info and set camera
               cam.setPosition(pos);
               cam.setLookAtPoint(lookAt);
               scn.setCamera(cam);
            }

            var movX = c3dl.multiplyVector(cam.getLeft(), deltaX*scale, movX);
            var movY = c3dl.multiplyVector(cam.getUp(), deltaY*scale, movY);
            var mov  = c3dl.addVectors(movX,movY,mov);
            var pos  = cam.getPosition();
            pos  = c3dl.addVectors(pos,mov,pos);
            cam.setPosition(pos);
            break;
         case 2 :
            if ( !(cam instanceof c3dl.OrbitCamera) ) {
               var pos = cam.getPosition();
               //var d = c3dl.vectorLength(pos);
               cam = new c3dl.OrbitCamera();

               cam.setFarthestDistance(100);
               cam.setClosestDistance(1);
               cam.setOrbitPoint([0.0,0.0,0.0]);
               cam.setPosition(pos);

               scn.setCamera(cam);
            }
            cam.yaw(-deltaX);
            cam.pitch(deltaY);
            break;
         case 3 :
            break;
      }
   }

   MOUSE_PREV_COORDS = [x,y];

}


function pickingHandler(result) {
alert("something selected");
   //if (CAMERA_MODE != 0) return;

   var buttonUsed = result.getButtonUsed();
   var objectsPicked = result.getObjects();

   if (objectsPicked != undefined) {
      if (buttonUsed == 1) {
         // Loop through objects
         for (var i = 0; i < objectsPicked.length; i++) {
            obj = objectsPicked[i];
            //selectedObject = obj;
alert("something selected");
            //alert(obj.getName());
            return;
         }
      }
   }
}

   var r = 21.0,
       theta = 0,
       phi = 0;

function updateHandler() {

   theta += 0.02;
   phi += 0.005;
   //r += 1.0;

   var pos = sphericalToRectangular(r,theta,phi);

   mySystem.setPosition(pos);
   c3dl.normalizeVector(pos);
   mySystem.setMinVelocity(pos);
   mySystem.setMaxVelocity(pos);

   // Adjust aspect ratio according to canvas
   //cam.applyToWorld(2.0);

}

//myWebGlInit();
