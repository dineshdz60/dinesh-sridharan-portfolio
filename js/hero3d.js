/* hero3d.js — resn-style centered gem with mouse drag + chromatic aberration */
(function() {

  // ── HERO CANVAS ──────────────────────────────────────────────────────────
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroCanvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Gem geometry — polyhedron like resn's diamond shape
  function createGemGeometry() {
    // Create a custom gem using icosahedron + some manual distortion
    const geo = new THREE.IcosahedronGeometry(1.5, 1);
    const pos = geo.attributes.position;
    // Stretch vertically to make it more gem-like (taller)
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setY(i, y * 1.35);
      // Slightly flatten bottom
      if (y < -0.5) pos.setY(i, y * 0.7);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  const gemGeo = createGemGeometry();

  // Materials — dark glass with highlights, like resn
  const gemMat = new THREE.MeshPhongMaterial({
    color: 0x080810,
    specular: 0x8888cc,
    shininess: 120,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const gem = new THREE.Mesh(gemGeo, gemMat);
  scene.add(gem);

  // Wireframe overlay (subtle, like resn)
  const wireGeo = createGemGeometry();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x333348,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wire);

  // Inner glow faces — coloured facets (resn has a blue/purple glint)
  const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x1a0a3a,
    specular: 0x6644aa,
    shininess: 200,
    transparent: true,
    opacity: 0.7,
    flatShading: true,
    side: THREE.BackSide,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(3, 5, 3);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x2244aa, 0.6);
  fillLight.position.set(-3, -2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, -3, -3);
  scene.add(rimLight);

  // Chromatic aberration effect via CSS filter on canvas
  // We'll animate a slight glitch offset
  let glitchTimer = 0;
  function applyGlitch() {
    glitchTimer += 0.01;
    const glitchIntensity = Math.max(0, Math.sin(glitchTimer * 0.3) * 0.5 + 0.5);
    const px = (Math.random() - 0.5) * 3 * glitchIntensity;
    const py = (Math.random() - 0.5) * 1 * glitchIntensity;
    if (Math.random() > 0.97) {
      heroCanvas.style.filter = `drop-shadow(${px}px ${py}px 0 rgba(255,50,50,0.5)) drop-shadow(${-px}px ${-py}px 0 rgba(50,100,255,0.5))`;
    } else if (Math.random() > 0.98) {
      heroCanvas.style.filter = 'none';
    }
  }

  // Mouse drag
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let rotVel = { x: 0, y: 0 };

  window.addEventListener('mousedown', e => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (isDragging) {
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      rotVel.y += dx * 0.005;
      rotVel.x += dy * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    }
    // Custom cursor update
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  let autoRot = 0;
  function animate() {
    requestAnimationFrame(animate);

    autoRot += 0.003;
    rotVel.x *= 0.92;
    rotVel.y *= 0.92;

    gem.rotation.y = autoRot + rotVel.y;
    gem.rotation.x = rotVel.x * 0.5;
    wire.rotation.y = gem.rotation.y;
    wire.rotation.x = gem.rotation.x;
    inner.rotation.y = gem.rotation.y * 0.7;
    inner.rotation.x = gem.rotation.x * 0.7;

    applyGlitch();
    renderer.render(scene, camera);
  }
  animate();


  // ── MENU CANVAS ──────────────────────────────────────────────────────────
  const menuCanvas = document.getElementById('menuCanvas');
  if (!menuCanvas) return;

  const mRenderer = new THREE.WebGLRenderer({ canvas: menuCanvas, antialias: true, alpha: true });
  mRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mRenderer.setSize(window.innerWidth, window.innerHeight);

  const mScene = new THREE.Scene();
  const mCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  mCamera.position.set(0, 0, 5);

  // Same gem but slightly different position for menu
  const mGemGeo = createGemGeometry();
  const mGemMat = new THREE.MeshPhongMaterial({
    color: 0x060608,
    specular: 0x5544aa,
    shininess: 150,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const mGem = new THREE.Mesh(mGemGeo, mGemMat);
  mScene.add(mGem);

  const mWire = new THREE.Mesh(createGemGeometry(), new THREE.MeshBasicMaterial({
    color: 0x222233, wireframe: true, transparent: true, opacity: 0.25
  }));
  mScene.add(mWire);

  mScene.add(new THREE.AmbientLight(0x111122, 0.5));
  const mKey = new THREE.DirectionalLight(0xffffff, 0.8);
  mKey.position.set(2, 4, 2);
  mScene.add(mKey);
  const mFill = new THREE.DirectionalLight(0x3355bb, 0.5);
  mFill.position.set(-2, -2, 2);
  mScene.add(mFill);

  let mAutoRot = 0;
  function animateMenu() {
    requestAnimationFrame(animateMenu);
    mAutoRot += 0.002;
    mGem.rotation.y = mAutoRot;
    mGem.rotation.x = Math.sin(mAutoRot * 0.5) * 0.2;
    mWire.rotation.y = mGem.rotation.y;
    mWire.rotation.x = mGem.rotation.x;
    mRenderer.render(mScene, mCamera);
  }
  animateMenu();

  window.addEventListener('resize', () => {
    mCamera.aspect = window.innerWidth / window.innerHeight;
    mCamera.updateProjectionMatrix();
    mRenderer.setSize(window.innerWidth, window.innerHeight);
  });

})();
