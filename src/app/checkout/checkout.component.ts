import { Component, OnInit , AfterViewInit, OnDestroy} from '@angular/core';
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
export class CheckoutComponent implements AfterViewInit,OnInit , OnDestroy{
  private bricksBuilder: any;
  private cardPaymentBrickController: any;
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

  constructor(private checkoutService: CheckoutServiceService, private router: Router, private paginaService: PaginaServiceService, private http: HttpClient ,private mpService: MercadoPagoServiceService) {}

   async ngAfterViewInit() {
     
   
  }
   ngOnDestroy(): void {
    if (this.cardPaymentBrickController) {
      this.cardPaymentBrickController.unmount();
    }
  }
 async renderCardPaymentBrick() {
    const mp = new MercadoPago('TEST-4680fad6-5fa1-46f2-b9e7-7068baa77e08', {
      locale: 'pt-BR',
    });

    const bricksBuilder = mp.bricks();

    this.cardPaymentBrickController = await bricksBuilder.create(
      'cardPayment',
      'cardPaymentBrick_container',
      {
        initialization: {
          amount: 100,
          payer: {
            email: '',
          },
        },
        customization: {
          visual: {
            style: {
              theme: 'dark',
              customVariables: {},
            },
          },
          paymentMethods: {
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {
            console.log('Brick pronto!');
          },
          onSubmit: (cardFormData: any) => {
            return new Promise((resolve, reject) => {
              fetch('https://lovelink-backend-deploy.onrender.com/api/payment/card', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardFormData),
              })
                .then((response) => response.json())
                .then((result) => {
                  console.log('Pagamento enviado com sucesso', result);
                  resolve(result);
                })
                .catch((error) => {
                  console.error('Erro ao processar o pagamento', error);
                  reject(error);
                });
            });
          },
          onError: (error: any) => {
            console.error('Erro do Brick:', error);
          },
        },
      }
    );
  }


  ngOnInit(): void {
    
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
    if (this.cartaoOpen){
      this.pixOpen = false;
        setTimeout(() => {
      this.renderCardPaymentBrick();
    }, 100);
    } else {
    if (this.cardPaymentBrickController) {
      this.cardPaymentBrickController.unmount();
    }
  }
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
    const cardPaymentDTO = {
      transactionAmount: this.valorPlanoSelecionado,
      description: "Página Personalizada LoveLink",
      installments: 1,
      paymentMethodId: 'visa', // ajuste conforme o método identificado
      payer: {
        email: this.cardData.email,
        identification: {
          type: this.cardData.identificationType,
          number: this.cardData.identificationNumber,
        },
      },
      token: '',

    };
    const [month, year] = this.cardData.validade.split('/');
     this.cardData.expirationMonth = month;
      this.cardData.expirationYear = '20' + year; 
     const cardTokenData = {
      cardNumber: this.cardData.cardNumber,
      cardholderName: this.cardData.cardholderName,
      expirationMonth: this.cardData.expirationMonth,
      expirationYear: this.cardData.expirationYear,
      securityCode: this.cardData.securityCode,
      identificationType: this.cardData.identificationType,
      identificationNumber: this.cardData.identificationNumber,
      email: this.cardData.email,
    };
    this.mpService.generateCardToken(cardTokenData).then(
      (tokenResponse: any) => {
        cardPaymentDTO.token = tokenResponse.id;
        this.mpService.payWithCard(cardPaymentDTO).subscribe(
          (res) => {
            this.carregandoRegistro = false;
            alert('Pagamento aprovado! ID: ');
          },
          (err) => {
            this.carregandoRegistro = false;
            alert('Erro no pagamento: ' + err.message);
          }
        );
      },
      (err) => {
        this.carregandoRegistro = false;
        alert('Erro ao gerar token do cartão: ' + err.message);
      }
    );
  }
    
}



