import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var MercadoPago: any;
@Injectable({
  providedIn: 'root'
})
export class MercadoPagoServiceService {
  mp: any;
   constructor(private http: HttpClient) {
    this.mp = new MercadoPago('APP_USR-7941953569846694-052011-c9a80b76a1c4f0515732a479edd4b150-2093661193', {
      locale: 'pt-BR',
    });
  }
   generateCardToken(cardData: any) {
    return new Promise((resolve, reject) => {
      this.mp.createCardToken(cardData).then((response: any) => {
        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  }
    getPaymentMethods(bin: string): Promise<any[]> {
    return this.mp.getPaymentMethods({ bin });
  }
  payWithCard(cardPaymentDTO: any) {
    return this.http.post('https://lovelink-backend-deploy.onrender.com/api/payment/card', cardPaymentDTO);
  }
}
