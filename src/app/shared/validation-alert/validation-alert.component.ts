import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'pzeon-validation-alert',
  templateUrl: './validation-alert.component.html',
  styleUrls: ['./validation-alert.component.scss']
})
export class ValidationAlertComponent implements OnInit {
  invalidControls:any;
  controls:any;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

}
