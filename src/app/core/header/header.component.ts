import { Component, Input, OnInit } from '@angular/core'

import { faBars, faBell } from '@fortawesome/free-solid-svg-icons'
import { UserService } from 'src/app/services/user-service.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() showHeader: boolean = true
  faBars = faBars
  faBell = faBell
  userAddress!: string
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userIsLoggedIn = localStorage.getItem('userId')
    
    if (userIsLoggedIn?.length) {
      this.userService.getUserInfo().subscribe(res => {
        this.userAddress = `${ res?.street_name }, ${ res?.house_number }`
      })
    }
  }

  checkout() {
    this.userService.checkout()
  }
}
