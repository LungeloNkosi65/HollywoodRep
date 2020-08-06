import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Market} from './Models/iMarket';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './services/error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class MarketService {
private marketUrl='https://localhost:44365/api/markets?';
private _betTypeId='betTypeId='
  constructor(private _http:HttpClient,private errorHandlerService:ErrorHandlerService) { }

  getMarketForBetTyp(betTypeId:number):Observable<Market[]>{
    return this._http.get<Market[]>(`${this.marketUrl}${this._betTypeId}${betTypeId}`)
    .pipe(catchError(this.errorHandlerService.handleError));
  }
}
