import { Component, OnInit } from '@angular/core'
import {faTriangleExclamation, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {
  faTriangleExclamation = faTriangleExclamation
  faCircleExclamation = faCircleExclamation
  constructor() { }

  ngOnInit(): void {
  }
}
