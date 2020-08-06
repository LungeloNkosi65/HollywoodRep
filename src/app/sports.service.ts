import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { from } from 'rxjs';
import {Sport} from './iSports';
import {Soccer} from './iSoccer';
import {SoccerCupon} from './Models/soccerCupon';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SportsService {
  private rootUrl=environment.rootUrl;
  private param='SoccerCupons'
  private jsonUrl="https://localhost:44365/api/sports";
  private soccerJson="assets/Soccer.json";

  constructor(private _htt:HttpClient,private errorHandlerService:ErrorHandlerService) {

   }

  getSports():Observable<Sport[]>{
    return this._htt.get<Sport[]>(this.jsonUrl);
  }

  getSoccer():Observable<Soccer[]>{
    return this._htt.get<Soccer[]>(this.soccerJson);
  }
  getCupons():Observable<SoccerCupon[]>{
    return this._htt.get<SoccerCupon[]>(`${this.rootUrl}${this.param}`)
    .pipe(catchError(this.errorHandlerService.handleError));
  }



  
}
