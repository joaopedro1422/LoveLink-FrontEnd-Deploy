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
    this.renderCardForm();
    this.formData = this.paginaService.getDadosPagina();
    if (!this.formData) {
      // redirecionar ou tratar erro
    }
    this.loadValoresPlanos();
    this.primeiroNome = this.getPrimeiroNome(this.formData.autor);
  }
  renderCardForm() {
  this.cardForm = this.mpService.mp.cardForm({
    amount: 20,
    autoMount: true,
    form: {
      id: 'form-checkout',
      cardholderName: {
        id: 'form-checkout__cardholderName',
        placeholder: 'Nome como está no cartão'
      },
      cardholderEmail: {
        id: 'form-checkout__cardholderEmail',
        placeholder: 'seuemail@exemplo.com'
      },
      cardNumber: {
        id: 'form-checkout__cardNumber',
        placeholder: '0000 0000 0000 0000'
      },
      expirationDate: {
        id: 'form-checkout__expirationDate',
        placeholder: 'MM/AA'
      },
      securityCode: {
        id: 'form-checkout__securityCode',
        placeholder: 'CVV'
      },
      installments: {
        id: 'form-checkout__installments',
        placeholder: 'Parcelas'
      },
      identificationType: {
        id: 'form-checkout__identificationType',
        placeholder: 'Tipo de documento'
      },
      identificationNumber: {
        id: 'form-checkout__identificationNumber',
        placeholder: '999.999.999-99'
      },
      issuer: {
        id: 'form-checkout__issuer',
        placeholder: 'Banco emissor'
      }
    },
    callbacks: {
      onFormMounted: (error:any) => {
        if (error) return console.warn('Form mount error:', error);
      },
      onSubmit: (event:any) => {
        event.preventDefault(); // Evita envio automático
      },
      onFetching: (resource:any) => {
        console.log('Fetching resource:', resource);
      }
    }
  });
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
  email: '',
  identificationNumber: ''
};

async pagarCartao() {
  this.carregandoRegistro = true;
  try {
    const {
      token,
      paymentMethodId,
      issuerId,
      email,
      amount,
      installments,
      identificationNumber,
      identificationType
    } = this.cardForm.getCardFormData();

    const cardPaymentDTO = {
      transactionAmount: this.valorPlanoSelecionado,
      description: "Página Personalizada LoveLink",
      installments: Number(installments),
      paymentMethodId,
      issuerId,
      payer: {
        email,
        identification: {
          type: identificationType,
          number: identificationNumber
        }
      },
      token
    };

    this.mpService.payWithCard(cardPaymentDTO).subscribe(
      res => {
        this.carregandoRegistro = false;
        alert('Pagamento aprovado! ID: ' );
      },
      err => {
        this.carregandoRegistro = false;
        alert('Erro no pagamento: ' + err.message);
      }
    );
  } catch (err: any) {
    this.carregandoRegistro = false;
    alert('Erro ao gerar token do cartão: ' + err.message);
  }
}
    
}



