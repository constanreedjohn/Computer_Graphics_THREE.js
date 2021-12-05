import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function getBox(h, w, d) {
  var geometry = new THREE.BoxGeometry(h, w, d)
  // var material = new THREE.LineBasicMaterial({color: 'rgb(120, 120, 120)'});
  // var material = new THREE.PointsMaterial({color: 'rgb(120, 120, 120)'});
  var material = new THREE.MeshPhongMaterial({ color: 'rgb(120, 120, 120)' })
  // var mesh = new THREE.Point(geometry, material);
  var mesh = new THREE.Mesh(geometry, material)
  // var mesh = new THREE.Line(geometry, material);
  mesh.name = 'Box'
  mesh.castShadow = true

  return mesh
}

function getSphere(size, lightHelper = false) {
  var geometry = new THREE.SphereGeometry(size, 24, 24)
  var material = lightHelper
    ? new THREE.MeshBasicMaterial({ color: 'rgb(255, 255, 255)' })
    : new THREE.MeshPhongMaterial({ color: 'rgb(255, 255, 255)' })
  var mesh = new THREE.Mesh(geometry, material)
  if (!lightHelper) mesh.name = 'Sphere'
  return mesh
}

function getCone(rad, h, radSeg) {
  var geometry = new THREE.ConeGeometry(rad, h, radSeg)
  var material = new THREE.MeshPhongMaterial({ color: 'rgb(120, 120, 120)' })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Cone'
  return mesh
}

function getCylinder(radTop, radBot, h, radSeg) {
  var geometry = new THREE.CylinderGeometry(radTop, radBot, h, radSeg)
  var material = new THREE.MeshPhongMaterial({ color: 'rgb(120, 120, 120)' })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Cylinder'
  return mesh
}

// Create Car
function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(12, 12, 33)
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 })
  const wheel = new THREE.Mesh(geometry, material)
  wheel.name = 'Wheel'
  return wheel
}

function createCar() {
  const car = new THREE.Group()

  const backWheel = createWheels()
  backWheel.position.y = 6
  backWheel.position.x = -18
  car.add(backWheel)

  const frontWheel = createWheels()
  frontWheel.position.y = 6
  frontWheel.position.x = 18
  car.add(frontWheel)

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0x78b14b })
  )
  main.position.y = 12
  car.add(main)

  const carFrontTexture = getCarFrontTexture()
  const carBackTexture = getCarFrontTexture()
  const carRightSideTexture = getCarSideTexture()
  const carLeftSideTexture = getCarSideTexture()

  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5)
  carLeftSideTexture.rotation = Math.PI
  carLeftSideTexture.flipY = false

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
  ])
  cabin.position.x = -6
  cabin.position.y = 25.5
  car.add(cabin)
  car.name = 'Car'
  return car
}

function getCarFrontTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 32
  const context = canvas.getContext('2d')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 64, 32)

  context.fillStyle = '#666666'
  context.fillRect(8, 8, 48, 24)

  return new THREE.CanvasTexture(canvas)
}

function getCarSideTexture() {
  const canvas = document.createElement('canvas')
  canvas.widht = 128
  canvas.height = 32
  const context = canvas.getContext('2d')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 128, 32)

  context.fillStyle = '#666666'
  context.fillRect(10, 8, 38, 24)
  context.fillRect(58, 8, 60, 24)

  return new THREE.CanvasTexture(canvas)
}

function getPlane(size) {
  var geometry = new THREE.PlaneGeometry(size, size)
  var material = new THREE.MeshStandardMaterial({
    color: 'rgb(100, 100, 100)',
    side: THREE.DoubleSide,
  })
  var mesh = new THREE.Mesh(geometry, material)

  mesh.receiveShadow = true

  return mesh
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity, 100)
  light.castShadow = true

  return light
}

function getSpotLight(intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity, 100)

  light.castShadow = true
  light.shadow.bias = 0.001
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048

  return light
}

