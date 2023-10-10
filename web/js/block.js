function Block(_x, _y, _w, _h) {
    this.loc = {x: _x, y: _y};
    this.size = {x: _w, y: _h};
    this.color = "#ff0000";
    this.draw = drawBlock;
}

function drawBlock(ctx) {
    let old_col = ctx.strokeStyle;

    ctx.strokeStyle = this.color;
    
    ctx.beginPath();
    ctx.rect(this.loc.x,this.loc.y, this.size.x, this.size.y);
    ctx.stroke();

    ctx.strokeStyle = old_col;
}

module.exports = Block;