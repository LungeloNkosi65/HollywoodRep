import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, throttleTime } from 'rxjs/operators';
import { Soccer } from './iSoccer';
import { betSlip } from './betSlip';
import { BounusTable } from './Models/bonusTable';
import { BonusTableService } from './services/bonus-table.service';
// import {SubimtBet} from './Models/submitedBet';
import { environment } from 'src/environments/environment';
import {SubmitBet, IBetTbl,IBetSLip} from './Models/ISubmitBet'
import { error } from 'protractor';
import {ErrorHandlerService} from './services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BetSlipService {
  finalTotal: number = 0;
  item = [];
  _idCounter = 1;
  _currentStake:number=0;
  _value: betSlip;
  _multipleOdds = 0;
  _finalMultiple: number = 0;
  _bonusTable: BounusTable[] = [];
  _bonusPercent: number;
  _numberOflegs: number = 0;
  _multipleStake = 0;
  _Payout :number= 0;
  _isBetRelated: boolean = false;
  submitBet:SubmitBet;

  rootUrl='https://localhost:44365/api/Betting';





  private soccerJson = "assets/Soccer.json";
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private _http: HttpClient, private bonusTableService: BonusTableService,private errohandler:ErrorHandlerService) {
    this.getBonusTableForSerice();

  }

  addToBetSlip(event: any, punterChoice: any, odds: number) {
     this._value = {
      id: this._idCounter,
      betType: event.betType,
      eventType: event.sportName,
      event: event,
      selectionOdds: odds,
      punterBetChoice: punterChoice.MarketName,
      stake: 1,
      message: null,
      warning: false,
      payout: Number(odds*1),
      tournamentName: event.tournamentName,
      marketId:punterChoice.MarketId

    };
    // console.log('bet item',this._value)
    this._idCounter++;
    this.finalTotal += this._value.stake;
    this.getBonusPercent(this._idCounter - 1);
    this.checkRelatedBet(this._value);
    console.log('bet--', this._value);
  }

  //this will check the related bet again upon removal of item from bet slip and if the item being removed is related
  // to another one that is still on the bet slip the message of the remailning item will be set to null
  chengeRelatedStatusUponRemove(bet:any){
    var tempIndex=-1;
    var counter=0;
    for(let i=0;i<this.item.length;i++){
      if(this.item[i].event.EventId==bet.event.EventId){
       counter++;
       tempIndex=i;
        // this.item[i].message=null;
        // this._isBetRelated=false;
      }
    }
    console.log('items in betslip', this.item);
    console.log("Counter ", counter , "temp index ",tempIndex);

    if(counter==1){
      console.log("Counter inside", counter , "temp index ",tempIndex);
        this.item[tempIndex].message=null;
        this._isBetRelated=false;
    }
    
  }
  // this will check if the bet is related using the event id of the new item being added to the bet slip
  //and if it's related it will set the message of the new item to Related Leg
  checkRelatedBet(bet: any) {
    //this has to be done so that the first item that is added to the bet slip is also considerd for a multiple 86,87
    this._finalMultiple = 0;
    this.calculateMultipleOdds(bet.selectionOdds);
    
    if (this.item.length > 0) {
      this.item.forEach(function (betItem) {
        if (betItem.event.EventId === bet.event.EventId) {
          bet.message = `Leg Is Related `;
          betItem.message = `Leg  Is Related `;
        }
      });
      this.item.push(bet);
      this._betRelatesSetMethod(bet);
      
      // console.log('Is the best related', this._isBetRelated);
    }
    else {
      this.item.push(bet);
      // console.log('bet item without modification');
      console.log('Currently in betslip', this.item);
    }
  }

   _betRelatesSetMethod(bet:any){
     if(bet.message==null){
      this._isBetRelated=false;
     }
     else{
       this._isBetRelated=true;
     }
   }
   
  clearBetSlip() {
    this.finalTotal = 0;
    this.item.splice(0, this.item.length);
    this._idCounter = 1;
    this._multipleOdds = 0;
  }
  removeEvent(event: any) {
    var total = 0;
    this.finalTotal - (event.selectiondOdds * event.stake);
    this._idCounter = this._idCounter - 1;
    this._multipleOdds - (event.selectiondOdds);
    console.log('Item being removed', this.item.indexOf(event));
    this.item.splice(this.item.indexOf(event), 1);
    this.chengeRelatedStatusUponRemove(event);
  }

  calculateBetSlipTotalPayout(odds:number,stake:number) {
     this._Payout=odds*stake;
  }
  //ene of CalculateBetSlipTotal

  calculateMultipleOdds(odds: number) {
    this._multipleOdds += odds;
    // console.log('Odds passed',odds);
    // console.log('odss added to', this._multipleOdds);
    this._finalMultiple = Number(((this._multipleOdds * (this._bonusPercent / 100)) + this._multipleOdds).toFixed(2));
    // console.log('MultipleOdds', this._finalMultiple);
  }

  //this goes trough the multiple table to get the bons percent
  getBonusPercent(numberOflegs: number) {
    for (let index = 0; index < this._bonusTable.length; index++) {
      if (this._bonusTable[index].Legs == numberOflegs) {
        this._bonusPercent = this._bonusTable[index].BonusPercent;
        // console.log('Bonus percent is', this._bonusPercent)
      }
    }
  }


  calculateBetPayout(stake: number, odds, id: number) {
    this.item[id - 1].stake = stake;
    this.item[id - 1].payout = Number(stake * odds).toFixed(2);
    // console.log('submited value',stake)
    if(stake>this._currentStake){ //this check the value when clicking the decrese button on the bet slip
      // console.log('old value', this._currentStake)
      // console.log('new value', stake)
    this.finalTotal+=(Number(stake)-this._currentStake);  
      this._currentStake=Number(odds);
      
    }
    else{
      this.finalTotal-=Number(odds);
    }
  }
  // end of calcBetPayout

  calculateCostBasedOnPayout(payout: number, odds: number, id: number) {
    this.item[id - 1].payout = payout;
    this.item[id - 1].stake = Number(payout / odds).toFixed(2);
    this._Payout=payout;
  }

  //calculate multiple odds and bonus
  calculateMultipleBetPayout(stake: number, odds) {
    this._multipleStake = stake;
    this._Payout = Number((stake * odds).toFixed(2));
    this._Payout=Number(odds*stake);
  }
  calculateMUltipleCostBasedOnPayout(payout: number, odds: number) {
    this._Payout = payout;
    this._multipleStake = Number.parseInt((payout / odds).toFixed(2));
  }

  getBonusTableForSerice() {
    this.bonusTableService.getBonusTable().subscribe((data: any) => {
      this._bonusTable = data
    });
  }




  FinaliseBet(bet:SubmitBet){
    return this._http.post<SubmitBet>(`${this.rootUrl}`,bet)
    .pipe(map((data: any) => {
      return data;
    }),
      catchError(this.errohandler.handleError));
  }



  getBetEvents():Observable<IBetTbl[]>{
    return this._http.get<IBetTbl[]>(`${this.rootUrl}/GetBetEvents`)
    .pipe(catchError(this.errohandler.handleError));
  }
  getBets():Observable<IBetSLip[]>{
   return this._http.get<IBetSLip[]>(`${this.rootUrl}/GetBets`)
   .pipe(catchError(this.errohandler.handleError));
  }

  


}