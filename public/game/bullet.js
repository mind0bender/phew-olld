class Bullet {
  constructor(rocket, damage = 1) {
    this.rocket = rocket;
    this.damage = damage;
    this.size = 8;
    this.pos = posBullet(rocket, this.size);
    this.color = rocket.isOpponent ? "red" : "#fff";
    this.isPlaying = true;
  }
  posFrom() {
    return posFrom(this.pos, this.size);
  }
  show() {
    stroke(this.color);
    fill("black");
    rect(this.posFrom().x, this.posFrom().y, this.size, this.size);
    stroke("white");
  }
  next() {
    this.pos.y += this.size * this.rocket.bulletDir;
  }
  isOutOfRange() {
    return this.posFrom().y <= 0 || this.posFrom().y >= height;
  }
  isHittingOpponent() {
    const opponents = this.rocket.getOpponents();
    for (const opponent of opponents) {
      const isOnLeftOfOpponent =
        this.posFrom().x + this.size < opponent.posFrom().x;
      const isOnRightOfOpponent =
        this.posFrom().x > opponent.posFrom().x + opponent.size;
      const isInLine = !isOnLeftOfOpponent && !isOnRightOfOpponent;
      if (isInLine) {
        let isHitting = false;
        if (this.rocket.bulletDir === -1) {
          isHitting = this.posFrom().y < opponent.posFrom().y + opponent.size;
        } else {
          isHitting = this.posFrom().y + this.size > opponent.posFrom().y;
        }
        return isHitting ? opponent : false;
      }
    }
    return false;
  }
}

const posBullet = (rocket, bulletSize) => {
  const { size, bulletDir, pos } = rocket;
  return createVector(
    pos.x,
    pos.y + (size * bulletDir) / 2 + bulletSize * bulletDir * 2
  );
};
