class Rocket {
  constructor(
    world,
    pos,
    speed = 90,
    isOpponent = false,
    hp = 20 // health
  ) {
    this.world = world;
    this.color = color(colorForRocket(isOpponent));
    this.size = 40;
    this.pos = pos || createVector(width / 2, height - 60);
    this.bulletDir = bulletDirectionForRocket(isOpponent);
    this.direction = 0;
    this.isShooting = false;
    this.fireRate = 100 - speed; // fireRate goes from 1 to 100
    this.isOpponent = isOpponent;
    this.hp = hp;
    this.maxHp = hp;
  }
  stop() {
    if (this.isOpponent) {
      this.world.opponents.delete(this);
    } else {
      this.world.emitEvent("death");
    }
  }
  getOpponents() {
    return getOpponentsForRocket(this.isOpponent, this.world);
  }
  damage(damage = 1) {
    this.hp -= damage;
    if (this.hp < 0) {
      throw new Error("Emotional damagee??");
    }
    if (this.hp === 0) {
      this.stop();
    }
  }
  instantKill() {
    this.damage(this.hp);
  }
  next() {
    this.move();
    if (this.isOpponent) {
      if (frameCount % 2 === 0) {
        this.moveForward();
      }
    }
    if (
      (this.isShooting || this.isOpponent) &&
      frameCount % this.fireRate === 0
    ) {
      this.shoot();
    }
  }
  moveForward(speed = 1) {
    this.pos.y += speed;
  }
  setIsShooting(newIsShooting) {
    this.isShooting = newIsShooting;
  }
  isOutOfRange() {
    return this.posFrom().y + this.size >= height - 120;
  }
  show() {
    stroke(this.color);
    fill("#000");
    rect(this.posFrom().x, this.posFrom().y, this.size, this.size);
    stroke("white");
  }
  showHp() {
    const y = hpHeightForRocket(this);
    noFill();
    rect(this.posFrom().x, y, this.size, 4);
    fill(this.color);
    stroke(this.color);
    rect(this.posFrom().x, y, (this.hp / this.maxHp) * this.size, 4);
    noFill();
    stroke("white");
  }
  shoot() {
    this.world.addBullet(this);
  }
  posFrom() {
    return posFrom(this.pos, this.size);
  }
  moveLeft() {
    const finalPos = this.pos.x - 5;
    if (finalPos > this.size) {
      this.pos.x = finalPos;
    }
  }
  moveRight() {
    const finalPos = this.pos.x + 5;
    if (finalPos < width - this.size) {
      this.pos.x = finalPos;
    }
  }
  move() {
    // direction = [-1, 0, 1] => [L, stop, R];
    if (this.direction === -1) {
      this.moveLeft();
    } else if (this.direction === 1) {
      this.moveRight();
    }
  }
}

const createOpponentOptions = (world, lvl = 1) => {
  const pos = opponentRandomPos();
  const color = "#ff3333";
  const speed = 20;
  const hp = lvl + 1;
  return [world, pos, speed, true, hp];
};

const colorForRocket = (isOpponent) => {
  return isOpponent ? "#ff0000" : "#00ffff";
};

const bulletDirectionForRocket = (isOpponent) => {
  return isOpponent ? 1 : -1;
};

const getOpponentsForRocket = (isOpponent, world) => {
  return isOpponent ? [world.player] : world.opponents;
};

const hpHeightForRocket = (rocket) => {
  return rocket.pos.y - 4 - rocket.bulletDir * rocket.size * 0.75;
};
