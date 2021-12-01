function getBox(h, w, d){
    var geometry = new THREE.BoxGeometry(h, w, d);
    // var material = new THREE.LineBasicMaterial({color: 'rgb(120, 120, 120)'});
    // var material = new THREE.PointsMaterial({color: 'rgb(120, 120, 120)'});
    var material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120)'});
    // var mesh = new THREE.Point(geometry, material);
    var mesh = new THREE.Mesh(geometry, material);
    // var mesh = new THREE.Line(geometry, material);

    mesh.castShadow = true;

    return mesh;
}

function getSphere(size){
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({color: 'rgb(255, 255, 255)'});
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getCone(rad, h, radSeg){
    var geometry = new THREE.ConeGeometry(rad, h, radSeg);
    var material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120'});
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getCylinder(radTop, radBot, h, radSeg){
    var geometry = new THREE.CylinderGeometry(radTop, radBot, h, radSeg);
    var material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120)'});
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

// Create Car
function createWheels(){
    const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
    const material = new THREE.MeshLambertMaterial({color: 0x333333});
    const wheel = new THREE.Mesh(geometry, material);

    return wheel;
}

function createCar(){
    const car = new THREE.Group();

    const backWheel = createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = createWheels();
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60, 15, 30),
        new THREE.MeshLambertMaterial({color: 0x78b14b})
    );
    main.position.y = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();
    const carBackTexture = getCarFrontTexture();
    const carRightSideTexture = getCarSideTexture();
    const carLeftSideTexture = getCarSideTexture();

    carLeftSideTexture.center = new THREE.Vector2(0.5 ,0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;

    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
        new THREE.MeshLambertMaterial({map: carFrontTexture}),
        new THREE.MeshLambertMaterial({map: carBackTexture}),
        new THREE.MeshLambertMaterial({color: 0xffffff}),
        new THREE.MeshLambertMaterial({color: 0xffffff}),
        new THREE.MeshLambertMaterial({map: carRightSideTexture}),
        new THREE.MeshLambertMaterial({map: carLeftSideTexture})
    ]);
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);

    return car;
}

function getCarFrontTexture(){
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture(){
    const canvas = document.createElement("canvas");
    canvas.widht = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}

function getPlane(size){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshStandardMaterial({color: 'rgb(100, 100, 100)', side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;

    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointlLight(0xffffff, intensity, 100);
    light.castShadow = true;

    return light;
}

function getSpotLight(intensity){
    var light = new THREE.SpotLight(0xffffff, intensity, 100);
    
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
}

function getDirectionalLight(intensity){
    var light = new THREE.DirectionalLight(0xffffff, intensity, 100);
    
    light.castShadow = true;
    light.shadow.camera.left = -40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.right = 40;
    light.shadow.camera.top = 40;

    return light;
}


function getAmbientLight(intensity){
    var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
    light.castShadow = true;

    return light;
}

function getBoxGrid(amount, separationMultiplier){
    var group = new THREE.Group();

    for (var i=0; i<amount; i++){
        var obj = getBox(1, 1, 1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        for (var j=1; j<amount; j++){
            var obj = getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount-1))/2;
    group.position.z = -(separationMultiplier * (amount-1))/2;

    return group;
}

function update(renderer, scene, camera, controls){
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}

function displayGUI(light, object){
    var gui = new dat.GUI();
    
    objFolder = gui.addFolder("Object");

    params = {
            obj: {
                name: "Cube",
                geo: "",
            },
    }
    const objColor = {
        color: 0xffffff
    }

    objFolder.add(params.obj, "name").name("Name");
    objFolder.add(params.obj, "geo", ["Cube", "Sphere", "Cone", "Cylinder", "Car"]).name("Geometry");
    objFolder.addColor(objColor, "color").name("Color").onChange(
        () => {
            object.material.color.set(objColor.color);
        }
    );

    posFolder = gui.addFolder('Position');

    posFolder.add(object.position, 'x', -100, 100).name('X-axis');
    posFolder.add(object.position, 'y', -100, 100).name('Y-axis');
    posFolder.add(object.position, 'z', -100, 100).name('Z-axis');

    rotFolder = gui.addFolder("Rotation");
    
    rotFolder.add(object.rotation, 'x', 0, Math.PI * 2).name("X-axis");
    rotFolder.add(object.rotation, 'y', 0, Math.PI * 2).name("Y-axis");
    rotFolder.add(object.rotation, 'z', 0, Math.PI * 2).name("Z-axis");
    
    lightFolder = gui.addFolder('Light');

    lightFolder.add(light, 'intensity').min(0).max(10).name("Intensity");
    lightFolder.add(light.position, 'x').min(-100).max(100).name("X-axis");
    lightFolder.add(light.position, 'y').min(-100).max(100).name("Y-axis");
    lightFolder.add(light.position, 'z').min(-100).max(100).name("Z-axis");
    const lightColor = {
        color: 0xffffff
    }
    lightFolder.addColor(lightColor, 'color').name("Light Color").onChange(
        () => {
            light.color.set(lightColor.color);
        }
    )

    gui.open();
}

function init(){
    // Create scene, box, plane, camera, renderer
    var scene = new THREE.Scene();
    var sphere = getSphere(2);
    var plane = getPlane(100);
    var car = createCar();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var enableFog = false;
    var directionalLight = getDirectionalLight(1);
    var box = getBox(20, 20, 20)
    var ambientLight = getAmbientLight(1);

    // Add white fog
    if(enableFog){
        scene.fog = new THREE.FogExp2(0xffffff, 0.1);
    }
    
    // Add box as child of plane, add plane to scene
    scene.add(box);
    directionalLight.add(sphere);
    scene.add(directionalLight);
    scene.add(plane);

    // Adjust properties 
    plane.rotation.x = Math.PI/2;
    box.position.y = box.geometry.parameters.height/2;

    // Camera properties

    // GUI
    displayGUI(directionalLight, box);
    
    // Camera position
  
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0 ,0 ,0));
    
    // Render
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(150, 150, 150)');   // '#ffffff', 'rgb(255, 255, 255)'
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);

    // Recursively update scene
    update(renderer, scene, camera, controls);

    return scene;
}

var scene = init();