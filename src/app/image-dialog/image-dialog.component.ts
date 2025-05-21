
import { Component, Inject, OnInit } from '@angular/core';
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
export class ImageDialogComponent implements OnInit {
  imageUrl: string = '';
  descricao: string ='';
  data_const: Date | null = null;
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {  imagePath?: string, descricao?: string, data?: Date}
  ) {}
  ngOnInit(): void {
    
    this.getImage();
    if(this.data.descricao)
    this.descricao = this.data.descricao

    if(this.data.data)
      this.data_const = this.data.data;
  }
  getImage() {
    const storage = getStorage();
    if(this.data.imagePath){
      this.imageUrl = this.data.imagePath;
    }
  
  
  
}

  close(): void {
    this.dialogRef.close();
  }
  removerFoto() {
  this.dialogRef.close({ remover: true, imagePath: this.imageUrl });
}
}
