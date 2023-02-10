const posFrom = (pos, size) => {
  return createVector(pos.x - size / 2, pos.y - size / 2);
};

const opponentRandomPos = () => {
  const x = random(40, width - 40);
  return createVector(x, 40);
};

const getKeyDownHandler = (player) => {
  return (e) => {
    const { key } = e;
    if (key === "ArrowLeft") {
      player.direction = -1;
    } else if (key === "ArrowRight") {
      player.direction = 1;
    }
    if (key === " ") {
      player.setIsShooting(true);
    }
  };
};

const getKeyUpHandler = (player) => {
  return (e) => {
    const { key } = e;
    if (key === "ArrowRight" && player.direction === 1) {
      player.direction = 0;
    } else if (key === "ArrowLeft" && player.direction === -1) {
      player.direction = 0;
    }
    if (key === " ") {
      player.setIsShooting(false);
    }
  };
};

const getOnFocusHandler = (world) => {
  return () => {
    world.focused = true;
    world.emitEvent("focus");
  };
};

const getOnBlurHandler = (world) => {
  return () => {
    world.focused = false;
    world.emitEvent("blur");
  };
};
