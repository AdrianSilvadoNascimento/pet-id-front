import { Component } from '@angular/core'

import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pet-id-web-front'
  constructor(private route: ActivatedRoute) {}

  shouldShowHeader(): boolean {
    return !this.route.firstChild?.snapshot.data['isShowHeader']
  }
}
