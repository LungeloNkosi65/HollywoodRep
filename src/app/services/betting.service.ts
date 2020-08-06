import { Injectable } from '@angular/core';
import {RecentBets} from '../Models/RecentBetsVm';
import {HttpClient} from '@angular/common/http';
import {catchError,map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BettingService {
rootUrl=environment.rootUrl;
param='Betting/RecentBets';
accountNumber:'?accountNumber=';

  constructor(private http:HttpClient,private errorHandlerService:ErrorHandlerService) { }

  getRecentBets(accountNumber:string):Observable<RecentBets[]>{
    return this.http.get<RecentBets[]>(`${this.rootUrl}${this.accountNumber}${accountNumber}`)
    .pipe(catchError(this.errorHandlerService.handleError));
  }


}
