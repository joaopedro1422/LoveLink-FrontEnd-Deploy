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
   mensagemEnviada : boolean = false;
   carregandoLogin : boolean = false
  email = '';
  emailNovo = '';
  senha = '';
  constructor( private http: HttpClient, private router: Router) {}
  enviaSolicitacao() {
    const mensagem = {email: this.emailNovo, nome: 'Novo parceiro', mensagem: 'Olá, solicito maiores informações sobre o sistema de Parceria da LoveLink'}
    this.http.post(`${apiUrl}/api/confirmacao-email/enviaMensagemSuporte`, mensagem).subscribe({
      next: (response:any) => {
        this.errorMessage = '';
        this.mensagemEnviada = true;
      
      },
      error: (err) => {
        this.errorMessage = 'Email ou senha incorretos.';
      }
    });
  }
  onSubmit() {
    const loginData = {email: this.email, senha: this.senha};
    this.carregandoLogin = true;
    this.http.post(`${apiUrl}/parceiros/loginParceiro`, loginData).subscribe({
      next: (response:any) => {
        this.errorMessage = '';
        this.carregandoLogin = false;
        localStorage.setItem('uuidParceiro', response.id);
        this.router.navigate([`/areaParceiro`])
      
      },
      error: (err) => {
        this.errorMessage = 'Email ou senha incorretos.';
           this.carregandoLogin = false;
      }
    });
  }
}
