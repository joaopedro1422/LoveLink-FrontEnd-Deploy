import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
     menuAberto = false;

      toggleMenu() {
        this.menuAberto = !this.menuAberto;
      }
}
