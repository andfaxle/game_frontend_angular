import { Injectable} from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ServerConnectorService {

  constructor() { }

  socket;
  
  connect() {
    console.log("connecting");
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  register(name: String,callback: Function) {
    this.socket.on(name, function(msg){
      callback(msg);
    });
  }

  disconnect(){
    this.socket.disconnect();
  }

  send(name: String, message){
    this.socket.emit(name,message);
  }
}
