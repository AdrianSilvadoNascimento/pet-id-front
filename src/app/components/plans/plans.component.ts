import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  buyPlan(plan: string): void {
    localStorage.setItem('plan', plan)
    this.router.navigate(['/'])
  }
}
