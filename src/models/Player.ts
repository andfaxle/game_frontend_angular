import { Vector2 } from "./Vector2";

export class Player {
    constructor(pos: Vector2,angle: number) {
        this.pos = pos;
        this.angle = angle;
    }

    size : number = 20;
    speed: number = 200;
    angle_speed: number = 200;
    color: string;

    pos:Vector2;

    angle: number = 0;

    set(pos:Vector2,angle:number){
        this.pos = pos;
        this.angle = angle;
    }

    draw(color: string,ctx) {
       
        ctx.beginPath();

        ctx.fillStyle = color;

        let center = new Vector2(this.pos.x,this.pos.y);


        let peak1 = new Vector2(0,-this.size);
        peak1 = peak1.rotate(this.angle);

        let p1 = center.add(peak1);
        ctx.moveTo(p1.x,p1.y);

        let peak2 = new Vector2(this.size,this.size/2);
        peak2 = peak2.rotate(this.angle);

        let p2 = center.add(peak2);
        ctx.lineTo(p2.x,p2.y);

        ctx.lineTo(center.x,center.y);
        
        let peak3 = new Vector2(-this.size,this.size/2);
        peak3 = peak3.rotate(this.angle);

        let p3 = center.add(peak3);
        ctx.lineTo(p3.x,p3.y);
        ctx.lineTo(p1.x,p1.y);
        
        ctx.fill(); 

        
    }

    foreward(updateFrequency : number){
        let v = new Vector2(0,-this.speed * updateFrequency);
        v = v.rotate(this.angle);

        this.pos = this.pos.add(v);
    }

    rotateLeft(updateFrequency : number){
        this.angle -= this.angle_speed * updateFrequency;

    }
    
    rotateRight(updateFrequency : number){
        this.angle += this.angle_speed * updateFrequency;
    }


}