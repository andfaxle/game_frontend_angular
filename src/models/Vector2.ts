


export class Vector2 {
    
    x: number;
    y: number;

    constructor(x:number,y:number){
        this.x = x;
        this.y = y;
    }

    add(v : Vector2): Vector2{
        return new Vector2(this.x + v.x,this.y + v.y);
    }

    substract(v : Vector2) : Vector2{
        return new Vector2(this.x - v.x,this.y - v.y);
    }

    rotate(theta: number) : Vector2 {

        theta *= 0.0174533;

        let cs = Math.cos(theta);
        let sn = Math.sin(theta);
        let px = this.x * cs - this.y * sn; 
        let py = this.x * sn + this.y * cs;

        return new Vector2(px,py);
    }


}