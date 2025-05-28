import { Component,OnInit, OnChanges, } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/api';
import { Pagina } from '../models/pagina';
const apiUrl = `${environment.apiUrl}`;
@Component({
  selector: 'app-area-parceiro',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './area-parceiro.component.html',
  styleUrl: './area-parceiro.component.css'
})
export class AreaParceiroComponent implements OnInit{
  parceiro : any | null = null
  parceiroId : string | null = '';
  listaPaginas: any[] = []
   constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    }
  async ngOnInit(): Promise<void> { 
    this.parceiroId =  localStorage.getItem('uuidParceiro');
    this.route.paramMap.subscribe((params) => {
      this.handleRouteParams2(params);
    });
  }
   private async handleRouteParams2(params: ParamMap): Promise<void> {
      try {   
        if(this.parceiroId===null){
          this.router.navigate(['/loginParceiro'])
          return 
        }
        this.http.get<any>(`${apiUrl}/parceiros/getParceiro/${this.parceiroId}`).subscribe((res) => {
          this.parceiro = res;
          console.log(res);
          this.carregaPaginas();
        }, (err)=> {
          alert("Erro ao buscar pagina");
        })
        
      }
      catch (error ){
        console.log()
      }
    }
    goToCadastroParceiro(){
      this.router.navigate(['cadastraPaginaParceiro']);
    }

    logout(){
      localStorage.removeItem('uuidParceiro');
      this.router.navigate(['/loginParceiro']);
    }

    redirectToEdit(slug : string, id : number){
       this.router.navigate([`/editaPagina/${slug}/${id}`]);
    }

    carregaPaginas(){
      try{
        this.http.get<Pagina[]>(`${apiUrl}/paginas/${this.parceiroId}/paginasParceiro`).subscribe((res)=> {
          console.log(res)
          this.listaPaginas = res;
        
        })
      }catch (error ){
        console.log(error)
      }
    }
}
