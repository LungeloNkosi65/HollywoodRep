import { Component, OnInit } from '@angular/core';
import { BetSlipService } from '../bet-slip.service';
import { Observable } from 'rxjs';
import { BounusTable } from '../Models/bonusTable';
import { BonusTableService } from '../services/bonus-table.service';
import {SubmitBet, IBetTbl, IBetSLip} from '../Models/ISubmitBet';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.css']
})
export class BetSlipComponent implements OnInit {

  betSlipId:number;
  item: any = [];
  count = 0;
  betSlipFinal:number=0;
  bonusTable:BounusTable[]=[];
  multipleOdds=0;
  multipleStake=0;
  multiPayout=0;
  bonus=0;
  finalOdds=0;
  _isBetRelated:boolean=false;
  finalPlaceBetItem:SubmitBet;
  betEvents:IBetTbl[]=[];
  betEvent:any;
  betEventsApi:IBetTbl[]=[];
  betSlipApi:IBetSLip[]=[];
  betEventIdIncrement:number=0;

  constructor(private _betService: BetSlipService, private bonuTableService:BonusTableService) { }

  ngOnInit(): void {
    this.item = this._betService.item;
    // console.log('bet slit items', this.item);
    this.getBonusTabele();
    this.getBets();
    this.getEvents();

  }

 

  removeFromBetSlip(event: any) {
    return this._betService.removeEvent(event);
  }
  clearBetslip() {
    return this._betService.clearBetSlip();
  }
  ngAfterContentChecked() {
    this.item = this._betService.item;
    this.count = this._betService.item.length;
    this.betSlipFinal=this._betService.finalTotal;
    this.multipleOdds=this._betService._multipleOdds;
    this.finalOdds=this._betService._finalMultiple;
    this.bonus=this._betService._bonusPercent;
    this.multipleStake=this._betService._multipleStake;
    this.multiPayout=Number(this._betService._Payout.toFixed(2));
    this._isBetRelated=this._betService._isBetRelated;
    
  }

  onKeyStake(stake:number,odds:number,id:number){
     this._betService.calculateBetPayout(stake,odds,id);
  }
  onKeyPayout(stake:number,odds:number,id:number){
    this._betService.calculateCostBasedOnPayout(stake,odds,id);
  }
  onKeyMultipleStake(stake:number){
     this._betService.calculateMultipleBetPayout(stake,this.finalOdds);
  }
  onKeyMultiplePayout(payout:number){
    this._betService.calculateMUltipleCostBasedOnPayout(payout,this.finalOdds);
  }

  getBonusTabele(){
     this.bonuTableService.getBonusTable().subscribe((data:any)=>{
       this.bonusTable=data;
       console.log('')
     });
  }

  onKeyDown(value:number){
    this._betService.finalTotal-value;
  }


  createBetEvent(bet:any){
    var date=new Date();
    this.betSlipId=this.betSlipApi.length+1;
    for(let i=0;i<bet.length;i++){
      this.betEvent={
        // BetId:this.betEventIdIncrement,
        BetSlipId:this.betSlipId,
        TicketNumber:'Tick 1',
        EventId:bet[i].event.EventId,
        BetTypeId:bet[i].event.betTypeId,
        Stake:bet[i].stake,
        Payout:100,
        Date:date,
        Status:'BetStriked',
        SportId:bet[i].event.sportId,
        TournamentId:bet[i].event.TournamentId,
        MarketId:bet[i].marketId,
        Odds:bet[i].selectionOdds
      }
      // console.log('BetId,',this.betEventIdIncrement);
      this.betEvents.push(this.betEvent);
      this.betEventIdIncrement++;
    }
    this.placeBet();
  }


  placeBet(){
    if(this.item.length>1){   //this is for a multiple
      this.finalPlaceBetItem={
        Betslip:{
          BetSlipId:this.betSlipId,
          StakeAmount:Number(this.multipleStake),
          Odds:Number(this.multipleOdds.toFixed(2)),
          Payout:Number(this.multiPayout.toFixed(2)),
          UserAccount:'Lungelo1234'
        },
        BetTbls:this.betEvents
      }
      this._betService.FinaliseBet(this.finalPlaceBetItem).subscribe((data:any)=>{
        this.clearBetslip();
        alert("Bet successfully struck");

      });
    }
    else{   //for single leg bet
      // console.log('Odds', this.item[0].selectionOdds);
      // console.log('Stake ',this.item[0].stake);
      // console.log('estimated payout',(this.item[0].payout ))
      this.finalPlaceBetItem={
        Betslip:{
          BetSlipId:this.betSlipId,
          StakeAmount:Number(this.item[0].stake),
          Odds:Number(this.item[0].selectionOdds),
          Payout:Number(this.item[0].payout),
          UserAccount:'Lungelo1234'
        },
        BetTbls:this.betEvents
      }
      this._betService.FinaliseBet(this.finalPlaceBetItem).subscribe((data:any)=>{
        this.clearBetslip();
        alert("Bet successfully struck");

      });
    }
  }


  getBets(){
    this._betService.getBets().subscribe((data:any)=>{
      this.betSlipApi=data;
      // console.log('BetSlip from api', this.betSlipApi)
    });
  }

  getEvents(){
    this._betService.getBetEvents().subscribe((data:any)=>{
      this.betEventsApi=data;
      // console.log('Events from api',this.betEventsApi);
      this.betEventIdIncrement=data.length+1;
      // console.log('Number of events in db', this.betEventIdIncrement);
    })
  }

}
