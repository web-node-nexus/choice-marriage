import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss']
})
export class CustomAlertComponent implements OnInit {

  auth_Info:any
  constructor(
    public modal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  public setup_profile(){
    this.modal.close();
    this.router.navigateByUrl('/setup/profile')
    

  }

}
