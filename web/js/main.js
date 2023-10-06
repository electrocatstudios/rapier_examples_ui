var canvas = null;
var ctx = null;

const FPS = 30;
const INTERVAL = 1000/30; // Number of ms per frame
const WIDTH = 960;
const HEIGHT = 540;
const MAX_PLAYERS = 4;
const SCALE = 20;

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
        players[i].draw(ctx);
    }
    
    if(next_block!==null){
        next_block.draw(ctx);
    }
    
    if(next_player!==null){
        next_player.draw(ctx);
    }

    // Debug information
    ctx.font = "24px arial";
    ctx.fillStyle = "#ff0000";
    
    var locx = last_loc.x - WIDTH/2;
    var locy = last_loc.y - HEIGHT/2;
    
    ctx.fillText("X: " +  locx + ", Y: " + locy , 10, HEIGHT - 20);
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
    players = [];
    circles = [];
}

function remove_previous() {
    blocks.pop();
}

function select(new_mode) {
    mode = new_mode;
}

function submit() {
    var body = {Blocks:[], Users:[]};
    for(var i=0;i<blocks.length;i++) {
        var block = blocks[i];
        var pt = {x: block.loc.x + (block.size.x/2), y: block.loc.y + (block.size.y/2)};
        var loc = {"X": (pt.x - WIDTH/2)/SCALE, "Y": (pt.y-HEIGHT/2)/SCALE}
        body.Blocks.push({
            "Name": "Block" + i,
            "Location": loc,
            "Scale": {"X": (block.size.x/SCALE), "Y": (block.size.y/SCALE)}
        });
    }
    for(var i=0;i<players.length;i++) {
        var p = players[i];
        body.Users.push({
            "Location": {"X": (p.loc.x-WIDTH/2)/SCALE, "Y": (p.loc.y-HEIGHT/2)/SCALE},
            "Rotation": p.rot,
            "Power": p.power/PLAYER_MAX_POWER,
            "Color": {"R": 0, "G": 255, "B": 0}
        });
    }
    for(var i=0;i<circles.length;i++) {
        var p = circles[i];
        body.Users.push({
            "Location": {"X": (p.loc.x-WIDTH/2)/SCALE, "Y": (p.loc.y-HEIGHT/2)/SCALE},
            "Rotation": 0.0,
            "Power": 0.0,
            "Color": {"R": 255, "G": 255, "B": 255}
        });
    }

    // console.log(body);
    $('#submit_button').html("<span style='color:white'>Processing</span>");

    $.ajax({
        type: "POST",
        url: "/api/submit",
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function(e){
            console.log(e);
            let output = "<a href='/video/" + e.filename + "' target='_blank'>See Video</a>";
            output += "<a href='/json/" + e.filename + "' target='_blank'>See JSON</a>"
            $('#open_button').html(output);
            $('#submit_button').html("<span style='color:white'>Finished</span>");
        },
        error: function(e) {
            $('#submit_button').html("<span style='color:red'>Error during processing</span>");
            console.log("Error while submittting");
            console.log(e);
        }
      });

}