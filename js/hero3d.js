(function(){
if(typeof THREE==='undefined')return;
const heroCanvas=document.getElementById('heroCanvas');
if(heroCanvas){
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,0,6);
const renderer=new THREE.WebGLRenderer({canvas:heroCanvas,antialias:true,alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setClearColor(0x000000,0);
const detail=1;
const geometry=new THREE.IcosahedronGeometry(2,detail);
const wireGeo=new THREE.IcosahedronGeometry(2.01,detail);
const wireMat=new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:0.06});
const wireMesh=new THREE.Mesh(wireGeo,wireMat);
scene.add(wireMesh);
const gemMat=new THREE.MeshPhongMaterial({color:0x111122,specular:0xffffff,shininess:200,transparent:true,opacity:0.75,flatShading:true});
const gemMesh=new THREE.Mesh(geometry,gemMat);
gemMesh.position.set(2,-0.5,0);
scene.add(gemMesh);
wireMesh.position.copy(gemMesh.position);
scene.add(new THREE.AmbientLight(0xffffff,0.15));
const pl1=new THREE.PointLight(0xffffff,2,20);pl1.position.set(5,5,5);scene.add(pl1);
const pl2=new THREE.PointLight(0x4444ff,1.5,20);pl2.position.set(-5,-2,3);scene.add(pl2);
const pl3=new THREE.PointLight(0xff2244,0.8,15);pl3.position.set(2,-5,2);scene.add(pl3);
const pCount=600;const pPos=new Float32Array(pCount*3);
for(let i=0;i<pCount;i++){pPos[i*3]=(Math.random()-.5)*20;pPos[i*3+1]=(Math.random()-.5)*20;pPos[i*3+2]=(Math.random()-.5)*20;}
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
const pMat=new THREE.PointsMaterial({color:0xffffff,size:0.04,transparent:true,opacity:0.35});
const particles=new THREE.Points(pGeo,pMat);scene.add(particles);
let targetRotX=0,targetRotY=0,currentRotX=0,currentRotY=0,isDragging=false,lastMouseX=0,lastMouseY=0;
document.addEventListener('mousemove',(e)=>{if(isDragging){targetRotY+=(e.clientX-lastMouseX)*.008;targetRotX+=(e.clientY-lastMouseY)*.008;lastMouseX=e.clientX;lastMouseY=e.clientY;}else{targetRotY=(e.clientX/window.innerWidth-.5)*.8;targetRotX=(e.clientY/window.innerHeight-.5)*.4;}});
heroCanvas.addEventListener('mousedown',(e)=>{isDragging=true;lastMouseX=e.clientX;lastMouseY=e.clientY;});
document.addEventListener('mouseup',()=>{isDragging=false;});
let autoRotate=0;
(function animate(){requestAnimationFrame(animate);autoRotate+=.003;currentRotX+=(targetRotX-currentRotX)*.06;currentRotY+=(targetRotY-currentRotY)*.06;gemMesh.rotation.x=currentRotX*.5;gemMesh.rotation.y=autoRotate+currentRotY;gemMesh.rotation.z=Math.sin(autoRotate*.5)*.1;wireMesh.rotation.copy(gemMesh.rotation);particles.rotation.y=autoRotate*.1;particles.rotation.x=autoRotate*.05;pl1.position.x=Math.sin(autoRotate*.7)*6;pl1.position.y=Math.cos(autoRotate*.5)*4;pl2.position.x=Math.cos(autoRotate*.4)*-5;renderer.render(scene,camera);})();
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
}
document.querySelectorAll('.mini-canvas').forEach(canvas=>{
const shape=canvas.dataset.shape||'sphere';const parent=canvas.parentElement;
const w=parent.offsetWidth||400;const h=parent.offsetHeight||340;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(50,w/h,0.1,100);camera.position.z=3.5;
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
let geo;
if(shape==='pyramid')geo=new THREE.ConeGeometry(1,1.8,4);
else if(shape==='sphere')geo=new THREE.IcosahedronGeometry(1.2,1);
else if(shape==='box')geo=new THREE.BoxGeometry(1.5,1.5,1.5);
else if(shape==='hexagon')geo=new THREE.CylinderGeometry(1.2,1.2,.3,6);
else if(shape==='torus')geo=new THREE.TorusGeometry(1,.35,8,24);
else if(shape==='diamond')geo=new THREE.OctahedronGeometry(1.3,0);
else geo=new THREE.IcosahedronGeometry(1.2,0);
const mat=new THREE.MeshPhongMaterial({color:0x222233,specular:0xffffff,shininess:180,flatShading:true,transparent:true,opacity:.7});
const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);
const wMat=new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.08});
scene.add(new THREE.Mesh(geo.clone(),wMat));
scene.add(new THREE.AmbientLight(0xffffff,.2));
const pl=new THREE.PointLight(0xffffff,3,15);pl.position.set(3,3,3);scene.add(pl);
const pl2=new THREE.PointLight(0x3344ff,1.5,10);pl2.position.set(-3,-1,2);scene.add(pl2);
let t=Math.random()*Math.PI*2;
(function animate(){requestAnimationFrame(animate);t+=.01;mesh.rotation.y=t*.5;mesh.rotation.x=Math.sin(t*.3)*.3;renderer.render(scene,camera);})();
});
const ctaCanvas=document.getElementById('ctaCanvas');
if(ctaCanvas){
const parent=ctaCanvas.parentElement;const w=parent.offsetWidth;const h=parent.offsetHeight||500;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(60,w/h,0.1,100);camera.position.z=5;
const renderer=new THREE.WebGLRenderer({canvas:ctaCanvas,antialias:true,alpha:true});
renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0x000000,0);
const meshes=[];
for(let i=0;i<12;i++){
const geo=[new THREE.IcosahedronGeometry(.3+Math.random()*.4,0),new THREE.OctahedronGeometry(.3+Math.random()*.4,0),new THREE.TetrahedronGeometry(.3+Math.random()*.4,0)][Math.floor(Math.random()*3)];
const mat=new THREE.MeshPhongMaterial({color:0x1a1a2e,specular:0xffffff,shininess:150,flatShading:true,transparent:true,opacity:.5+Math.random()*.4});
const m=new THREE.Mesh(geo,mat);m.position.set((Math.random()-.5)*14,(Math.random()-.5)*8,(Math.random()-.5)*6);m.userData.speed=.003+Math.random()*.01;m.userData.offset=Math.random()*Math.PI*2;scene.add(m);meshes.push(m);}
scene.add(new THREE.AmbientLight(0xffffff,.3));const pl=new THREE.PointLight(0xffffff,2,30);pl.position.set(0,5,5);scene.add(pl);
let t2=0;(function animate(){requestAnimationFrame(animate);t2+=.008;meshes.forEach(m=>{m.rotation.x+=m.userData.speed;m.rotation.y+=m.userData.speed*.7;m.position.y+=Math.sin(t2+m.userData.offset)*.004;});renderer.render(scene,camera);})();
}
})();
