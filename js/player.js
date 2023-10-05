function Player(_x, _y) {
    this.loc = {x: _x, y: _y};
    this.size = 5;
    this.color = "#00ff00";
    
    this.power = 0;
    this.rot = 0;
    
    this.draw = drawPlayer;
    this.update = updatePlayer;
}

function updatePlayer(cur_x, cur_y){
    // TODO: calculate power and rot
    let diff_x = cur_x - this.loc.x;
    let diff_y = cur_y - this.loc.y;

    let x_sq = diff_x * diff_x;
    let y_sq = diff_y * diff_y;

    let hyp = Math.sqrt(x_sq + y_sq);
    this.power = hyp;
    
    if(diff_x == 0) {
        if(diff_y >= 0) {
            this.rot = 0;
        }else if (diff_y < 0) {
            this.rot = Math.PI;
        }
    }else if (diff_y == 0) {
        if(diff_x > 0) {
            this.rot = Math.PI / 2;
        }else if(diff_x < 0) {
            this.rot = Math.PI * 1.5;
        }else{
            this.rot = 0;
        }
    } else {
        this.rot = Math.atan2(diff_x,diff_y);
    }

    if(this.rot < 0) {
        this.rot += Math.PI * 2;
    }else if(this.rot > Math.PI * 2){
        this.rot -= Math.PI * 2;
    }
    console.log("Power: " + this.power);
}

function drawPlayer(ctx, cur_x, cur_y) {
    let old_col = ctx.strokeStyle;
    let old_fill = ctx.fillStyle;

    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    if(cur_x !== null && cur_y !==null) {
        // Draw line to current point - to indicate power
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(this.loc.x, this.loc.y);
        ctx.lineTo(cur_x, cur_y);
        ctx.stroke();
    } else {
        let out_x = this.loc.x + (this.power * Math.sin(this.rot));
        let out_y = this.loc.y + (this.power * Math.cos(this.rot));

        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(this.loc.x, this.loc.y);
        ctx.lineTo(out_x, out_y);
        ctx.stroke();
    }


    ctx.strokeStyle = old_col;
    ctx.fillStyle = old_fill;
}