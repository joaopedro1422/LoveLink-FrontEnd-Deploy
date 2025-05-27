import { Component,OnInit, OnChanges, } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NgModel } from '@angular/forms';
import { ControlContainer, FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/api';
import { Pagina } from '../models/pagina';
import { YoutubeService } from '../youtube.service';
import { getStorage, ref, listAll,deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';

const apiUrl = `${environment.apiUrl}`;
@Component({
  selector: 'app-edita-pagina',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './edita-pagina.component.html',
  styleUrl: './edita-pagina.component.css'
})
export class EditaPaginaComponent implements OnInit {
    paginaData: any = {};
    Id: string | null = null;
    slug: string | null = null;
    searchQuery = '';
    youtubeResults: any[] = [];
    selectedVideoId: string | null = null; 
    searchTerm: string = '';
    searchResults: any[] = [];
    firebasePaths: string[] = [];

     constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private youtubeService: YoutubeService) {
        }
    async ngOnInit(): Promise<void> { 
        let parceiroId =  localStorage.getItem('uuidParceiro');
        if(!parceiroId){
          this.router.navigate(['/inicio']);
          return
        }
        this.route.paramMap.subscribe((params) => {
          this.handleRouteParams(params);
        });
      }
       private async handleRouteParams(params: ParamMap): Promise<void> {
          try {
            this.slug = params.get('slug');
            this.Id = params.get('id');           
            this.http.get<Pagina>(`${apiUrl}/paginas/${this.slug}/${this.Id}`).subscribe((res) => {
              console.log(res);
              this.paginaData = res;
            
            }, (err)=> {
              alert("Erro ao buscar pagina");
            })
            
          }
          catch (error ){
            console.log()
          }
        }

      atualizaPagina(){
        try{
          this.http.put(`${apiUrl}/paginas/${this.slug}/${this.Id}/update`, this.paginaData).subscribe((res)=> {
            console.log(res);
            this.router.navigate(['/areaParceiro']);
          })
        }catch(error ){
          console.log(error)
        }
      }
       async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (input.files) {
          const newFiles = Array.from(input.files);
      
          for (let file of newFiles) {
            const storage = getStorage();
            const path = `imagens/${this.paginaData.autor}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, path);
            try {
              await uploadBytes(storageRef, file); 
              const url = await getDownloadURL(storageRef); 
              this.paginaData.imagens.push(url); 
               this.firebasePaths.push(path);  
            } catch (error) {
              console.error("Erro ao enviar imagem:", error);
            }
          }
        }
      }
      async removeImage(index: number): Promise<void> {
        const storage = getStorage();
        const path = this.firebasePaths[index]; // Pega o caminho salvo

        try {
          const imageRef = ref(storage, path);
          await deleteObject(imageRef); // Remove do Firebase
          console.log('Imagem removida do Firebase com sucesso');
        } catch (error) {
          console.error('Erro ao remover imagem do Firebase:', error);
        }

        // Remove da interface e dos arrays locais
        this.paginaData.imagens.splice(index, 1);
        this.firebasePaths.splice(index, 1);
      }


      selectVideo(videoId: string): void {   
      if(this.paginaData.videoId === videoId){
        this.paginaData.videoId = '';
        return 
      } 
      this.paginaData.videoId = videoId;
      this.paginaData = { ...this.paginaData };
    }
    debounceTimer: any;
    onSearchChange() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchYoutube();
      }, 400); // espera 500ms após parar de digitar
}
 searchYoutube() {
    if (!this.searchQuery.trim()) return;
    this.youtubeService.searchVideos(this.searchQuery).subscribe((res: any) => {
      this.youtubeResults = res.items;
    });
  }
}