function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity, 100)

  light.castShadow = true
  light.shadow.camera.left = -40
  light.shadow.camera.bottom = -40
  light.shadow.camera.right = 40
  light.shadow.camera.top = 40

  return light
}

function getAmbientLight(intensity) {
  var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity)

  return light
}

function getBoxGrid(amount, separationMultiplier) {
  var group = new THREE.Group()

  for (var i = 0; i < amount; i++) {
    var obj = getBox(1, 1, 1)
    obj.position.x = i * separationMultiplier
    obj.position.y = obj.geometry.parameters.height / 2
    group.add(obj)
    for (var j = 1; j < amount; j++) {
      var obj = getBox(1, 1, 1)
      obj.position.x = i * separationMultiplier
      obj.position.y = obj.geometry.parameters.height / 2
      obj.position.z = j * separationMultiplier
      group.add(obj)
    }
  }

  group.position.x = -(separationMultiplier * (amount - 1)) / 2
  group.position.z = -(separationMultiplier * (amount - 1)) / 2

  return group
}

function update(renderer, scene, camera, controls, params) {
  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls, params)
  })

  // Add animations
  var animation = params.obj.anim.type
  if (animation !== 'None') {
    var obj = scene.getObjectByName(params.obj.geo)
    var speed = params.obj.anim.speed
    if (obj) {
      switch (animation) {
        case 'Rotate':
          obj.rotation.x += speed
          obj.rotation.z += speed
          break
        case 'Bounce':
          if (!obj.animState) obj.animState = 'UP'
          if (obj.scale.x <= 1) obj.animState = 'UP'
          if (obj.scale.x >= 2) obj.animState = 'DOWN'
          speed = obj.animState === 'UP' ? speed : -speed
          obj.scale.x += speed
          obj.scale.y += speed
          obj.scale.z += speed
          break
        case 'RotateAndBounce':
          obj.rotation.x += speed
          obj.rotation.z += speed
          if (!obj.animState) obj.animState = 'UP'
          if (obj.scale.x <= 1) obj.animState = 'UP'
          if (obj.scale.x >= 2) obj.animState = 'DOWN'
          speed = obj.animState === 'UP' ? speed : -speed
          obj.scale.x += speed
          obj.scale.y += speed
          obj.scale.z += speed
          break
      }
    }
  }

  renderer.render(scene, camera)
  controls.update()
}

