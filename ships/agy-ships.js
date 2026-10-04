// Spaceship designs for Concrete Nocturne — AGY
// Conforming to SHIP_DESIGN_SPEC.md (three.js r128 primitives only, nose -Z, Soviet retro-futurist palette)

(function () {
  'use strict';

  function createPlita74() {
    return {
      name: 'Plita-74',
      author: 'agy',
      idea: 'A blunt lifting slab manufactured from prefabricated state housing panels, riding on ground effect and three rear transom thrusters.',
      build: function (THREE, kit) {
        var group = new THREE.Group();
        var engines = [];
        var engineGlows = [];

        var addMesh = function (geo, mat, x, y, z, rx, ry, rz) {
          var m = new THREE.Mesh(geo, mat);
          m.position.set(x || 0, y || 0, z || 0);
          if (rx) m.rotation.x = rx;
          if (ry) m.rotation.y = ry;
          if (rz) m.rotation.z = rz;
          group.add(m);
          return m;
        };

        // 1. Lower Hull & Beveled Nose
        addMesh(new THREE.BoxGeometry(2.6, 0.42, 4.4), kit.mats.enamel, 0, -0.22, 0.2);
        addMesh(new THREE.BoxGeometry(2.4, 0.38, 1.4), kit.mats.dirty, 0, -0.24, -2.1);
        addMesh(new THREE.BoxGeometry(2.36, 0.12, 1.4), kit.mats.dirty, 0, 0.06, -2.1, 0.14, 0, 0);
        addMesh(new THREE.BoxGeometry(2.46, 0.22, 0.22), kit.mats.graphite, 0, -0.28, -2.8);

        // 2. Upper Superstructure & Windshield
        addMesh(new THREE.BoxGeometry(1.9, 0.52, 3.2), kit.mats.enamel, 0, 0.22, 0.3);
        addMesh(new THREE.BoxGeometry(1.88, 0.34, 0.6), kit.mats.graphite, 0, 0.26, -1.35);
        addMesh(new THREE.BoxGeometry(1.7, 0.18, 0.08), kit.mats.glass, 0, 0.26, -1.65);
        addMesh(new THREE.BoxGeometry(1.86, 0.06, 0.26), kit.mats.enamel, 0, 0.38, -1.6);

        // 3. Side Sponsons & Louvers
        for (var s = -1; s <= 1; s += 2) {
          addMesh(new THREE.BoxGeometry(0.32, 0.46, 4.2), kit.mats.dirty, s * 1.42, -0.15, 0.3);
          addMesh(new THREE.BoxGeometry(0.32, 0.44, 0.8), kit.mats.graphite, s * 1.38, -0.16, -1.9, 0, s * -0.22, 0);
          addMesh(new THREE.BoxGeometry(0.02, 0.06, 4.0), kit.mats.red, s * 1.59, 0.05, 0.3);
          for (var lz = 0.0; lz <= 1.2; lz += 0.5) {
            addMesh(new THREE.BoxGeometry(0.04, 0.04, 0.36), kit.mats.graphite, s * 1.59, -0.12, lz);
          }
        }

        // 4. Dorsal Spine & Fittings
        addMesh(new THREE.BoxGeometry(0.14, 0.02, 3.0), kit.mats.red, 0, 0.49, 0.3);
        addMesh(new THREE.BoxGeometry(0.24, 0.08, 3.2), kit.mats.graphite, 0, 0.52, 0.3);
        addMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), kit.mats.graphite, -0.6, 0.68, 0.8);
        addMesh(new THREE.BoxGeometry(0.55, 0.04, 0.75), kit.mats.grey, 0.42, 0.49, 0.6);

        // 5. Belly Plate & Skid Runners
        addMesh(new THREE.BoxGeometry(1.4, 0.08, 3.0), kit.mats.concrete, 0, -0.46, 0.1);
        addMesh(new THREE.BoxGeometry(0.18, 0.16, 4.2), kit.mats.graphite, -0.85, -0.52, 0.2);
        addMesh(new THREE.BoxGeometry(0.18, 0.16, 4.2), kit.mats.graphite, 0.85, -0.52, 0.2);

        // 6. Rear Transom & 3 Engines
        addMesh(new THREE.BoxGeometry(2.5, 0.6, 0.2), kit.mats.graphite, 0, -0.05, 2.45);
        var engineOffsets = [-0.74, 0, 0.74];
        for (var i = 0; i < engineOffsets.length; i++) {
          var ex = engineOffsets[i];
          var ey = i === 1 ? 0.04 : -0.04;
          var cowlGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.48, 16);
          cowlGeo.rotateX(Math.PI / 2);
          addMesh(cowlGeo, kit.mats.grey, ex, ey, 2.65);

          var portGeo = new THREE.CircleGeometry(0.2, 16);
          var portMesh = new THREE.Mesh(portGeo, kit.amber());
          portMesh.position.set(ex, ey, 2.9);
          group.add(portMesh);
          engines.push(portMesh);

          var glow = kit.glowSprite();
          glow.position.set(ex, ey, 3.04);
          group.add(glow);
          engineGlows.push(glow);
        }

        // 7. Hover Ring
        var ringGeo = new THREE.TorusGeometry(0.85, 0.05, 8, 32);
        ringGeo.rotateX(Math.PI / 2);
        var underRing = new THREE.Mesh(ringGeo, kit.amber());
        underRing.position.set(0, -0.54, -0.2);
        group.add(underRing);

        // 8. Headlamps & Forward SpotLight
        addMesh(new THREE.CircleGeometry(0.11, 14), kit.mats.headlamp, -0.75, -0.26, -2.92, 0, Math.PI, 0);
        addMesh(new THREE.CircleGeometry(0.11, 14), kit.mats.headlamp, 0.75, -0.26, -2.92, 0, Math.PI, 0);

        var headlamp = new THREE.SpotLight(0xfff1d6, 2.2, 90, 0.5, 0.6, 1.1);
        headlamp.position.set(0, -0.22, -2.85);
        headlamp.target.position.set(0, -1.4, -25);
        group.add(headlamp);
        group.add(headlamp.target);

        // 9. Ground Glow & UnderLight
        var groundGlow = kit.groundGlow(4.2, 6.2);
        if (groundGlow) {
          groundGlow.position.set(0, -0.65, 0);
          group.add(groundGlow);
        }

        var underLight = new THREE.PointLight(0xff9a40, 1.2, 9, 2);
        underLight.position.set(0, -0.6, 0);
        group.add(underLight);

        // 10. Trail Points (outer sponson tips)
        var trailPoints = [
          new THREE.Vector3(-1.55, -0.1, 2.45),
          new THREE.Vector3(1.55, -0.1, 2.45)
        ];

        return {
          group: group,
          engines: engines,
          engineGlows: engineGlows,
          underRing: underRing,
          groundGlow: groundGlow,
          underLight: underLight,
          headlamp: headlamp,
          trailPoints: trailPoints
        };
      }
    };
  }

  function createKoltso3() {
    return {
      name: 'Koltso-3',
      author: 'agy',
      idea: 'An annular aerostat with a central spherical observation cabin suspended inside a heavy hover ring, designed for steady night surveillance.',
      build: function (THREE, kit) {
        var group = new THREE.Group();
        var engines = [];
        var engineGlows = [];

        var addMesh = function (geo, mat, x, y, z, rx, ry, rz) {
          var m = new THREE.Mesh(geo, mat);
          m.position.set(x || 0, y || 0, z || 0);
          if (rx) m.rotation.x = rx;
          if (ry) m.rotation.y = ry;
          if (rz) m.rotation.z = rz;
          group.add(m);
          return m;
        };

        // 1. Outer Torus Ring
        var mainRingGeo = new THREE.TorusGeometry(1.85, 0.34, 16, 32);
        mainRingGeo.rotateX(Math.PI / 2);
        addMesh(mainRingGeo, kit.mats.enamel, 0, 0.05, 0);

        var rimGeo = new THREE.TorusGeometry(1.88, 0.07, 10, 32);
        rimGeo.rotateX(Math.PI / 2);
        addMesh(rimGeo, kit.mats.graphite, 0, -0.18, 0);

        // Red livery arc accents on outer ring
        var redArc1 = new THREE.TorusGeometry(2.18, 0.025, 6, 16, Math.PI * 0.4);
        redArc1.rotateX(Math.PI / 2);
        addMesh(redArc1, kit.mats.red, 0, 0.05, 0, 0, -Math.PI * 0.2, 0);
        var redArc2 = new THREE.TorusGeometry(2.18, 0.025, 6, 16, Math.PI * 0.4);
        redArc2.rotateX(Math.PI / 2);
        addMesh(redArc2, kit.mats.red, 0, 0.05, 0, 0, Math.PI * 0.8, 0);

        // 2. Central Gondola / Crew Capsule
        var gondola = addMesh(new THREE.SphereGeometry(0.85, 24, 18), kit.mats.dirty, 0, 0.15, -0.1);
        gondola.scale.set(0.9, 0.85, 0.95);

        // Panoramic visor window (curved front hemisphere sector)
        var visor = addMesh(new THREE.SphereGeometry(0.86, 20, 14, 0, Math.PI, 0, Math.PI * 0.55), kit.mats.glass, 0, 0.15, -0.12, Math.PI * 0.35, Math.PI, 0);
        visor.scale.set(0.75, 0.55, 0.85);

        // Window collar bezel
        var visorCollarGeo = new THREE.TorusGeometry(0.55, 0.035, 8, 24);
        addMesh(visorCollarGeo, kit.mats.graphite, 0, 0.12, -0.84, 0.25, 0, 0);

        // Roof avionics cap & antenna
        addMesh(new THREE.CylinderGeometry(0.32, 0.42, 0.22, 16), kit.mats.graphite, 0, 0.86, -0.1);
        addMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 8), kit.mats.grey, 0, 1.05, -0.1);

        // 3. Three Radial Connecting Pylons (120 deg apart)
        // Forward pylon (along -Z)
        addMesh(new THREE.BoxGeometry(0.28, 0.2, 1.15), kit.mats.graphite, 0, 0.08, -1.25);
        addMesh(new THREE.BoxGeometry(0.06, 0.04, 1.1), kit.mats.grey, 0, 0.2, -1.25);

        // Aft-port pylon (120 deg)
        addMesh(new THREE.BoxGeometry(0.28, 0.2, 1.15), kit.mats.graphite, -1.05, 0.08, 0.65, 0, -2.094, 0);
        addMesh(new THREE.BoxGeometry(0.06, 0.04, 1.1), kit.mats.grey, -1.05, 0.2, 0.65, 0, -2.094, 0);

        // Aft-starboard pylon (120 deg)
        addMesh(new THREE.BoxGeometry(0.28, 0.2, 1.15), kit.mats.graphite, 1.05, 0.08, 0.65, 0, 2.094, 0);
        addMesh(new THREE.BoxGeometry(0.06, 0.04, 1.1), kit.mats.grey, 1.05, 0.2, 0.65, 0, 2.094, 0);

        // 4. Auxiliary Rear Booster Nacelles (Twin Engines)
        for (var s = -1; s <= 1; s += 2) {
          var nx = s * 1.35;
          var nacelleGeo = new THREE.CylinderGeometry(0.24, 0.28, 1.25, 16);
          nacelleGeo.rotateX(Math.PI / 2);
          addMesh(nacelleGeo, kit.mats.graphite, nx, 0.06, 1.6);

          var intakeGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.2, 16);
          intakeGeo.rotateX(Math.PI / 2);
          addMesh(intakeGeo, kit.mats.dirty, nx, 0.06, 0.95);

          // Fin on top of nacelle with red tip
          addMesh(new THREE.BoxGeometry(0.04, 0.36, 0.6), kit.mats.enamel, nx, 0.42, 1.68);
          addMesh(new THREE.BoxGeometry(0.05, 0.06, 0.58), kit.mats.red, nx, 0.61, 1.68);

          // Engine port
          var portMesh = new THREE.Mesh(new THREE.CircleGeometry(0.22, 16), kit.amber());
          portMesh.position.set(nx, 0.06, 2.24);
          group.add(portMesh);
          engines.push(portMesh);

          // Glow sprite
          var glow = kit.glowSprite();
          glow.position.set(nx, 0.06, 2.38);
          group.add(glow);
          engineGlows.push(glow);
        }

        // 5. Ventral Pulsing Stator Ring
        var underRingGeo = new THREE.TorusGeometry(1.62, 0.048, 8, 36);
        underRingGeo.rotateX(Math.PI / 2);
        var underRing = new THREE.Mesh(underRingGeo, kit.amber());
        underRing.position.set(0, -0.42, 0);
        group.add(underRing);

        // 6. Forward Searchlight / Headlamp
        var lightCanGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.26, 14);
        lightCanGeo.rotateX(Math.PI / 2);
        addMesh(lightCanGeo, kit.mats.graphite, 0, -0.14, -2.18);
        addMesh(new THREE.CircleGeometry(0.15, 14), kit.mats.headlamp, 0, -0.14, -2.32, 0, Math.PI, 0);

        var headlamp = new THREE.SpotLight(0xfff1d6, 2.3, 95, 0.52, 0.6, 1.1);
        headlamp.position.set(0, -0.14, -2.3);
        headlamp.target.position.set(0, -1.4, -25);
        group.add(headlamp);
        group.add(headlamp.target);

        // 7. Ground Glow & UnderLight
        var groundGlow = kit.groundGlow(5.0, 5.0);
        if (groundGlow) {
          groundGlow.position.set(0, -0.65, 0);
          group.add(groundGlow);
        }

        var underLight = new THREE.PointLight(0xff9a40, 1.2, 10, 2);
        underLight.position.set(0, -0.5, 0);
        group.add(underLight);

        // 8. Trail Points (outer ring equator edges)
        var trailPoints = [
          new THREE.Vector3(-2.18, 0.05, 0.2),
          new THREE.Vector3(2.18, 0.05, 0.2)
        ];

        return {
          group: group,
          engines: engines,
          engineGlows: engineGlows,
          underRing: underRing,
          groundGlow: groundGlow,
          underLight: underLight,
          headlamp: headlamp,
          trailPoints: trailPoints
        };
      }
    };
  }

  function createKarkas7() {
    return {
      name: 'Karkas-7',
      author: 'agy',
      idea: 'An unclad skeletal girder frame carrying a forward observation capsule and twin outrigger engine pods, built to service high-altitude communications masts.',
      build: function (THREE, kit) {
        var group = new THREE.Group();
        var engines = [];
        var engineGlows = [];

        var addMesh = function (geo, mat, x, y, z, rx, ry, rz) {
          var m = new THREE.Mesh(geo, mat);
          m.position.set(x || 0, y || 0, z || 0);
          if (rx) m.rotation.x = rx;
          if (ry) m.rotation.y = ry;
          if (rz) m.rotation.z = rz;
          group.add(m);
          return m;
        };

        // 1. Central Backbone / Girder Spine
        addMesh(new THREE.BoxGeometry(0.34, 0.28, 4.6), kit.mats.graphite, 0, 0.15, 0.4);
        addMesh(new THREE.BoxGeometry(0.22, 0.16, 4.4), kit.mats.graphite, 0, -0.15, 0.4);

        // Vertical truss uprights
        var zStops = [-1.2, -0.4, 0.4, 1.2, 2.0];
        for (var i = 0; i < zStops.length; i++) {
          addMesh(new THREE.BoxGeometry(0.24, 0.28, 0.12), kit.mats.graphite, 0, 0.0, zStops[i]);
        }

        // 2. Forward Perched Crew Capsule
        addMesh(new THREE.SphereGeometry(0.72, 22, 16), kit.mats.enamel, 0, 0.25, -2.0);

        // Faceted forward visor
        var visorGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 16);
        visorGeo.rotateX(Math.PI / 2);
        addMesh(visorGeo, kit.mats.glass, 0, 0.26, -2.46);

        var collarGeo = new THREE.TorusGeometry(0.42, 0.035, 8, 20);
        addMesh(collarGeo, kit.mats.graphite, 0, 0.26, -2.48);

        // Side circular portholes
        addMesh(new THREE.CircleGeometry(0.12, 12), kit.mats.glass, -0.66, 0.25, -2.0, 0, -Math.PI / 2, 0);
        addMesh(new THREE.CircleGeometry(0.12, 12), kit.mats.glass, 0.66, 0.25, -2.0, 0, Math.PI / 2, 0);

        // Red livery retention band around capsule
        var capsuleBandGeo = new THREE.TorusGeometry(0.73, 0.022, 8, 24);
        addMesh(capsuleBandGeo, kit.mats.red, 0, 0.25, -2.0);

        // Cradle struts attaching pod to spine
        addMesh(new THREE.BoxGeometry(0.12, 0.12, 0.55), kit.mats.graphite, 0, 0.05, -1.5, 0.4, 0, 0);

        // 3. Spherical Propellant Flasks on Spine
        var tankPositions = [-0.4, 0.9];
        for (var t = 0; t < tankPositions.length; t++) {
          var tz = tankPositions[t];
          addMesh(new THREE.SphereGeometry(0.56, 20, 16), kit.mats.dirty, 0, 0.22, tz);
          var strapGeo = new THREE.TorusGeometry(0.58, 0.03, 8, 24);
          strapGeo.rotateX(Math.PI / 2);
          addMesh(strapGeo, kit.mats.graphite, 0, 0.22, tz);
        }
        // Red inspection marking on front tank
        var tankMarkGeo = new THREE.TorusGeometry(0.58, 0.02, 8, 20);
        addMesh(tankMarkGeo, kit.mats.red, 0, 0.22, -0.4);

        // 4. Outrigger Trusses & Twin Engine Pods
        for (var s = -1; s <= 1; s += 2) {
          var ex = s * 1.95;

          // Main horizontal outrigger truss
          addMesh(new THREE.BoxGeometry(1.65, 0.16, 0.26), kit.mats.graphite, s * 1.05, 0.22, 1.4, 0, 0, s * 0.12);
          // Diagonal strut
          addMesh(new THREE.BoxGeometry(1.7, 0.1, 0.12), kit.mats.graphite, s * 1.05, 0.06, 1.8, 0.25, 0, s * -0.15);

          // Engine nacelle
          var nacGeo = new THREE.CylinderGeometry(0.26, 0.32, 1.8, 16);
          nacGeo.rotateX(Math.PI / 2);
          addMesh(nacGeo, kit.mats.enamel, ex, 0.28, 1.9);

          // Intake cowl
          var inGeo = new THREE.CylinderGeometry(0.3, 0.26, 0.25, 16);
          inGeo.rotateX(Math.PI / 2);
          addMesh(inGeo, kit.mats.graphite, ex, 0.28, 0.95);

          // Tall vertical rudder fin with red tip
          addMesh(new THREE.BoxGeometry(0.04, 0.58, 0.8), kit.mats.dirty, ex, 0.74, 2.1);
          addMesh(new THREE.BoxGeometry(0.05, 0.08, 0.78), kit.mats.red, ex, 1.03, 2.1);

          // Engine disc
          var portMesh = new THREE.Mesh(new THREE.CircleGeometry(0.24, 16), kit.amber());
          portMesh.position.set(ex, 0.28, 2.81);
          group.add(portMesh);
          engines.push(portMesh);

          // Glow sprite
          var glow = kit.glowSprite();
          glow.position.set(ex, 0.28, 2.95);
          group.add(glow);
          engineGlows.push(glow);
        }

        // 5. Ventral Landing Skids & Pylons
        for (var s = -1; s <= 1; s += 2) {
          var kx = s * 0.75;
          var skidGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.8, 10);
          skidGeo.rotateX(Math.PI / 2);
          addMesh(skidGeo, kit.mats.graphite, kx, -0.62, 0.3);

          // Upright struts
          addMesh(new THREE.BoxGeometry(0.08, 0.48, 0.08), kit.mats.graphite, kx, -0.38, -0.8);
          addMesh(new THREE.BoxGeometry(0.08, 0.48, 0.08), kit.mats.graphite, kx, -0.38, 1.4);
        }

        // 6. Ventral Hover Ring
        var hoverRingGeo = new THREE.TorusGeometry(0.55, 0.04, 8, 28);
        hoverRingGeo.rotateX(Math.PI / 2);
        var underRing = new THREE.Mesh(hoverRingGeo, kit.amber());
        underRing.position.set(0, -0.42, 0.3);
        group.add(underRing);

        // 7. Underslung Searchlight / Headlamp
        var headCanGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.28, 14);
        headCanGeo.rotateX(Math.PI / 2);
        addMesh(headCanGeo, kit.mats.graphite, 0, -0.22, -2.1);
        addMesh(new THREE.CircleGeometry(0.14, 14), kit.mats.headlamp, 0, -0.22, -2.25, 0, Math.PI, 0);

        var headlamp = new THREE.SpotLight(0xfff1d6, 2.3, 95, 0.5, 0.6, 1.1);
        headlamp.position.set(0, -0.22, -2.25);
        headlamp.target.position.set(0, -1.4, -25);
        group.add(headlamp);
        group.add(headlamp.target);

        // 8. Ground Glow & UnderLight
        var groundGlow = kit.groundGlow(4.5, 6.0);
        if (groundGlow) {
          groundGlow.position.set(0, -0.7, 0);
          group.add(groundGlow);
        }

        var underLight = new THREE.PointLight(0xff9a40, 1.2, 9, 2);
        underLight.position.set(0, -0.55, 0.2);
        group.add(underLight);

        // 9. Trail Points (outer rudder fin tips)
        var trailPoints = [
          new THREE.Vector3(-1.95, 0.3, 2.5),
          new THREE.Vector3(1.95, 0.3, 2.5)
        ];

        return {
          group: group,
          engines: engines,
          engineGlows: engineGlows,
          underRing: underRing,
          groundGlow: groundGlow,
          underLight: underLight,
          headlamp: headlamp,
          trailPoints: trailPoints
        };
      }
    };
  }

  var designs = [createPlita74(), createKoltso3(), createKarkas7()];

  if (typeof window !== 'undefined') {
    window.SHIP_DESIGNS_AGY = designs;
  }
  if (typeof global !== 'undefined') {
    global.SHIP_DESIGNS_AGY = designs;
  }
})();
