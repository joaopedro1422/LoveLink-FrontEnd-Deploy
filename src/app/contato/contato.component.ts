import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/api';


const apiUrl = `${environment.apiUrl}`;
@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent {
  bodyMensagem= {
    nome: '',
    email: '',
    mensagem: ''
  };
  errorMessage = '';

  constructor( private http: HttpClient) {
          }
  enviarMensagem(){
    if(this.bodyMensagem.nome !== '' &&  this.bodyMensagem.email !== '' && this.bodyMensagem.mensagem !== ''){
      try{
         this.http.post<any>(`${apiUrl}/api/confirmacao-email/enviaMensagemSuporte`, this.bodyMensagem).subscribe({
          next: (response:any) => {         
            console.log(response)        
          },
          error: (err) => {
            
          }
        });
      }catch(error){
        console.log(error)
      }
         
    }
    else{
      this.errorMessage = 'Todos os campos precisam ser preenchidos'
    }

  }
}
