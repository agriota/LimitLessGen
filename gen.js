const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

const aoeRadius = 125;
const towerRadius = 100;

function showGen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0,200);
  ctx.lineTo(800,200);
  ctx.moveTo(0,400);
  ctx.lineTo(800,400);
  ctx.moveTo(0,600);
  ctx.lineTo(800,600);
  ctx.moveTo(200,0);
  ctx.lineTo(200,800);
  ctx.moveTo(400,0);
  ctx.lineTo(400,800);
  ctx.moveTo(600,0);
  ctx.lineTo(600,800);
  ctx.stroke();
  
  let players = [];
  let c = 0;
  const playerLimit = 8;
  const generatePlayer = (offset) => {
    const anchors = [[200 + offset, 200], [200 + offset, 400]];
    let pos = [];
    do {
      pos = [offset + Math.round(Math.random() * 400), Math.round(Math.random() * 600)];
    } while (
      !anchors.reduce((r,c) => r && dist(c, pos) > aoeRadius, true) || 
      !(dist(pos, [Math.floor(pos[0] / 200) * 200 + 100, Math.floor(pos[1] / 200) * 200 + 100]) > towerRadius)
    )
    return { pos, anchors };
  }
  
  const doPlayersConflict = (p1, p2) =>
    dist(p1.pos, p2.pos) <= aoeRadius ||
    doesLineCollide(p1.pos, p1.anchors[0], p2.pos, aoeRadius) ||
    doesLineCollide(p1.pos, p1.anchors[1], p2.pos, aoeRadius) ||
    doesLineCollide(p2.pos, p2.anchors[0], p1.pos, aoeRadius) ||
    doesLineCollide(p2.pos, p2.anchors[1], p1.pos, aoeRadius);
    
  
  while (players.length < playerLimit) {
    c += 1
    const newPlayer = generatePlayer(players.length >= (playerLimit / 2) ? 400 : 0);
    const conflictsWithExisting = players.reduce((r,c) => r || doPlayersConflict(c, newPlayer), false)
    if (!conflictsWithExisting) {
      c = 0;
      players.push(newPlayer);
    }
    if (c >= 5) {
      players = [];
    }
  }
  
  ctx.lineWidth = "1";
  players.forEach(p => {
    ctx.strokeStyle = "white"
    ctx.fillStyle = "rgba(0,0,200,1)";
    
    ctx.beginPath();
    ctx.arc(p.pos[0],p.pos[1],20,0,2*Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(p.pos[0], p.pos[1]);
    ctx.lineTo(p.anchors[0][0], p.anchors[0][1]);
    ctx.moveTo(p.pos[0], p.pos[1]);
    ctx.lineTo(p.anchors[1][0], p.anchors[1][1]);
    ctx.closePath();
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    
    
    ctx.beginPath();
    ctx.arc(p.pos[0],p.pos[1],aoeRadius,0,2*Math.PI);
    ctx.fillStyle = "rgba(231,40,10,0.3)";
    ctx.closePath();
    ctx.fill();
  });
  

  function dist(p1, p2) {
    var difx = p1[0] - p2[0];
    var dify = p1[1] - p2[1];
    return result = Math.sqrt(Math.pow(difx, 2) + Math.pow(dify, 2));
  }
  
  function doesLineCollide([x1, y1], [x2, y2], [cx, cy], r) {
    let x_linear = x2 - x1;
    let x_constant = x1 - cx;
    let y_linear = y2 - y1;
    let y_constant = y1 - cy;
    let a = x_linear * x_linear + y_linear * y_linear;
    let half_b = x_linear * x_constant + y_linear * y_constant;
    let c = x_constant * x_constant + y_constant * y_constant - r * r;
    return (
      half_b * half_b >= a * c &&
      (-half_b <= a || c + half_b + half_b + a <= 0) &&
      (half_b <= 0 || c <= 0)
    );
  }
}

showGen();
