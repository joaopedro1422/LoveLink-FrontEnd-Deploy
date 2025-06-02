
import { Component, OnInit ,ViewChild, ViewEncapsulation , ElementRef} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule , NgFor, NgForOf, NgIf} from '@angular/common'; 
import { initializeApp } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Importação necessária
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [NgFor, NgForOf, HeaderComponent, FooterComponent],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css'
})
export class PaginaInicialComponent {
  depoimentos = [
    {
      nome: 'José lucas',
      mensagem: 'Minha namorada curtiu bastante, acho que acertei nas musicas da playlist kkkkkk vamos continuar adicionando fotos no album em ocasioes especiais.',
      foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/casal-jovem-e-bonito-caminhando-ao-ar-livre-em-um-dia-ensolarado.jpg?alt=media&token=2a1a4b1a-0f87-43b4-a61c-a6e9123593a4'
    },
    {
      nome: 'Ana clara',
      mensagem: 'Criei a página pra enviar o qrcode junto com o presente de aniversário do meu namorado, ele gostou muito, principalmente do nosso álbum',
      foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/image1.jpg?alt=media&token=15fbe265-d3b6-49b1-90fd-d814f7241cea'
    },
    {
      nome: 'Paulo Garcia',
      mensagem: 'A experiência foi ótima, minha namorada gostou muito. Gostei da facilidade para criar e dos detalhes visuais da pagina, tudo muito bonito',
      foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/retrato-de-adoravel-casal-apaixonado.jpg?alt=media&token=991227c8-a786-4613-b5c7-36b43e3cf269'
    },
    {
      nome: 'Beatriz Silva',
      mensagem: 'Gostei bastante da dinâmica e dos recursos que a página oferece. Meu namorado gostou bastante e pediu até pra colocarmos o qrCode em uma moldura.',
      foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/close-up-couple-taking-selfie.jpg?alt=media&token=e08a32dd-7c1c-43e2-9713-7f30f0b18f40'
    },
      {
    nome: 'Camila e João',
    mensagem: 'A página ficou linda! usei como surpresa junto com uma cesta de chocolates no nosso aniversário de namoro.',
    foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/casal-feliz-juntos-no-parque.jpg?alt=media&token=27bbf4ed-b806-493f-9e20-a406a92ad882'
  },
  {
    nome: 'Lucas Almeida',
    mensagem: 'A ideia do álbum online foi genial. Minha namorada chorou quando viu as fotos e as músicas que escolhi.',
    foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/lindo-casal-passa-o-tempo-em-um-campo-de-verao.jpg?alt=media&token=206dae48-81bc-4dc0-8e3f-836ecb64475e'
  },
  {
    nome: 'Fernanda Costa',
    mensagem: 'Foi um presente muito criativo. Meu namorado adorou e ainda compartilhou com os amigos!',
    foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/image5.jpg?alt=media&token=b69c9d63-8baf-4188-9b89-cfeaf6674b5d'
  },
  {
    nome: 'Rafael e Juliana',
    mensagem: 'Transformamos o QR Code em um quadrinho para o nosso quarto. Ficou incrível!',
    foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/casal-adoravel-passando-um-tempo-juntos-no-dia-dos-namorados.jpg?alt=media&token=a340ade6-a332-4b39-bc6c-d6120bc491d3'
  },
  {
    nome: 'Tatiane Moraes',
    mensagem: 'Foi uma forma super especial de relembrar momentos únicos com meu amor. A interface é linda!',
    foto: 'https://firebasestorage.googleapis.com/v0/b/lovelink-imagens.firebasestorage.app/o/tiro-medio-sorridente-casal-posando-juntos.jpg?alt=media&token=15adac8f-b1be-47ba-93e4-4a813b3b188b'
  }
  ];
  constructor(private router: Router,  private sanitizer: DomSanitizer) {}
  ngOnInit() {
    
    this.iniciarCarrossel();
  }
  iniciarCarrossel() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.depoimentos.length;
    }, 5000); // troca a cada 5 segundos
  }
  getSafeUrl(videoId: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
}
  irParaCriarCarta() {
    this.router.navigate(['/criarCarta']);
  }
  currentIndex = 0;
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.depoimentos.length;
  }
  mudarDepoimento(index: number) {
    this.currentIndex = index;
  }
  goToPaginaExemplo(){
    this.router.navigate(['/daniel-e-rafaela/6']);
  }
  goToCriarCarta(){
    this.router.navigate(['/criarCarta']);
  }
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.depoimentos.length) % this.depoimentos.length;
  }

}
