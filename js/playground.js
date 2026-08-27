

import { playDrop, playChime, playBlip } from './sound.js';

export function initPlayground() {
  const canvas = document.getElementById('playground-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

  let cameraX = 0;
  let cameraY = 0;
  let targetCamX = 0;
  let targetCamY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastDragX = 0;
  let lastDragY = 0;
  let camVelX = 0;
  let camVelY = 0;
  let hoveredObject = null;

  let particles = [];

  const ISO_ANGLE = Math.PI / 6;
  const COS_ISO = Math.cos(ISO_ANGLE);
  const SIN_ISO = Math.sin(ISO_ANGLE);

  function toScreen(isoX, isoY, isoZ = 0) {
    const screenX = width / 2 + (isoX - isoY) * COS_ISO + cameraX;
    const screenY = height / 2 + (isoX + isoY) * SIN_ISO - isoZ + cameraY;
    return { x: screenX, y: screenY };
  }

  function fromScreen(screenX, screenY) {
    const adjX = screenX - width / 2 - cameraX;
    const adjY = screenY - height / 2 - cameraY;
    const isoX = (adjY / SIN_ISO + adjX / COS_ISO) / 2;
    const isoY = (adjY / SIN_ISO - adjX / COS_ISO) / 2;
    return { isoX, isoY };
  }

  const artifactTemplates = [
    {
      id: 'python',
      title: 'Python Core',
      tag: 'PYTHON 3.12',
      colorTop: '#4b8bbe',
      colorLeft: '#306998',
      colorRight: '#255175',
      accent: '#ffd438',
      w: 64, d: 64, h: 72,
      isoX: -140, isoY: -60,
    },
    {
      id: 'django',
      title: 'Django Engine',
      tag: 'DJANGO REST',
      colorTop: '#44b78b',
      colorLeft: '#092e20',
      colorRight: '#051d14',
      accent: '#00ffaa',
      w: 70, d: 70, h: 95,
      isoX: 0, isoY: 0,
    },
    {
      id: 'postgres',
      title: 'Database Vault',
      tag: 'POSTGRESQL',
      colorTop: '#5a8eb8',
      colorLeft: '#336791',
      colorRight: '#244966',
      accent: '#ffffff',
      w: 60, d: 60, h: 60,
      isoX: 140, isoY: 60,
    },
    {
      id: 'terminal',
      title: 'Terminal Station',
      tag: 'BASH / CLI',
      colorTop: '#2c2a28',
      colorLeft: '#161514',
      colorRight: '#0e0e0d',
      accent: '#00ff66',
      w: 64, d: 64, h: 50,
      isoX: -80, isoY: 130,
    },
    {
      id: 'star',
      title: 'Pixel Star',
      tag: 'ORIGINAL CRAFT',
      colorTop: '#e0603f',
      colorLeft: '#c84b2c',
      colorRight: '#9e351b',
      accent: '#ffe600',
      w: 52, d: 52, h: 80,
      isoX: 90, isoY: -130,
    },
  ];

  class VoxelArtifact {
    constructor(data) {
      this.id = data.id;
      this.title = data.title;
      this.tag = data.tag;
      this.colorTop = data.colorTop;
      this.colorLeft = data.colorLeft;
      this.colorRight = data.colorRight;
      this.accent = data.accent;
      this.w = data.w;
      this.d = data.d;
      this.h = data.h;
      this.isoX = data.isoX;
      this.isoY = data.isoY;
      this.isoZ = 0;
      this.targetIsoZ = 0;
      this.vz = 0;
      this.isLaunching = false;
      this.baseH = data.h;
      this.hovered = false;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulse += 0.04;

      if (this.isLaunching) {
        this.vz -= 0.65;
        this.isoZ += this.vz;

        if (this.isoZ <= 0) {
          this.isoZ = 0;
          if (Math.abs(this.vz) > 2) {
            playDrop();
          }
          this.vz = -this.vz * 0.45;
          if (Math.abs(this.vz) < 0.8) {
            this.vz = 0;
            this.isLaunching = false;
          }
        }
      } else {
        this.targetIsoZ = this.hovered ? 18 : 0;
        this.isoZ += (this.targetIsoZ - this.isoZ) * 0.14;
        if (Math.abs(this.targetIsoZ - this.isoZ) < 0.05) {
          this.isoZ = this.targetIsoZ;
        }
      }
    }

    launch() {
      this.vz = 14;
      this.isLaunching = true;
      playChime();
      spawnSparkles(this.isoX, this.isoY, this.h + 20, this.accent);
    }

    draw() {
      const { w, d, h } = this;
      const { x: groundX, y: groundY } = toScreen(this.isoX, this.isoY, 0);
      const { x, y } = toScreen(this.isoX, this.isoY, this.isoZ);

      const shadowScale = Math.max(0.4, 1 - this.isoZ / 180);
      const shadowAlpha = Math.max(0.1, 0.35 - this.isoZ / 350);

      ctx.save();
      ctx.fillStyle = `rgba(22, 21, 20, ${shadowAlpha})`;
      ctx.beginPath();
      const p1 = toScreen(this.isoX - (w / 2) * shadowScale, this.isoY - (d / 2) * shadowScale, 0);
      const p2 = toScreen(this.isoX + (w / 2) * shadowScale, this.isoY - (d / 2) * shadowScale, 0);
      const p3 = toScreen(this.isoX + (w / 2) * shadowScale, this.isoY + (d / 2) * shadowScale, 0);
      const p4 = toScreen(this.isoX - (w / 2) * shadowScale, this.isoY + (d / 2) * shadowScale, 0);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const halfW = w / 2;
      const halfD = d / 2;

      const bCenter = { x, y };
      const bLeft = toScreen(this.isoX - halfW, this.isoY + halfD, this.isoZ);
      const bFront = toScreen(this.isoX + halfW, this.isoY + halfD, this.isoZ);
      const bRight = toScreen(this.isoX + halfW, this.isoY - halfD, this.isoZ);
      const bBack = toScreen(this.isoX - halfW, this.isoY - halfD, this.isoZ);

      const tLeft = { x: bLeft.x, y: bLeft.y - h };
      const tFront = { x: bFront.x, y: bFront.y - h };
      const tRight = { x: bRight.x, y: bRight.y - h };
      const tBack = { x: bBack.x, y: bBack.y - h };

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#161514';

      ctx.fillStyle = this.colorLeft;
      ctx.beginPath();
      ctx.moveTo(bFront.x, bFront.y);
      ctx.lineTo(tFront.x, tFront.y);
      ctx.lineTo(tLeft.x, tLeft.y);
      ctx.lineTo(bLeft.x, bLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.colorRight;
      ctx.beginPath();
      ctx.moveTo(bFront.x, bFront.y);
      ctx.lineTo(tFront.x, tFront.y);
      ctx.lineTo(tRight.x, tRight.y);
      ctx.lineTo(bRight.x, bRight.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.hovered ? this.accent : this.colorTop;
      ctx.beginPath();
      ctx.moveTo(tFront.x, tFront.y);
      ctx.lineTo(tRight.x, tRight.y);
      ctx.lineTo(tBack.x, tBack.y);
      ctx.lineTo(tLeft.x, tLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.arc(tFront.x, tFront.y + 12, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#161514';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.tag, tBack.x, tBack.y - 10);

      ctx.restore();
    }

    hitTest(screenX, screenY) {
      const { x, y } = toScreen(this.isoX, this.isoY, this.h / 2);
      const dx = screenX - x;
      const dy = screenY - y;
      const hitWidth = Math.max(48, (this.w + this.d) * 0.46);
      const hitHeight = Math.max(48, this.h * 0.72);
      return (dx * dx) / (hitWidth * hitWidth) + (dy * dy) / (hitHeight * hitHeight) <= 1;
    }
  }

  let artifacts = [];

  function initWorld() {
    artifacts = artifactTemplates.map((t) => new VoxelArtifact(t));
  }

  function spawnSparkles(isoX, isoY, isoZ, color) {
    for (let i = 0; i < 18; i++) {
      particles.push({
        isoX,
        isoY,
        isoZ,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        vz: Math.random() * 8 + 4,
        color,
        life: 1,
        size: Math.random() * 4 + 2,
      });
    }
  }

  function spawnCustomArtifact() {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 160 + 60;
    const newArt = new VoxelArtifact({
      id: 'custom-' + Date.now(),
      title: 'New Artifact',
      tag: 'NEW ARTIFACT ✦',
      colorTop: '#c84b2c',
      colorLeft: '#9e351b',
      colorRight: '#70220e',
      accent: '#ffd438',
      w: 56, d: 56, h: 65,
      isoX: Math.cos(angle) * dist,
      isoY: Math.sin(angle) * dist,
    });
    newArt.launch();
    artifacts.push(newArt);
  }

  function resetCamera() {
    targetCamX = 0;
    targetCamY = 0;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function drawGroundPlane() {
    const gridSize = 40;
    const gridCount = 9;

    ctx.save();
    ctx.strokeStyle = 'rgba(22, 21, 20, 0.08)';
    ctx.lineWidth = 1;

    for (let i = -gridCount; i <= gridCount; i++) {
      const startX = toScreen(-gridCount * gridSize, i * gridSize, 0);
      const endX = toScreen(gridCount * gridSize, i * gridSize, 0);
      ctx.beginPath();
      ctx.moveTo(startX.x, startX.y);
      ctx.lineTo(endX.x, endX.y);
      ctx.stroke();

      const startY = toScreen(i * gridSize, -gridCount * gridSize, 0);
      const endY = toScreen(i * gridSize, gridCount * gridSize, 0);
      ctx.beginPath();
      ctx.moveTo(startY.x, startY.y);
      ctx.lineTo(endY.x, endY.y);
      ctx.stroke();
    }

    const origin = toScreen(0, 0, 0);
    ctx.fillStyle = 'rgba(200, 75, 44, 0.4)';
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(22, 21, 20, 0.45)';
    ctx.font = '9px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0,0 [SECTOR A]', origin.x, origin.y + 14);

    ctx.restore();
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasCoords(e);
    isDragging = true;
    dragStartX = x;
    dragStartY = y;
    lastDragX = x;
    lastDragY = y;
    camVelX = 0;
    camVelY = 0;

    for (let i = artifacts.length - 1; i >= 0; i--) {
      if (artifacts[i].hitTest(x, y)) {
        artifacts[i].launch();
        return;
      }
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const { x, y } = getCanvasCoords(e);

    if (isDragging) {
      const dx = x - lastDragX;
      const dy = y - lastDragY;
      targetCamX += dx;
      targetCamY += dy;
      camVelX = dx;
      camVelY = dy;
      lastDragX = x;
      lastDragY = y;
    } else {
      let found = null;
      for (let i = artifacts.length - 1; i >= 0; i--) {
        if (artifacts[i].hitTest(x, y)) {
          found = artifacts[i];
          break;
        }
      }
      artifacts.forEach((a) => (a.hovered = a === found));
      if (found && !hoveredObject) playBlip();
      hoveredObject = found;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (!isDragging) {
      artifacts.forEach((artifact) => (artifact.hovered = false));
      hoveredObject = null;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('touchstart', (e) => {
    const { x, y } = getCanvasCoords(e);
    isDragging = true;
    dragStartX = x;
    dragStartY = y;
    lastDragX = x;
    lastDragY = y;

    for (let i = artifacts.length - 1; i >= 0; i--) {
      if (artifacts[i].hitTest(x, y)) {
        artifacts[i].launch();
        return;
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const { x, y } = getCanvasCoords(e);
    const dx = x - lastDragX;
    const dy = y - lastDragY;
    targetCamX += dx;
    targetCamY += dy;
    lastDragX = x;
    lastDragY = y;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetCamX -= e.deltaX * 0.5;
    targetCamY -= e.deltaY * 0.5;
  }, { passive: false });

  const spawnBtn = document.getElementById('playground-spawn-btn');
  const resetBtn = document.getElementById('playground-clear-btn');

  spawnBtn?.addEventListener('click', spawnCustomArtifact);
  resetBtn?.addEventListener('click', resetCamera);

  function loop() {
    ctx.clearRect(0, 0, width, height);

    cameraX += (targetCamX - cameraX) * 0.12;
    cameraY += (targetCamY - cameraY) * 0.12;

    drawGroundPlane();

    artifacts.sort((a, b) => a.isoX + a.isoY - (b.isoX + b.isoY));

    artifacts.forEach((a) => {
      a.update();
      a.draw();
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.isoX += p.vx;
      p.isoY += p.vy;
      p.isoZ += p.vz;
      p.vz -= 0.3;
      p.life -= 0.025;

      if (p.life <= 0 || p.isoZ < 0) {
        particles.splice(i, 1);
        continue;
      }

      const { x, y } = toScreen(p.isoX, p.isoY, p.isoZ);
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(x, y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  resize();
  initWorld();
  loop();

  window.addEventListener('resize', () => {
    resize();
  });
}
