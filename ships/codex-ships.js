window.SHIP_DESIGNS_CODEX = [
  {
    name: 'Night Courier',
    author: 'codex',
    idea: 'A long state-service lifting slab rides on a buried hover ring and pushes forward with two low, overbuilt stern turbines.',
    build(THREE, kit) {
      const group = new THREE.Group();
      const engines = [];
      const engineGlows = [];
      const add = (geometry, material, x, y, z) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x || 0, y || 0, z || 0);
        group.add(mesh);
        return mesh;
      };

      // The planform is the same blunt, repairable sheet-metal shape as a ministry van.
      const plan = new THREE.Shape();
      plan.moveTo(-0.76, -3.0);
      plan.lineTo(0.76, -3.0);
      plan.lineTo(1.12, -2.35);
      plan.lineTo(1.18, 1.7);
      plan.lineTo(0.86, 2.75);
      plan.lineTo(0.42, 3.15);
      plan.lineTo(-0.42, 3.15);
      plan.lineTo(-0.86, 2.75);
      plan.lineTo(-1.18, 1.7);
      plan.lineTo(-1.12, -2.35);
      plan.closePath();
      const upperGeometry = new THREE.ExtrudeGeometry(plan, {
        depth: 0.68,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelSegments: 1,
        curveSegments: 1
      });
      upperGeometry.rotateX(-Math.PI / 2);
      upperGeometry.translate(0, -0.34, 0);
      add(upperGeometry, kit.mats.enamel, 0, 0.12, 0);

      add(new THREE.BoxGeometry(2.2, 0.34, 4.55), kit.mats.dirty, 0, -0.42, 0.35);
      add(new THREE.BoxGeometry(1.72, 0.12, 2.75), kit.mats.graphite, 0, -0.65, 0.45);
      add(new THREE.BoxGeometry(1.56, 0.12, 2.15), kit.mats.grey, 0, 0.56, 0.55);

      // Upright glass and narrow pillars make the cabin read like the game's saloon.
      const windscreen = add(new THREE.BoxGeometry(1.44, 0.58, 0.07), kit.mats.glass, 0, 0.58, -1.31);
      windscreen.rotation.x = -0.18;
      const rearGlass = add(new THREE.BoxGeometry(1.3, 0.42, 0.06), kit.mats.glass, 0, 0.55, 1.67);
      rearGlass.rotation.x = 0.12;
      for (const side of [-1, 1]) {
        add(new THREE.BoxGeometry(0.055, 0.48, 1.75), kit.mats.glass, side * 0.79, 0.55, 0.22);
        add(new THREE.BoxGeometry(0.075, 0.62, 0.12), kit.mats.enamel, side * 0.82, 0.55, -0.45);
        add(new THREE.BoxGeometry(0.075, 0.62, 0.12), kit.mats.enamel, side * 0.82, 0.55, 0.75);
        add(new THREE.BoxGeometry(0.065, 0.08, 4.25), kit.mats.red, side * 1.13, -0.03, 0.12);
      }

      // Two separate turbine cans and simple tail plates: all function, no flourish.
      for (const side of [-1, 1]) {
        const can = add(new THREE.CylinderGeometry(0.31, 0.34, 1.18, 16), kit.mats.graphite, side * 0.7, -0.31, 2.48);
        can.rotation.x = Math.PI / 2;
        const engine = add(new THREE.CircleGeometry(0.25, 20), kit.amber(), side * 0.7, -0.31, 3.08);
        engines.push(engine);
        const glow = kit.glowSprite();
        glow.position.set(side * 0.7, -0.31, 3.17);
        group.add(glow);
        engineGlows.push(glow);
        const fin = add(new THREE.BoxGeometry(0.09, 0.58, 0.74), kit.mats.dirty, side * 1.03, 0.22, 2.54);
        fin.rotation.z = side * -0.09;
      }

      add(new THREE.BoxGeometry(1.86, 0.1, 0.12), kit.mats.grey, 0, -0.28, -2.97);
      for (const side of [-1, 1]) {
        const lens = add(new THREE.CircleGeometry(0.105, 16), kit.mats.headlamp, side * 0.5, -0.06, -3.08);
        lens.rotation.y = Math.PI;
      }
      add(new THREE.BoxGeometry(0.55, 0.055, 0.055), kit.mats.red, 0, 0.49, 2.97);

      const underRing = add(new THREE.TorusGeometry(0.68, 0.045, 8, 28), kit.amber(), 0, -0.7, 0.1);
      underRing.rotation.x = Math.PI / 2;

      const groundGlow = kit.groundGlow(3.6, 6.4);
      groundGlow.position.set(0, -0.78, 0);
      group.add(groundGlow);

      const underLight = new THREE.PointLight(0xff9a40, 1.05, 9, 2);
      underLight.position.set(0, -0.62, 0.1);
      group.add(underLight);

      const headlamp = new THREE.SpotLight(0xfff1d6, 2.0, 85, 0.48, 0.65, 1.15);
      headlamp.position.set(0, -0.02, -2.92);
      headlamp.target.position.set(0, -1.7, -25);
      group.add(headlamp);
      group.add(headlamp.target);

      return {
        group,
        engines,
        engineGlows,
        underRing,
        groundGlow,
        underLight,
        headlamp,
        trailPoints: [
          new THREE.Vector3(-0.7, -0.31, 3.18),
          new THREE.Vector3(0.7, -0.31, 3.18)
        ]
      };
    }
  },
  {
    name: 'Ring Tender',
    author: 'codex',
    idea: 'A broad annular lift frame carries a tiny heated cabin in its empty centre while paired stern motors provide quiet forward motion.',
    build(THREE, kit) {
      const group = new THREE.Group();
      const engines = [];
      const engineGlows = [];
      const add = (geometry, material, x, y, z) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x || 0, y || 0, z || 0);
        group.add(mesh);
        return mesh;
      };
      const bar = (from, to, material, thickness) => {
        const delta = new THREE.Vector3().subVectors(to, from);
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, thickness, delta.length()), material);
        mesh.position.copy(from).addScaledVector(delta, 0.5);
        mesh.lookAt(to);
        group.add(mesh);
        return mesh;
      };

      const frame = add(new THREE.TorusGeometry(2.18, 0.28, 12, 32), kit.mats.dirty, 0, -0.02, 0);
      frame.rotation.x = Math.PI / 2;
      const innerRail = add(new THREE.TorusGeometry(1.73, 0.075, 8, 32), kit.mats.graphite, 0, 0.01, 0);
      innerRail.rotation.x = Math.PI / 2;

      // Four coarse braces suspend the one-person cabin inside the lift annulus.
      bar(new THREE.Vector3(-1.85, 0, 0), new THREE.Vector3(-0.58, 0.03, 0), kit.mats.grey, 0.12);
      bar(new THREE.Vector3(1.85, 0, 0), new THREE.Vector3(0.58, 0.03, 0), kit.mats.grey, 0.12);
      bar(new THREE.Vector3(0, 0, -1.85), new THREE.Vector3(0, 0.03, -0.75), kit.mats.grey, 0.12);
      bar(new THREE.Vector3(0, 0, 1.85), new THREE.Vector3(0, 0.03, 0.75), kit.mats.grey, 0.12);

      const cabin = add(new THREE.SphereGeometry(1, 24, 16), kit.mats.enamel, 0, 0.12, -0.12);
      cabin.scale.set(0.72, 0.55, 1.15);
      const glass = add(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), kit.mats.glass, 0, 0.35, -0.5);
      glass.scale.set(0.54, 0.42, 0.72);
      glass.rotation.x = -0.1;
      add(new THREE.BoxGeometry(1.1, 0.13, 1.45), kit.mats.graphite, 0, -0.44, 0.02);
      add(new THREE.BoxGeometry(0.065, 0.055, 2.05), kit.mats.red, 0, 0.59, 0.08);

      // Rear motors sit on the ring like replaceable trolley components.
      for (const side of [-1, 1]) {
        const nacelle = add(new THREE.CylinderGeometry(0.29, 0.34, 1.05, 16), kit.mats.graphite, side * 1.35, 0.02, 1.95);
        nacelle.rotation.x = Math.PI / 2;
        add(new THREE.BoxGeometry(0.7, 0.11, 0.45), kit.mats.enamel, side * 1.35, 0.18, 1.92);
        const engine = add(new THREE.CircleGeometry(0.255, 20), kit.amber(), side * 1.35, 0.02, 2.5);
        engines.push(engine);
        const glow = kit.glowSprite();
        glow.position.set(side * 1.35, 0.02, 2.61);
        group.add(glow);
        engineGlows.push(glow);
        add(new THREE.BoxGeometry(0.36, 0.055, 0.6), kit.mats.red, side * 2.07, 0.28, 0.72);
      }

      for (const side of [-1, 1]) {
        const lens = add(new THREE.CircleGeometry(0.09, 16), kit.mats.headlamp, side * 0.3, 0.1, -1.27);
        lens.rotation.y = Math.PI;
      }

      const underRing = add(new THREE.TorusGeometry(2.12, 0.052, 8, 32), kit.amber(), 0, -0.34, 0);
      underRing.rotation.x = Math.PI / 2;

      const groundGlow = kit.groundGlow(5.6, 5.6);
      groundGlow.position.set(0, -0.62, 0);
      group.add(groundGlow);

      const underLight = new THREE.PointLight(0xff9a40, 1.0, 10, 2);
      underLight.position.set(0, -0.5, 0);
      group.add(underLight);

      const headlamp = new THREE.SpotLight(0xfff1d6, 1.9, 82, 0.5, 0.65, 1.15);
      headlamp.position.set(0, 0.1, -1.18);
      headlamp.target.position.set(0, -1.8, -24);
      group.add(headlamp);
      group.add(headlamp.target);

      return {
        group,
        engines,
        engineGlows,
        underRing,
        groundGlow,
        underLight,
        headlamp,
        trailPoints: [
          new THREE.Vector3(-2.18, 0.04, 0.75),
          new THREE.Vector3(2.18, 0.04, 0.75)
        ]
      };
    }
  },
  {
    name: 'Survey Capsule',
    author: 'codex',
    idea: 'A Vostok-like observation pod hangs from four exposed lift legs, flying as a slow mechanical insect rather than an aeroplane.',
    build(THREE, kit) {
      const group = new THREE.Group();
      const engines = [];
      const engineGlows = [];
      const add = (geometry, material, x, y, z) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x || 0, y || 0, z || 0);
        group.add(mesh);
        return mesh;
      };
      const bar = (from, to, material, thickness) => {
        const delta = new THREE.Vector3().subVectors(to, from);
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, thickness, delta.length()), material);
        mesh.position.copy(from).addScaledVector(delta, 0.5);
        mesh.lookAt(to);
        group.add(mesh);
        return mesh;
      };

      const pod = add(new THREE.SphereGeometry(1, 24, 16), kit.mats.dirty, 0, 0.15, -0.1);
      pod.scale.set(0.86, 0.93, 1.32);
      const belly = add(new THREE.CylinderGeometry(0.64, 0.72, 0.3, 20), kit.mats.graphite, 0, -0.69, 0.02);
      belly.rotation.y = Math.PI / 8;
      const collar = add(new THREE.TorusGeometry(0.75, 0.075, 8, 24), kit.mats.enamel, 0, -0.55, 0.02);
      collar.rotation.x = Math.PI / 2;

      const glass = add(new THREE.SphereGeometry(1, 20, 12), kit.mats.glass, 0, 0.35, -0.76);
      glass.scale.set(0.57, 0.48, 0.58);
      add(new THREE.BoxGeometry(0.06, 0.74, 0.08), kit.mats.enamel, 0, 0.35, -1.28);
      add(new THREE.BoxGeometry(1.18, 0.055, 0.07), kit.mats.red, 0, -0.05, -1.33);

      const legPositions = [
        [-1.78, -1.18],
        [1.78, -1.18],
        [-1.78, 1.18],
        [1.78, 1.18]
      ];
      for (let i = 0; i < legPositions.length; i += 1) {
        const x = legPositions[i][0];
        const z = legPositions[i][1];
        const sx = Math.sign(x);
        const sz = Math.sign(z);
        bar(new THREE.Vector3(sx * 0.55, -0.28, sz * 0.55), new THREE.Vector3(x, -0.53, z), kit.mats.graphite, 0.105);
        bar(new THREE.Vector3(sx * 0.38, 0.15, sz * 0.38), new THREE.Vector3(x, -0.53, z), kit.mats.grey, 0.075);
        add(new THREE.CylinderGeometry(0.3, 0.36, 0.34, 16), kit.mats.enamel, x, -0.57, z);
        const engine = add(new THREE.CylinderGeometry(0.235, 0.235, 0.045, 18), kit.amber(), x, -0.76, z);
        engines.push(engine);
        const glow = kit.glowSprite();
        glow.position.set(x, -0.88, z);
        group.add(glow);
        engineGlows.push(glow);
      }

      // A plain tail boom and aerial make the pod directional without turning it into a fighter.
      const tail = add(new THREE.CylinderGeometry(0.11, 0.16, 1.42, 12), kit.mats.grey, 0, 0.22, 1.78);
      tail.rotation.x = Math.PI / 2;
      const fin = add(new THREE.BoxGeometry(0.09, 0.72, 0.68), kit.mats.enamel, 0, 0.57, 2.25);
      fin.rotation.x = -0.12;
      add(new THREE.BoxGeometry(0.1, 0.62, 0.07), kit.mats.red, 0, 0.56, 2.59);
      add(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), kit.mats.graphite, 0.28, 1.14, 0.38);

      for (const side of [-1, 1]) {
        const lens = add(new THREE.CircleGeometry(0.1, 16), kit.mats.headlamp, side * 0.28, -0.14, -1.34);
        lens.rotation.y = Math.PI;
      }

      const underRing = add(new THREE.TorusGeometry(0.53, 0.045, 8, 24), kit.amber(), 0, -0.86, 0);
      underRing.rotation.x = Math.PI / 2;

      const groundGlow = kit.groundGlow(4.8, 4.5);
      groundGlow.position.set(0, -0.9, 0);
      group.add(groundGlow);

      const underLight = new THREE.PointLight(0xff9a40, 1.15, 10, 2);
      underLight.position.set(0, -0.75, 0);
      group.add(underLight);

      const headlamp = new THREE.SpotLight(0xfff1d6, 2.0, 86, 0.48, 0.65, 1.15);
      headlamp.position.set(0, -0.12, -1.32);
      headlamp.target.position.set(0, -1.8, -24);
      group.add(headlamp);
      group.add(headlamp.target);

      return {
        group,
        engines,
        engineGlows,
        underRing,
        groundGlow,
        underLight,
        headlamp,
        trailPoints: [
          new THREE.Vector3(-1.78, -0.62, 1.18),
          new THREE.Vector3(1.78, -0.62, 1.18)
        ]
      };
    }
  }
];
