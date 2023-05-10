document.addEventListener("keydown", function(event) {
  var moved = true;
  if (event.key === "ArrowUp" || event.key === "w") {
    up = true;
  } else if (event.key === "ArrowDown" || event.key === "s") {
    down = true;
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    left = true;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    right = true;
  } else {
    moved = false;
  }
  if (moved && notStarted >= 20) {
    notStarted = -1;
    document.getElementById("text-1").innerText = "";
    document.getElementById("text-2").innerText = "";
  }
});
document.addEventListener("keyup", function(event) {
  if (event.key === "ArrowUp" || event.key === "w") {
    up = false;
  } else if (event.key === "ArrowDows" || event.key === "s") {
    down = false;
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    left = false;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    right = false;
  }
});

var c = document.getElementById("canvas").getContext("2d");

var keysImg = new Image();
keysImg.src = "assets/keys.png";

var up = false;
var jump = 0;
var down = false;
var left = false;
var right = false;

var playerX = 50;
var playerY = 50;
var velocity = 0;
var onGround = false;

var normalObjects = [{type:"box",x:47.5,y:47.5,width:5,height:5,velX:0,velY:0}];
var deadlyObjects = [];
var notStarted = 21;
var frameCount = 0;
var scale = 1;

var debug = false;
var fly = false;

function frame() {
  if (notStarted >= 0) {
    notStarted++;
    if (notStarted == 20) {
      document.getElementById("text-1").innerText = "YOU LOST!\nSCORE: " + Math.floor(frameCount / 50);
      document.getElementById("text-2").innerText = "MOVE TO START...";
      playerX = 50;
      playerY = 50;
      oldPlayerX = 50;
      oldPlayerY = 50;
      velocity = 0;
      normalObjects = [];
      deadlyObjects = [];
      frameCount = 0;
    }
    if (notStarted >= 20) {
      scale = Math.min(window.innerWidth, window.innerHeight) * .01;
      document.getElementById("canvas").setAttribute("width", scale * 100);
      document.getElementById("canvas").setAttribute("height", scale * 100);
      drawRect(0, 0, 100, 100, "#C00");
      c.clearRect(scale, scale, 98 * scale, 98 * scale);
      drawImg(3, 66, 1, keysImg);
    }
    return;
  }
  movePlayer();
  draw();
  frameCount++;
}

function movePlayer() {
  if (debug && fly) {
    if (up) {
      playerY -= .5;
    } else if (down) {
      playerY += .5;
    } else if (left) {
      playerX -= .5;
    } else if (right) {
      playerX += .5;
    }
    return;
  }
  if (left && !right) {
    playerX -= 1;
  } else if (right && !left) {
    playerX += 1;
  }
  if (up) {
    jump = 16;
  }
  if (jump > 0) {
    jump--;
    if (debug && up || onGround) {
      jump = 0;
      velocity = -2;
    }
  }
  if (onGround) {
    if (velocity > 0) {
      velocity = 0;
    }
  } else {
    velocity += .1;
    velocity *= .98;
  }
  playerY += velocity;
}

function spawnNormalBox(x, y, width, height, velX, velY) {
  normalObjects.push({
    type: "box",
    x: x,
    y: y,
    width: width,
    height: height,
    velX: velX,
    velY: velY
  });
}

function spawnDeadlyBox(x, y, width, height, velX, velY) {
  normalObjects.push({
    type: "box",
    x: x,
    y: y,
    width: width,
    height: height,
    velX: velX,
    velY: velY
  });
}

var stop = false;

function draw() {
  scale = Math.min(window.innerWidth, window.innerHeight) * .01;
  document.getElementById("canvas").setAttribute("width", scale * 100);
  document.getElementById("canvas").setAttribute("height", scale * 100);
  var hit = false;
  onGround = false;
  if (playerX < 2 || playerX > 98 || playerY < 2 || playerY > 98) {
    hit = true;
  }
  for (var i = 0; i < normalObjects.length; i++) {
    var object = normalObjects[i];
    switch (object.type) {
      case "box": {
        if (!stop) {
          object.x += object.velX;
        object.y += object.velY;
        }
        if (object.x < -10 - object.width || object.x > 110 || object.y < -10 - object.height || object.y > 110) {
          normalObjects.splice(i, 1);
          i--;
        } else {
          drawRect(object.x, object.y, object.width, object.height, "#FFF");
          if (playerX >= object.x - 1 && playerX <= object.x + object.width + 1 && playerY >= object.y - 1 && playerY <= object.y + object.height + 1) {
            var distNegX = Math.abs(playerX - object.x + 1);
            var distNegY = Math.abs(playerY - object.y + 1);
            var distPosX = Math.abs(playerX - object.x - object.width - 1);
            var distPosY = Math.abs(playerY - object.y - object.height - 1);
            var smallest = Math.min(distNegX, distNegY, distPosX, distPosY);
            if (smallest == distNegX) {
              playerX = object.x - 1.001;
            } else if (smallest == distNegY) {
              playerY = object.y - 1.001;
              onGround = true;
            } else if (smallest == distPosX) {
              playerX = object.x + object.width + 1.001;
            } else {
              playerY = object.y + object.height + 1.001;
              if (velocity < 0) {
                velocity = 0;
              }
            }
          }
        }
        break;
      }
    }
  }
  for (var i = 0; i < deadlyObjects.length; i++) {
    //hit = hit || drawObject(deadlyObjects[i], true);
  }
  drawRect(0, 0, 100, 1, "#C00");
  drawRect(0, 0, 1, 100, "#C00");
  drawRect(99, 0, 1, 100, "#C00");
  drawRect(0, 99, 100, 1, "#C00");
  drawRect(playerX - 1, playerY - 1, 2, 2, hit && debug ? "#0CF" : "#08F");
  if (hit) {
    if (!debug) {
      notStarted = 0;
    }
  }
}

function drawRect(x, y, width, height, color) {
  c.fillStyle = color;
  c.fillRect(x * scale, y * scale, width * scale, height * scale);
}

function drawImg(x, y, scaleMultiplier, img) {
  c.drawImage(img, x * scale, y * scale, scaleMultiplier * scale * img.width, scaleMultiplier * scale * img.height);
}

setInterval(frame, 20);
