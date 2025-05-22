import { Component, OnInit } from '@angular/core';
import { CheckoutServiceService } from '../checkout-service.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginaServiceService } from '../services/pagina-service.service';
import { Pagina } from '../models/pagina';
import { HttpClient } from '@angular/common/http';
import { MercadoPagoServiceService } from '../services/mercado-pago-service.service';
import { environment } from '../../environments/api';
const apiUrl = `${environment.apiUrl}`;
declare var MercadoPago: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  formData: any;
  pixOpen = false;
  cartaoOpen = false;
  registroCompleto = false;
  parcelas = [1, 2, 3, 4, 5, 6];
  parcelaSelecionada = 1;
  primeiroNome = '';
  carregandoRegistro = false;
  planoSelecionado: string | null = null;
  valorPlanoSelecionado: number | null = null;
  mp: any;
  cardForm: any;

  constructor(private checkoutService: CheckoutServiceService, private router: Router, private paginaService: PaginaServiceService, private http: HttpClient ,private mpService: MercadoPagoServiceService) {}

  ngOnInit(): void {
    this.mp = new MercadoPago('TEST-4680fad6-5fa1-46f2-b9e7-7068baa77e08', {
      locale: 'pt-BR',
    });
    this.cardForm = this.mp.cardForm({
      amount: String(this.valorPlanoSelecionado),
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: { id: "form-checkout__cardNumber", placeholder: "Número do cartão" },
        expirationDate: { id: "form-checkout__expirationDate", placeholder: "MM/AA" },
        securityCode: { id: "form-checkout__securityCode", placeholder: "CVV" },
        cardholderName: { id: "form-checkout__cardholderName", placeholder: "Nome no cartão" },
        issuer: { id: "form-checkout__issuer", placeholder: "Banco emissor" },
        installments: { id: "form-checkout__installments", placeholder: "Parcelas" },
        identificationType: { id: "form-checkout__identificationType", placeholder: "Tipo de documento" },
        identificationNumber: { id: "form-checkout__identificationNumber", placeholder: "Número do documento" },
        cardholderEmail: { id: "form-checkout__cardholderEmail", placeholder: "E-mail" },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) console.warn("Form Mounted error: ", error);
        },
        onFetching: (resource: any) => {
          const progressBar = document.querySelector(".progress-bar") as HTMLProgressElement;
          progressBar.removeAttribute("value");
          return () => progressBar.setAttribute("value", "0");
        }
      }
    });
    this.formData = this.paginaService.getDadosPagina();
    if (!this.formData) {
      // redirecionar ou tratar erro
    }
    this.loadValoresPlanos();
    this.primeiroNome = this.getPrimeiroNome(this.formData.autor);
  }
  
 loadValoresPlanos(){
 
  this.http.get<any>(apiUrl+ `/planos/${this.formData.planoSelecionado}`).subscribe((res)=> {
    this.valorPlanoSelecionado = res.preco;
    this.planoSelecionado = res.nome;

  })
 }
  confirmaCompra(){
    this.registroCompleto = true;
  }
  getPrimeiroNome(nome: string){
    return nome.trim().split(' ')[0]
  }

  togglePix() {
    this.pixOpen = !this.pixOpen;
    if (this.pixOpen) this.cartaoOpen = false;
  }

  toggleCartao() {
    this.cartaoOpen = !this.cartaoOpen;
    if (this.cartaoOpen) this.pixOpen = false;
  }
  revisar(){
    this.router.navigate(['/criarCarta'])
  }
  registrarPagina(){
    console.log(this.formData)
  this.carregandoRegistro = true;
  this.http.post<Pagina>(apiUrl+ '/paginas', this.formData)
    .subscribe((res) => {
      console.log("pagina registrada com sucesso"+res)
      this.registroCompleto = true;
      this.carregandoRegistro = false
    }, (err) => {
      alert('Erro ao registrar página:' + err);
    })
}
cardData = {
    cardNumber: '',
    cardholderName: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    identificationType: 'CPF',
    identificationNumber: '',
    email: '',
    validade: '',
  };

pagarCartao() {
  this.carregandoRegistro = true;

    const {
      paymentMethodId,
      issuerId,
      cardholderEmail,
      amount,
      token,
      installments,
      identificationNumber,
      identificationType,
    } = this.cardForm.getCardFormData();

    const dto = {
      transactionAmount: Number(amount),
      description: "Página Personalizada LoveLink",
      paymentMethodId,
      issuer_id: issuerId,
      token,
      installments: Number(installments),
      payer: {
        email: cardholderEmail,
        identification: {
          type: identificationType,
          number: identificationNumber,
        }
      }
    };

    this.mpService.payWithCard(dto).subscribe(
      (res) => {
        this.carregandoRegistro = false;
        alert('Pagamento aprovado!');
      },
      (err) => {
        this.carregandoRegistro = false;
        alert('Erro no pagamento: ' + err.message);
      }
    );
  }
    
}



