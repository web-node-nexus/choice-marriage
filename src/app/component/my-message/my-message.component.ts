import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-message',
  templateUrl: './my-message.component.html',
  styleUrls: ['./my-message.component.scss']
})
export class MyMessageComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  redirectToMessage(i:any){

    this.router.navigateByUrl('/chat/ns4kajir76_1702737949544_ns4kajir76')
  }

}
