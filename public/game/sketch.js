let world;
const getWorld = () => {
  return world;
};
function setup() {
  let [w, h] = [window.innerWidth - 10, window.innerHeight - 10];
  createCanvas(w, h);
  strokeWeight(2);
  textSize(20);
  window.focus();
  window.addEventListener("resize", (e) => {
    [w, h] = [window.innerWidth - 10, window.innerHeight - 10];
    resizeCanvas(w, h);
  });
  world = new World();
  world.start();
  console.log(world);
  world.on("death", () => {
    world.stop();
  });
  world.on("focus", () => {
    loop();
  });
  world.on("blur", () => {
    noLoop();
  });
}

function draw() {
  background(0, 0, 0, 75);
  noFill();
  line(0, height - 120, width, height - 120);
  world.next();
  world.show();
  if (frameCount % 200 === 0 && !world.paused && world.focused) {
    world.addOpponent(Math.floor(frameCount / 1000) + 1);
  }
}