function displayGUI(scene, lights, params, objects, animations) {
  var gui = new dat.GUI()
  var object = objects[params.obj.geo]
  var lgt = lights[params.light.type]
  var lightHelper = getSphere(1, (lightHelper = true))
  
  lgt.add(lightHelper)
  scene.add(object)
  scene.add(lgt)

  var ambientLight = lights.Ambient
  if (params.light.ambient) {
    scene.add(ambientLight)
  }

  var animation = params.obj.anim.type

  // Object selection
  const objFolder = gui.addFolder('Object')

  const objColor = {
    color: 0xffffff,
  }

  objFolder
    .add(params.obj, 'geo', ['Box', 'Sphere', 'Cone', 'Cylinder', 'Car'])
    .name('Geometry')
    .onChange(() => {
      scene.remove(object)
      object = objects[params.obj.geo]
      scene.add(object)
    })

  // Object material

  objFolder
  .add(params.obj, 'mat', ['Solid', 'Line', 'Point'])
  .name('Material')
  .onChange(() => {
    switch (params.obj.mat) {
      case 'Line':
        scene.remove(object)
        object = objects[params.obj.geo]
        object.material = new THREE.LineBasicMaterial({color: 'rgb(120, 120, 120)'})
        var mesh = new THREE.Line(object.geometry, object.material)
        scene.add(mesh)
        break
      case 'Solid':
        scene.remove(object)
        object = objects[params.obj.geo]
        object.material = new THREE.MeshPhongMaterial({color: 'rgb(120, 120, 120)'})
        object.mesh = new THREE.Mesh(object.geometry, object.material)
        scene.add(object)
        break
      case 'Point':
        scene.remove(object)
        object = objects[params.obj.geo]
        object.material = new THREE.PointsMaterial({color: 'rgb(120, 120, 120)'})
        var mesh = new THREE.Points(object.geometry, object.material)
        scene.add(object)
        break
    }
  })

  // Object Color
  objFolder
    .addColor(objColor, 'color')
    .name('Color')
    .onChange(() => {
      object.material.color.set(objColor.color)
    })
    
  // Object anim folder
  var animFolder = objFolder.addFolder('Animation')

  animFolder
    .add(params.obj.anim, 'type', [
      'None',
      'Rotate',
      'Bounce',
      'RotateAndBounce',
    ])
    .name('Animation')
    .onChange(() => {
      if (params.obj.anim.type === 'None') animation = null
      else animation = animations[params.obj.anim.type]
    })
  animFolder.add(params.obj.anim, 'speed', 0, 0.2, 0.005).name('Speed')

  // Object position
  const posFolder = objFolder.addFolder('Position')

  posFolder
    .add(params.obj.pos, 'x', -100, 100)
    .name('X-axis')
    .onChange(() => {
      object.position.x = params.obj.pos.x
    })
  posFolder
    .add(params.obj.pos, 'y', -100, 100)
    .name('Y-axis')
    .onChange(() => {
      object.position.y = params.obj.pos.y
    })
  posFolder
    .add(params.obj.pos, 'z', -100, 100)
    .name('Z-axis')
    .onChange(() => {
      object.position.z = params.obj.pos.z
    })

  // Object Rotation
  const rotFolder = objFolder.addFolder('Rotation')

  rotFolder
    .add(params.obj.rot, 'x', -Math.PI, Math.PI)
    .name('X-axis')
    .onChange(() => {
      object.rotation.x = params.obj.rot.x
    })
  rotFolder
    .add(params.obj.rot, 'y', -Math.PI, Math.PI)
    .name('Y-axis')
    .onChange(() => {
      object.rotation.y = params.obj.rot.y
    })
  rotFolder
    .add(params.obj.rot, 'z', -Math.PI, Math.PI)
    .name('Z-axis')
    .onChange(() => {
      object.rotation.z = params.obj.rot.z
    })

  // Light selection
  const lightFolder = gui.addFolder('Light')

  lightFolder
    .add(params.light, 'ambient')
    .name('Ambient')
    .onChange(() => {
      if (params.light.ambient) {
        scene.add(ambientLight)
      } else {
        scene.remove(ambientLight)
      }
    })

  lightFolder
    .add(params.light, 'type', ['Directional', 'Spot', 'Point'])
    .name('Light Types')
    .onChange(() => {
      scene.remove(lgt)
      lgt = lights[params.light.type]
      lgt.add(lightHelper)
      scene.add(lgt)
    })

  // Light color
  const lightColor = {
    color: 0xffffff,
    ambient: 0xffffff,
  }
  lightFolder
    .addColor(lightColor, 'ambient')
    .name('Ambient Color')
    .onChange(() => {
      lgt.color.set(lightColor.ambient)
    })
  lightFolder
    .addColor(lightColor, 'color')
    .name('Light Color')
    .onChange(() => {
      lgt.color.set(lightColor.color)
    })

  // Light Intensity
  lightFolder
    .add(params.light, 'ambientIntens', 0, 10)
    .name('Ambient Intensity')
    .onChange(() => {
      ambientLight.intensity = params.light.ambientIntens
    })

  lightFolder
    .add(params.light, 'intens', 0, 10)
    .name('Intensity')
    .onChange(() => {
      lgt.intensity = params.light.intens
    })

  // Light Position
  const posLight = lightFolder.addFolder('Position')
  posLight
    .add(params.light.pos, 'x', -100, 100)
    .name('X-axis')
    .onChange(() => {
      lgt.position.x = params.light.pos.x
    })
  posLight
    .add(params.light.pos, 'y', -100, 100)
    .name('Y-axis')
    .onChange(() => {
      lgt.position.y = params.light.pos.y
    })
  posLight
    .add(params.light.pos, 'z', -100, 100)
    .name('Z-axis')
    .onChange(() => {
      lgt.position.z = params.light.pos.z
    })

  // Reset button
  objFolder.add(params.obj, 'reset')
  .name('Reset Object')
  .onChange(() => {
    if (params.obj.reset) {
    scene.remove(object)
    scene.add(object) 
    } else {
      scene.remove(object)
      object = objects[params.obj.geo]
      scene.add(object)
    }
  })
  lightFolder.add(params.light, 'reset')
  .name('Reset Lighting')
  .onChange(() => {
    if (params.light.reset) {
    scene.remove(lgt)
    scene.add(lgt) 
    } else {
      scene.remove(lgt)
      lgt = lights[params.light.type]
      scene.add(lgt)
    }
  })

  gui.open()
  return { scene, light: lights, object, animation, params }
}

