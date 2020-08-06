import { Injectable } from '@angular/core';
import { BounusTable } from '../Models/bonusTable';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { IBetTbl, IBetSLip } from '../Models/ISubmitBet';
import {ErrorHandlerService} from './error-handler.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BonusTableService {
  private bonusJson = "assets/bonus.json";
  rootUrl=environment.rootUrl;
  param='BonusTbls/'
  paramGet='GetAll'

  constructor(private httpClient:HttpClient,private errohandler:ErrorHandlerService) { }

  getBonusTable(): Observable<BounusTable[]> {
    return this.httpClient.get<BounusTable[]>(`${this.rootUrl}${this.param}${this.paramGet}`)
    .pipe(catchError(this.errohandler.handleError));
  }

}
