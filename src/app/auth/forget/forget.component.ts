import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  constructor() { }
  forg = new FormGroup({
    userID: <any>new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
  }
  frog(){

  }
}