function init() {
  // Initial state
  var scene = new THREE.Scene()
  var sphere = getSphere(5)
  var plane = getPlane(100)
  var car = createCar()
  var cylinder = getCylinder(5, 5, 10, 360)
  var cone = getCone(10, 10, 10)
  var box = getBox(10, 10, 10)
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  var renderer = new THREE.WebGLRenderer()
  var controls = new OrbitControls(camera, renderer.domElement)
  var enableFog = false
  var ambientLight = getAmbientLight(1)
  var spotLight = getSpotLight(1)
  var pointLight = getPointLight(1)
  var directionalLight = getDirectionalLight(1)

  // Add white fog
  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.1)
  }

  // Add stuff to scene
  // scene.add(ambientLight)
  scene.add(plane)

  // Adjust properties
  plane.rotation.x = Math.PI / 2
  box.position.y = box.geometry.parameters.height / 2
  cone.position.y = cone.geometry.parameters.height / 2
  sphere.position.y = sphere.geometry.parameters.radius
  cylinder.position.y = cylinder.geometry.parameters.height / 2

  // Light properties
  directionalLight.position.y = 20
  directionalLight.position.x = -10
  pointLight.position.y = 20
  pointLight.position.x = -10
  spotLight.position.y = 20
  spotLight.position.x = -10

  // Config to change objects
  var objects = {
    Box: box,
    Sphere: sphere,
    Cone: cone,
    Cylinder: cylinder,
    Car: car,
  }

  var lights = {
    Directional: directionalLight,
    Spot: spotLight,
    Point: pointLight,
    Ambient: ambientLight,
  }

  var animations = {
    Rotate: 'Rotate',
    Bounce: 'Bounce',
    RotateAndBounce: 'RotateAndBounce',
  }

  var params = {
    obj: {
      geo: 'Cone',
      mat: 'Solid',
      pos: {
        x: 0,
        y: 0,
        z: 0,
      },
      rot: {
        x: 0,
        y: 0,
        z: 0,
      },
      anim: {
        type: 'None',
        speed: 0.01,
      },
      reset: false,
    },
    light: {
      ambient: false,
      ambientIntens: 3,
      type: 'Spot',
      intens: 5,
      pos: {
        x: 20,
        y: 40,
        z: 0,
      },
      reset: false,
    },
  }

  // GUI
  var gui = displayGUI(scene, lights, params, objects, animations)
  scene = gui.scene
  params = gui.params

  // Camera position

  camera.position.x = 10
  camera.position.y = 30
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // Render
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('rgb(150, 150, 150)') // '#ffffff', 'rgb(255, 255, 255)'
  renderer.shadowMap.enabled = true
  document.getElementById('app').appendChild(renderer.domElement)

  // Recursively update scene
  update(renderer, scene, camera, controls, params)

  return scene
}

var scene = init()
