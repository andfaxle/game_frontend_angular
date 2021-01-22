import { Component, OnInit,ViewChild,ElementRef,Input} from '@angular/core';
import { HostListener } from '@angular/core';
import { Vector2 } from 'src/models/Vector2';
import { ServerConnectorService } from './server-connector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{


  constructor(private serverConnector: ServerConnectorService){
    this.serverConnector.connect();
    this.serverConnector.register("position_message",this.onPositionUpdate.bind(this));
    this.serverConnector.register("player_info",this.onInfoUpdate.bind(this));
    this.serverConnector.register("dead",this.onDead.bind(this));

  }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  

  private ctx: CanvasRenderingContext2D;

  map_width: number;
  map_height: number;

  @Input() name: string;

  joined = false;
  dead = false;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  onConnectButtonPressed(){
    this.join();
  }

  onDead(_dead){
    this.dead = true;
  }

  players_json = [];

  join(){
    if(this.name == null){
      return;
    }
    this.serverConnector.send("join",this.name);
    this.joined = true;
  }

  onInfoUpdate(json){
    this.players_json = json;
  }

  pressed_keys = [];

  shoot(){
    this.serverConnector.send("shoot",null);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) { 
    if(event.key == " "){
      this.shoot();
    }

    const index: number = this.pressed_keys.indexOf(event.key);
    if (index !== -1) {
        this.pressed_keys.splice(index, 1);
        this.onKeyChange();
    }  
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if(!this.pressed_keys.includes(event.key)) {
      this.pressed_keys.push(event.key);
      this.onKeyChange();
    }
  }

  onKeyChange(){
    if(this.joined){
      this.serverConnector.send("key_change",this.pressed_keys);
    }
  }

  onPositionUpdate(position_json){

    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw bullets
    var bullets = position_json["bullets"];
    var length_bullets = bullets.length;
    for (var i = 0; i < length_bullets; i++) {
      var x = bullets[i]["x"];
      var y = bullets[i]["y"];
      this.drawBullet(x,y,a);
    }

    // draw players
    var players = position_json["players"];
    var length_players = players.length;
    for (var i = 0; i < length_players; i++) {

      var x = players[i]["x"];
      var y = players[i]["y"];
      var a = players[i]["a"];
      var c = players[i]["c"];
      var n = players[i]["n"];
  
      var pos = new Vector2(x,y);
      this.drawPlayer(pos,a,c,n);

    }

    // finish drawing

    this.ctx.closePath();
  }

  size: number = 20;

  drawBullet(x:number,y:number,a:number){
    this.ctx.beginPath();

    this.ctx.fillStyle = "#ede0be";

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 3, 3, Math.PI / 4, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.fill(); 
  }

  drawPlayer(pos,angle,color: string,name) {
       
    this.ctx.beginPath();

    this.ctx.fillStyle = color;

    this.ctx.fillText(name, pos.x,pos.y +30);
    this.ctx.textAlign = "center";

    let center = new Vector2(pos.x,pos.y);


    let peak1 = new Vector2(0,-this.size);
    peak1 = peak1.rotate(angle);

    let p1 = center.add(peak1);
    this.ctx.moveTo(p1.x,p1.y);

    let peak2 = new Vector2(this.size,this.size/2);
    peak2 = peak2.rotate(angle);

    let p2 = center.add(peak2);
    this.ctx.lineTo(p2.x,p2.y);

    this.ctx.lineTo(center.x,center.y);
    
    let peak3 = new Vector2(-this.size,this.size/2);
    peak3 = peak3.rotate(angle);

    let p3 = center.add(peak3);
    this.ctx.lineTo(p3.x,p3.y);
    this.ctx.lineTo(p1.x,p1.y);

    this.ctx.fill();   
  }
}
