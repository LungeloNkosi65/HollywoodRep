import { Injectable } from '@angular/core';
import  {HttpClient} from '@angular/common/http';
import {Event} from './Models/Ievent';
import { Observable, of, from } from 'rxjs';
import { CustomOdds } from './Models/customOdds';
import { ErrorHandlerService } from './services/error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
private rootUrl='https://localhost:44365/api/';
private param='events/EventsForTournament?'
private _tournamentId='tournamentId=';
private _oddaparam='Odd_s?tournamentId='
private _betType="&betTypeId="
  constructor(private _http:HttpClient,private erroHandlerService:ErrorHandlerService) { }

  getEventByTournament(tournamentId:number):Observable<Event[]>{
    return this._http.get<Event[]>(`${this.rootUrl}${this.param}${this._tournamentId}${tournamentId}`)
    .pipe(catchError(this.erroHandlerService.handleError));
  }

  getOddForTournament(tournamentId):Observable<CustomOdds[]>{
    return this._http.get<CustomOdds[]>(`${this.rootUrl}${this._oddaparam}${tournamentId}`)
    .pipe(catchError(this.erroHandlerService.handleError));
  }
}
