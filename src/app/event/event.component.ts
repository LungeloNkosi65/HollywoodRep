import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../Models/Ievent';
import { BetType } from '../ibetType';
import { BetTypeService } from '../bet-type.service';
import { Market } from '../Models/iMarket';
import { MarketService } from '../market.service';
import { CustomOdds } from '../Models/customOdds';
import { EventMarkets } from '../Models/eventMarkets';
import { BetSlipService } from '../bet-slip.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  betTypes: BetType[];
  _tournamentName: string;
  sportName: string;
  sportId:number;
  marketId;
  betTypeOne: BetType = { BetTypeId: null, BetTypeName: null };
  count: number = 0;
  odds: CustomOdds[];
  localOdds: CustomOdds[] = [];
  eventMarkets: EventMarkets[] = [];
  localData: EventMarkets = {
    events: null,
    markets: []
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private marketService: MarketService,
    private betslipService: BetSlipService,
    private betTypeService: BetTypeService) { }

  ngOnInit(): void {

    //this will listen for changes in the router link and based on that refrsh the other component for you
    this.route.params.subscribe(routeParams => {
      this.getEvents();
      this.getBetTypes();
      this.getMarkertsForBetType();
      this.getValuesFromUrl();
      this.waitForOneSecond().then((value) => { });
    });
  }


  addEventToBetSlip(event: any, punterChoice: any, odds: number) {
  
     event={
      EventId:event.EventId,
      TournamentId: event.TournamentId,
      EeventName:event.EventName,
      EeventDate: event.EeventDate,
      sportName:this.sportName,
      tournamentName:this._tournamentName,
      betType:this.betTypeOne.BetTypeName,
      betTypeId:this.betTypeOne.BetTypeId,
      sportId:this.sportId
      
     }
    this.betslipService.addToBetSlip(event, punterChoice, odds);
    this.marketId=punterChoice.MarketId;
    console.log('Market Id', this.marketId);
  }


  waitForOneSecond() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("I promise to return after one second!");
      }, 300);
    });
  }

  getEvents() {  //get all events from the api using tournamentId
    return this.eventService.getEventByTournament(this.getTournamentId()).subscribe((data: any) => {
      this.events = data;
      this.assignEvents(data);
      // console.log('retrived events...', this.eventMarkets);
    });
  }


  assignEvents(data: any) {
    for (let i = 0; i < data.length; i++) {
      this.localData = {
        events: data[i],
        markets: []
      }
      this.pushToEVentMarkets(this.localData);
    }
  }

  pushToEVentMarkets(data: any) {
    if (this.eventMarkets.includes(data) == false) {
      this.eventMarkets.push(data);
    }
  }



  getBetTypes() {
    return this.betTypeService.getBetTypeByTournament(this.getTournamentId()).subscribe((data: any) => {
      this.betTypes = data;
      this.betTypeOne = this.betTypes[0];
      // console.log('default Bet type', this.betTypeOne);
    });
  }

  getMarkertsForBetType() {
    // console.log('BetTypeId', this.betTypeOne.BetTypeId)
    this.getOdds(this.getTournamentId());
  }



  getOdds(tournamentId: number) {
    this.eventService.getOddForTournament(tournamentId).subscribe((data: any) => {
      this.odds = data;
      this.getSpecificOdds(data);
    });
  }

  getSpecificOdds(odds: any) {
    for (let i = 0; i < odds.length; i++) {
      this.eventMarkets.forEach(function (eventMarket) {
        if (eventMarket.events.EventId == odds[i].EventId) {
          eventMarket.markets.push(odds[i]);
        }
      });
    }
  }
  //end of specific Odds
  setMarketName(eventName: string, marketType: string = ''): string {
    var teamName = eventName.split('vs');  //splits the word vs and saves both as an array team[0]=home and team[1]=Away
    if (marketType.includes('Home')) marketType = marketType.replace('Home', teamName[0]);
    if (marketType.includes('Away')) marketType = marketType.replace('Away', teamName[1]);
    return marketType;
  }


  selectedBetType(betType: BetType) {
    this.betTypeOne = betType;
  }




  getValuesFromUrl() {
    this.sportName = this.route.snapshot.paramMap.get('sportName');
    this._tournamentName = this.route.snapshot.paramMap.get('tournamentName');
    this.sportId =Number.parseInt(this.route.snapshot.paramMap.get('sportId'));
  }
  getTournamentId() {  // will get tournament id from the url
    return +this.route.snapshot.paramMap.get('tournamentId');
  }

}
