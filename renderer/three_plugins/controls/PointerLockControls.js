import * as THREE from 'three/build/three.module';

/**
 * @author mrdoob / http://mrdoob.com/
 */

const PointerLockControls = function (camera) {
  const scope = this;

  camera.rotation.set(0, 0, 0);

  const pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  const yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add(pitchObject);

  const PI_2 = Math.PI / 2;

  const onMouseMove = function (event) {
    if (scope.enabled === false) return;

    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };

  this.dispose = function () {
    document.removeEventListener('mousemove', onMouseMove, false);
  };

  document.addEventListener('mousemove', onMouseMove, false);

  this.enabled = false;

  this.getObject = function () {
    return yawObject;
  };

  this.getDirection = (function () {
		// assumes the camera itself is not rotated

    const direction = new THREE.Vector3(0, 0, -1);
    const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (v) {
      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

      v.copy(direction).applyEuler(rotation);

      return v;
    };
  }());
};

export default PointerLockControls;
