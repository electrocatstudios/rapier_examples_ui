function Circle(_x, _y) {
    this.loc = {x: _x, y: _y};
    this.size = 5;

    this.color = "#ffffff";

    this.draw = drawCircle;
}

function drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    // context.stroke();
}