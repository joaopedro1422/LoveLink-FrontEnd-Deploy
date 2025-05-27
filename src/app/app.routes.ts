
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartaComponent } from './pages/carta/carta.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { CadastrarPaginaComponent } from './cadastrar-pagina/cadastrar-pagina.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TermosComponent } from './termos/termos.component';
import { PrivacidadeComponent } from './privacidade/privacidade.component';
import { ContatoComponent } from './contato/contato.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { LoginParceiroComponent } from './login-parceiro/login-parceiro.component';
import { AreaParceiroComponent } from './area-parceiro/area-parceiro.component';
export const routes: Routes = [

    { path: 'inicio', component: PaginaInicialComponent },
    { path: 'criarCarta', component: CadastrarPaginaComponent } ,
      { path: 'checkout', component: CheckoutComponent } ,
      {path: 'termos', component: TermosComponent},
      {path: 'privacidade', component: PrivacidadeComponent},
      {path: 'contato', component: ContatoComponent},
      {path:'qrCode/:slug/:id', component: QrcodeComponent},
      {path:'loginParceiro', component: LoginParceiroComponent},
      {path:'areaParceiro', component: AreaParceiroComponent},
      { path: ':slug/:id', component: CartaComponent }, 
    { path: '**', component: PaginaInicialComponent , pathMatch: 'full' },
   
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { };