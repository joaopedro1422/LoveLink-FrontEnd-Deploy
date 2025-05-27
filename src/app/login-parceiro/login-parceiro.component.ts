import { Component,OnInit, OnChanges } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/api';
const apiUrl = `${environment.apiUrl}`;
@Component({
  selector: 'app-login-parceiro',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './login-parceiro.component.html',
  styleUrl: './login-parceiro.component.css'
})
export class LoginParceiroComponent {
   errorMessage = '';
  email = '';
  senha = '';
  constructor( private http: HttpClient, private router: Router) {}
  
  onSubmit() {
    const loginData = {email: this.email, senha: this.senha};

    this.http.post(`${apiUrl}/parceiros/loginParceiro`, loginData).subscribe({
      next: (response:any) => {
        this.errorMessage = '';
        localStorage.setItem('uuidParceiro', response.id);
        this.router.navigate([`/areaParceiro`])
      
      },
      error: (err) => {
        this.errorMessage = 'Email ou senha incorretos.';
      }
    });
  }
}
