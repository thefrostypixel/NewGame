// Key Presses
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
  } else if (event.key === "ArrowDown" || event.key === "s") {
    down = false;
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    left = false;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    right = false;
  }
});

// Held Keys
var up = false;
var down = false;
var left = false;
var right = false;

// Canvas
var c = document.getElementById("canvas").getContext("2d");

// Player Position
var player = { x: 50, y: 50, speed: .5 };

// Bounds
var bounds = { x: 0, y: 0, width: 100, height: 100, duration: 0, anim: { x: 0, y: 0, width: 100, height: 100 } };

// Objects
var objects = [];

// Game State
var notStarted = 21;
var scale = 1;
var score = 0;
var level = 0;
var levelFrame = 999;
var levelNumber = -1;

// Debug Settings
var debug = { noBoundsColl: false, noObjColl: false };

function frame() {
  // Handle Not Started Screen
  if (notStarted >= 0) {
    notStarted++;
    if (notStarted == 20) {
      document.getElementById("text-1").innerText = "YOU LOST!\nSCORE: " + score;
      document.getElementById("text-2").innerText = "MOVE TO\nSTART...";
      player = { x: 50, y: 50, speed: .5 };
      bounds = { x: 0, y: 0, width: 100, height: 100, duration: 0, anim: { x: 0, y: 0, width: 100, height: 100 } };
      objects = [];
      score = 0;
      levelFrame = 999;
      levelNumber = -1;
    }
    if (notStarted >= 20) {
      scale = Math.min(window.innerWidth, window.innerHeight) * .01;
      document.getElementById("canvas").setAttribute("width", scale * 100);
      document.getElementById("canvas").setAttribute("height", scale * 100);
      drawRect(0, 0, 100, 100, "#FFF");
      clearRect(1, 1, 98, 98);
    }
    return;
  }

  // Animate Bounds
  if (bounds.duration <= 0) {
    bounds.anim.x = bounds.x;
    bounds.anim.y = bounds.y;
    bounds.anim.width = bounds.width;
    bounds.anim.height = bounds.height;
  } else {
    bounds.anim.x += (bounds.x - bounds.anim.x) / bounds.duration;
    bounds.anim.y += (bounds.y - bounds.anim.y) / bounds.duration;
    bounds.anim.width += (bounds.width - bounds.anim.width) / bounds.duration;
    bounds.anim.height += (bounds.height - bounds.anim.height) / bounds.duration--;
  }

  // Move The Player
  var horizontal = (right - left) * player.speed;
  var vertical = (down - up) * player.speed;
  if (horizontal != 0 && vertical != 0) {
    horizontal *= .707;
    vertical *= .707;
  }
  player.x += horizontal;
  player.y += vertical;

  // Move Player In Bounds
  if (!debug.noBoundsColl) {
    if (player.x < bounds.anim.x + 2) {
      player.x = bounds.anim.x + 2;
    } else if (player.x > bounds.anim.x + bounds.anim.width - 2) {
      player.x = bounds.anim.x + bounds.anim.width - 2;
    }
    if (player.y < bounds.anim.y + 2) {
      player.y = bounds.anim.y + 2;
    } else if (player.y > bounds.anim.y + bounds.anim.height - 2) {
      player.y = bounds.anim.y + bounds.anim.height - 2;
    }
  }

  // Spawn Objects
  levelFrame++;
  if (levelFrame % 50 == 0) {
    score++;
  }
  if (levelFrame == 1000) {
    var nextLevel;
    do {
      nextLevel = Math.floor(Math.random() * 3);
    } while (nextLevel == level);
    level = nextLevel;
    levelFrame = 0;
    levelNumber++;
    console.log("Level: " + level + " • Difficulty: " + levelNumber);
  }
  switch (level) { // Easiest At levelNumber 0 Should Go Up Until Maxing Out At levelNumber 20
    case 0: {
      if (levelFrame == 0) {
        bounds.x = 30;
        bounds.y = 30;
        bounds.width = 40;
        bounds.height = 40;
        bounds.duration = 50;
      }
      if (levelFrame % Math.max(50 - levelNumber, 20) == 0 && levelFrame <= 900) {
        if (Math.random() * 4 < 1) {
          objects.push({ type: "bullet", x: Math.random() * 30 + 35, y: -5, size: 5, vel: { x: 0, y: .5 } });
        } else if (Math.random() * 3 < 1) {
          objects.push({ type: "bullet", x: -5, y: Math.random() * 30 + 35, size: 5, vel: { x: .5, y: 0 } });
        } else if (Math.random() * 2 < 1) {
          objects.push({ type: "bullet", x: Math.random() * 30 + 35, y: 105, size: 5, vel: { x: 0, y: -.5 } });
        } else {
          objects.push({ type: "bullet", x: 105, y: Math.random() * 30 + 35, size: 5, vel: { x: -.5, y: 0 } });
        }
      }
      break;
    }
    case 1: {
      if (levelFrame == 0) {
        bounds.x = 35;
        bounds.y = 45;
        bounds.width = 30;
        bounds.height = 10;
        bounds.duration = 50;
      }
      bounds.y = 45 + Math.sin(levelFrame / 100 * Math.PI * 2) * 15;
      if (levelFrame % Math.max(40 - levelNumber, 20) == 0 && levelFrame <= 900) {
        objects.push({ type: "bullet", x: -2, y: 50, size: 2, vel: { x: .5, y: 0 } });
      }
      break;
    }
    case 2: {
      if (levelFrame == 0) {
        bounds.x = 0;
        bounds.y = 0;
        bounds.width = 100;
        bounds.height = 100;
        bounds.duration = 50;
      }
      if (levelFrame % Math.max(40 - levelNumber, 20) == 0 && levelFrame <= 950) {
        objects.push({ type: "blast", x: player.x, y: player.y, rotation: Math.random() * 360, size: 1, explosion: { delay: 30, expansion: 5, size: 10, decay: 10 } });
      }
      break;
    }
    case 3: {
      if (levelFrame == 0) {
        bounds.x = 30;
        bounds.y = 30;
        bounds.width = 40;
        bounds.height = 40;
        bounds.duration = 50;
      }
      levelNumber = 20;
      var timeFallOff = Math.min(Math.floor(levelNumber * .5), 10);
      var delayFallOff = Math.min(Math.floor(levelNumber * .25), 5);
      if (levelFrame == 50) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 0, size: 1, explosion: { delay: 30, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 90, size: 1, explosion: { delay: 30, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame == 100 - timeFallOff) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 45, size: 1, explosion: { delay: 30 - delayFallOff, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 135, size: 1, explosion: { delay: 30 - delayFallOff, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame == 150 - timeFallOff * 2) {
        objects.push({ type: "blast", x: 50, y: 35, rotation: 0, size: 1, explosion: { delay: 30 - delayFallOff * 2, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 65, rotation: 0, size: 1, explosion: { delay: 30 - delayFallOff * 2, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 35, y: 50, rotation: 90, size: 1, explosion: { delay: 30 - delayFallOff * 2, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 65, y: 50, rotation: 90, size: 1, explosion: { delay: 30 - delayFallOff * 2, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame == 200 - timeFallOff * 3) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 0, size: 1, explosion: { delay: 30 - delayFallOff * 3, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 90, size: 1, explosion: { delay: 30 - delayFallOff * 3, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame == 250 - timeFallOff * 4) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 45, size: 1, explosion: { delay: 30 - delayFallOff * 4, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 135, size: 1, explosion: { delay: 30 - delayFallOff * 4, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame >= 300 - timeFallOff * 5 && levelFrame < 800 - timeFallOff * 6) {
        if (levelFrame % 10 == 0) {
          objects.push({ type: "blast", x: 50, y: 50, rotation: levelFrame * Math.min(1.5 + levelNumber * .05, 2.5), size: 1, explosion: { delay: 30, expansion: 5, size: 10, decay: 10 } });
        }
      } else if (levelFrame == 850 - timeFallOff * 6) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 0, size: 1, explosion: { delay: 30 - delayFallOff * 5, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 90, size: 1, explosion: { delay: 30 - delayFallOff * 5, expansion: 5, size: 10, decay: 10 } });
      } else if (levelFrame == 900 - timeFallOff * 7) {
        objects.push({ type: "blast", x: 50, y: 50, rotation: 45, size: 1, explosion: { delay: 30 - delayFallOff * 6, expansion: 5, size: 10, decay: 10 } });
        objects.push({ type: "blast", x: 50, y: 50, rotation: 135, size: 1, explosion: { delay: 30 - delayFallOff * 6, expansion: 5, size: 10, decay: 10 } });
      }
      break;
    }
  }

  // Canvas
  scale = Math.min(window.innerWidth, window.innerHeight) * .01 - .5;
  document.getElementById("canvas").setAttribute("width", scale * 100);
  document.getElementById("canvas").setAttribute("height", scale * 100);

  // Draw Bounds
  drawRect(bounds.anim.x, bounds.anim.y, bounds.anim.width, bounds.anim.height, "#FFF");
  clearRect(bounds.anim.x + 1, bounds.anim.y + 1, bounds.anim.width - 2, bounds.anim.height - 2);

  // Move And Draw Objects And Detect Hits
  var hit = false;
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    switch (obj.type) {
      case "bullet": {
        obj.x += obj.vel.x;
        obj.y += obj.vel.y;
        if (obj.x < -obj.size || obj.y < -obj.size || obj.x > obj.size + 100 || obj.y > obj.size + 100) {
          objects.splice(obj, 1);
          break;
        }
        drawCircle(obj.x, obj.y, obj.size, "#FFF");
        if ((obj.x - player.x) * (obj.x - player.x) + (obj.y - player.y) * (obj.y - player.y) < (obj.size + 1) * (obj.size + 1)) {
          hit = true;
        }
        break;
      }
      case "blast": {
        if (obj.explosion.delay + obj.explosion.expansion + obj.explosion.decay == 0) {
          objects.splice(obj, 1);
          break;
        } else if (obj.explosion.delay + obj.explosion.expansion == 0) {
          obj.size -= obj.size / obj.explosion.decay--;
        } else if (obj.explosion.delay == 0) {
          obj.size += (obj.explosion.size - obj.size) / obj.explosion.expansion--;
        } else {
          obj.explosion.delay--;
        }
        drawLine(obj.x, obj.y, obj.rotation, obj.size, obj.explosion.delay == 0 ? "#FFF" : "#FFF8");
        const rotation = obj.rotation * Math.PI / 180;
        const x1 = obj.x - Math.cos(rotation) * 200;
        const y1 = obj.y - Math.sin(rotation) * 200;
        const x2 = obj.x + Math.cos(rotation) * 200;
        const y2 = obj.y + Math.sin(rotation) * 200;
        if (obj.explosion.delay == 0 && (Math.abs((y2 - y1) * player.x - (x2 - x1) * player.y + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) * 2 < obj.size + 2)) {
          hit = true;
        }
        break;
      }
      // Aiming Bullets
    }
  }

  // Draw Player And End Game If Hit
  if (hit) {
    if (!debug.noObjColl) {
      notStarted = 0;
    }
    drawCircle(player.x, player.y, 1, "#800");
  } else {
    drawCircle(player.x, player.y, 1, "#F00");
  }
}

// Canvas Drawing Functions
function drawRect(x, y, width, height, color) {
  c.fillStyle = color;
  c.fillRect(x * scale, y * scale, width * scale, height * scale);
}
function clearRect(x, y, width, height) {
  c.clearRect(x * scale, y * scale, width * scale, height * scale);
}
function drawCircle(x, y, radius, color) {
  c.fillStyle = color;
  c.beginPath();
  c.arc(x * scale, y * scale, radius * scale, 0, 2 * Math.PI);
  c.fill();
}
function drawLine(x, y, angle, size, color) {
  c.beginPath();
  c.strokeStyle = color;
  c.lineWidth = size * scale;
  const radians = angle * Math.PI / 180;
  c.moveTo((x - Math.cos(radians) * 200) * scale, (y - Math.sin(radians) * 200) * scale);
  c.lineTo((x + Math.cos(radians) * 200) * scale, (y + Math.sin(radians) * 200) * scale);
  c.stroke();
}

// Frame Loop
setInterval(frame, 20);
