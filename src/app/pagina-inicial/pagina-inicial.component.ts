
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
      foto: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      nome: 'Ana clara',
      mensagem: 'Criei a página pra enviar o qrcode junto com o presente de aniversário do meu namorado, ele gostou muito, principalmente do nosso álbum',
      foto: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    {
      nome: 'Paulo Garcia',
      mensagem: 'A experiência foi ótima, minha namorada gostou muito. vamos colocar o Qr code em uma moldura no nosso quarto.',
      foto: 'https://randomuser.me/api/portraits/women/12.jpg'
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
