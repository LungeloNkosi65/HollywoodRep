import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BetType } from './ibetType';
import { ErrorHandlerService } from './services/error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BetTypeService {
  private betTypeUrl = 'https://localhost:44365/api/betTypes/'
  private _param = 'BetTypeForTournament?'
  private _tournamentId = 'tournamentId='
  
  constructor(private _http: HttpClient,private erroHandlerService:ErrorHandlerService) { }

  getBetTypeByTournament(tournamentId: number): Observable<BetType[]> {
    return this._http.get<BetType[]>(`${this.betTypeUrl}${this._param}${this._tournamentId}${tournamentId}`)
    .pipe(catchError(this.erroHandlerService.handleError));
  }
}
