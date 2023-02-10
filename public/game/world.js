class World {
  constructor() {
    this.player = new Rocket(this);
    this.opponents = new Set();
    this.bullets = new Set();
    this.paused = true;
    this.events = new Map();
    this.score = 0;
    this.focused = document.hasFocus();
  }
  start() {
    this.paused = false;
    this.setupInteraction();
    print("small bang!");
    print(this.player);
  }
  stop() {
    this.paused = true;
  }
  next() {
    if (!this.paused && this.focused) {
      this.player.next();
      this.opponents.forEach((opponent) => {
        opponent.next();
        if (opponent.isOutOfRange()) {
          this.player.instantKill();
        }
      });
      this.bullets.forEach((bullet) => {
        bullet.next();
        if (bullet.isOutOfRange()) {
          this.bullets.delete(bullet);
        } else {
          const hittingOpponent = bullet.isHittingOpponent();
          if (hittingOpponent) {
            hittingOpponent.damage(bullet.damage);
            this.bullets.delete(bullet);
            if (
              hittingOpponent.isOpponent &&
              !this.opponents.has(hittingOpponent)
            ) {
              this.score += 1;
              print(this.score);
            }
          }
        }
      });
    }
  }
  show() {
    this.player.show();
    this.player.showHp();
    this.showScore();
    this.opponents.forEach((opponent) => {
      opponent.show();
      opponent.showHp();
    });
    this.bullets.forEach((bullet) => {
      bullet.show();
    });
  }
  on(name, listener) {
    this.events.set(name, listener);
  }
  emitEvent(name) {
    const listener = this.events.get(name);
    if (listener) {
      return listener();
    } else {
      throw new Error("event listener not added");
    }
  }
  addOpponent(lvl = 1) {
    const opponentOptions = createOpponentOptions(this, lvl);
    const opponent = new Rocket(...opponentOptions);
    this.opponents.add(opponent);
    return opponent;
  }
  addBullet(rocket) {
    const bullet = new Bullet(rocket);
    this.bullets.add(bullet);
  }
  setupInteraction() {
    // add keyboard events
    window.addEventListener("keydown", getKeyDownHandler(this.player));
    window.addEventListener("keyup", getKeyUpHandler(this.player));
    window.addEventListener("focus", getOnFocusHandler(this));
    window.addEventListener("blur", getOnBlurHandler(this));
  }
  showScore() {
    stroke(this.player.color);
    fill("#000");
    text(this.score, 20, 40);
    stroke("#fff");
    noFill();
  }
}

/*  event names
 *  ["death", "focus", "blur"]
 */
