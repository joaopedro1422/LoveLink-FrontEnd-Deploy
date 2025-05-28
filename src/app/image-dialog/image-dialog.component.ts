
import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonModule , NgFor, NgForOf, NgIf} from '@angular/common'; 
@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgForOf],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css'
})
export class ImageDialogComponent{
  @Input() imageUrl: string = '';
  @Input() descricao: string = '';
 @Input() data_const!: any; // use 'Date' se for uma data, ou o tipo correto
  @Input() mostrar = false;

  @Output() fechar = new EventEmitter<void>();
  @Output() remover = new EventEmitter<string>();
  fecharModal() {
    this.fechar.emit();
}
    removerFoto() {
    this.remover.emit(this.imageUrl);
  }
}
