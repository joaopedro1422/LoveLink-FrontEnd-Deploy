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
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { precos} from '../../environments/precos';
const apiUrl = `${environment.apiUrl}`;

declare var MercadoPago: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule,
    FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements AfterViewInit,OnInit , OnDestroy{
  private bricksBuilder: any;
  private cardPaymentBrickController: any;
  formData: any;
  parceiro: any;
  pixOpen = false;
  cartaoOpen = false;
  registroCompleto = false;
  pagamentoAprovado = false;
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
    const mp = new MercadoPago('APP_USR-7941953569846694-052011-c9a80b76a1c4f0515732a479edd4b150-2093661193', {
      locale: 'pt-BR',
    });

    const bricksBuilder = mp.bricks();

    this.cardPaymentBrickController = await bricksBuilder.create(
      'cardPayment',
      'cardPaymentBrick_container',
      {
        initialization: {
          amount: 1, //this.valorPlanoSelecionado,
          payer: {
            email: '',
          },
        },
        customization: {
          visual: {
            style: {
              theme: 'dark',
                customVariables: {
										  formBackgroundColor: "#000000",
										  baseColor: "#00C851"
                  },
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
              if(!this.valorPlanoSelecionado){
                return;
              }
               const payload = {
                ...cardFormData,
                transactionAmount: 1, //this.valorPlanoSelecionado, // valor em reais
              };
              fetch('https://lovelink-backend-deploy.onrender.com/api/payment/card', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              })
                .then((response) => response.json())
                .then((result) => {
                  console.log('Pagamento enviado com sucesso', result);
                  console.log('ID do pagamento:', result.id); 
                   if (result.id) {
                     console.log('registrou a pagina')
                     console.log('status:', result.status)
                    this.registrarPagina(result.id);
               
                  } 
                  console.log("status:", result.status)
                 if(result.status === 'approved'){
                   this.pagamentoAprovado = true;
                    this.registroCompleto = true;
                 }
                 else{
                   this.registroCompleto = true;
                 }
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
      this.router.navigate(['/inicio']);
    }
    if(this.formData.idParceiro){
      this.getParceiro();
    }
    console.log(this.formData);
    this.loadValoresPlanos();
    this.primeiroNome = this.getPrimeiroNome(this.formData.autor);
  }
  
 loadValoresPlanos(){
   
      this.valorPlanoSelecionado = this.formData.valor;
      this.planoSelecionado = this.formData.planoSelecionado;
    
   
 }
  confirmaCompra(){
    this.registroCompleto = true;
  }
  getPrimeiroNome(nome: string){
    return nome.trim().split(' ')[0]
  }

  getParceiro(){
       try {   
        this.http.get<any>(`${apiUrl}/parceiros/getParceiro/${this.formData.idParceiro}`).subscribe((res) => {
          this.parceiro = res;
          console.log(res);
        }, (err)=> {
          alert("Erro ao buscar parceiro");
        })
        
      }
      catch (error ){
        console.log()
      }
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
    }, 50);
    } else {
    if (this.cardPaymentBrickController) {
      this.cardPaymentBrickController.unmount();
    }
  }
  }
  revisar(){
    this.router.navigate(['/criarCarta'])
  }

 
  registrarPagina(id :number){
    this.formData.pagamentoId = id;
    this.formData.status = "pendente";
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
cpf: string = '';
nome: string = '';
qrCodeBase64: string | null = null;
qrCode: string | null = null;


gerarPix() {
    const body = {
    transactionAmount: this.valorPlanoSelecionado, // ou o valor do carrinho
    description: 'Pagamento via Pix',
    paymentMethodId: 'pix',
    payer: {
      email: this.formData.email, // insira o email do usuário aqui
      identification: {
        type: 'CPF',
        number: this.cpf.replace(/\D/g, '')
      }
    },
    pagina: this.formData
  };


  this.http.post<any>('https://lovelink-backend-deploy.onrender.com/api/payment/pix', body)
    .subscribe((res) => {
      console.log("Pix gerado com sucesso")
      console.log(res.status);
      this.qrCodeBase64 = res.qrCodeBase64;
      this.qrCode = res.qrCode;
    }, err => {
      console.error('Erro ao gerar PIX', err);
    });
}

copiarCodigoPix() {
  if(this.qrCode)
  navigator.clipboard.writeText(this.qrCode).then(() => {
    
  }).catch(err => {
    console.error('Erro ao copiar:', err);
    alert('Não foi possível copiar o código Pix.');
  });
}

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
          (res:any) => {
            this.carregandoRegistro = false;
            if(res.id){
               this.registrarPagina(res.id)
               console.log("id da transaçao:", res.id);
              alert('Pagamento aprovado! ID: ');
            }
           
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



