import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  toggleDarkMode() {
      if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
          document.documentElement.setAttribute('data-bs-theme','light')
      }
      else {
          document.documentElement.setAttribute('data-bs-theme','dark')
      }
  }
  
}
