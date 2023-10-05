var canvas = null;
var ctx = null;

const FPS = 30;
const INTERVAL = 1000/30; // Number of ms per frame
const WIDTH = 960;
const HEIGHT = 540;
const MAX_PLAYERS = 4;

$(document).ready(function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    setup();

    setInterval(function(){
        update();
    }, INTERVAL);

    $('#canvas').on("mousedown", mousedown);
    $('#canvas').on("mouseup", mouseup);
    $('#canvas').on("mousemove", mousemove);
    
});

let blocks = [];
let circles = [];
let players = [];

let next_block = null;
let next_player = null;

let mode = "blocks";
let last_loc = {x: 0, y:0};

function setup() {
    circles.push(new Circle(400,400));
    blocks.push(new Block(100, 100, 20, 200));
}

function update() {
    ctx.fillStyle= "#000000";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    
    for(var i=0;i<circles.length;i++){
        circles[i].draw(ctx);
    }
    
    for(var i=0;i<blocks.length;i++){
        blocks[i].draw(ctx);
    }

    for(var i=0;i<players.length;i++){
        players[i].draw(ctx,null,null);
    }
    
    if(next_block!==null){
        next_block.draw(ctx);
    }
    
    if(next_player!==null){
        console.log("Draw the player");
        next_player.draw(ctx, last_loc.x, last_loc.y);
    }

    // Debug information
    ctx.font = "24px arial";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("X: " + last_loc.x + ", Y: " + last_loc.y , 10, HEIGHT - 20);
    ctx.fillText("Mode: " + mode , 10, 30);
    
    if(mode == "players") {
        if(next_player !== null){
            ctx.fillText("Rot: " + next_player.rot, 10, HEIGHT - 40);
            ctx.fillText("Power: " + next_player.power, 10, HEIGHT - 60);
        }
    }

}

function mousedown(e) {
    var parentOffset = $(this).parent().offset(); 
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top;

    if(mode == "blocks"){
        if(next_block != null) {
            console.log("Error next block is not null");
            next_block = null;
            return;
        }
       
        next_block = new Block(relX, relY, 0, 0);
        next_block.color = "#00ff00";
    } else if (mode == "circles") {
        circles.push(new Circle(relX, relY));
    } else if (mode == "players") {
        next_player = new Player(relX, relY);
    }   
}

function mousemove(e) {
    var parentOffset = $(this).parent().offset(); 
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top;
    last_loc = {x: relX, y: relY};

    if (next_block!== null) {
        next_block.size.x = relX - next_block.loc.x;
        next_block.size.y = relY - next_block.loc.y;
    } 

    if (next_player !== null) {
        next_player.update(relX, relY);
    }
}

function mouseup(e) {
    if (mode == "blocks") {
        next_block.color = "#ff0000";
        blocks.push(next_block);
        next_block = null;
    }  
    
    if (mode == "players") {
        if(next_player === null){
            return;
        }

        if(players.length >= MAX_PLAYERS) {
            players.shift();
        }
        players.push(next_player);
        next_player = null;
    }
   
}

function clear_blocks(){
    blocks = [];
}

function remove_previous() {
    blocks.pop();
}

function select(new_mode) {
    mode = new_mode;
}