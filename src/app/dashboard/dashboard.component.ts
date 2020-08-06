import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SportsService } from '../sports.service';
import { BetSlipService } from '../bet-slip.service';
import { SoccerCupon } from '../Models/soccerCupon';
import { EventService } from '../event.service';
import { Event } from '../Models/Ievent';
import { BetType } from '../ibetType';
import { BetTypeService } from '../bet-type.service';
import { Market } from '../Models/iMarket';
import { MarketService } from '../market.service';
import { CuponAssociation } from '../Models/soccerCuponAssoiation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  soccerBets: any[];
  soccerCupons: SoccerCupon[];
  events: Event[];
  cuponAssociation:CuponAssociation;
  cuponAssociations:CuponAssociation[]=[];


  constructor(private _sport: SportsService, private _betService: BetSlipService, private eventService: EventService) {

  }

  ngOnInit(): void {
    this.getEventForTournament();
    this.getCupon();
    this.getSoccer();
  }

  addEventToBetSlip(event: any, punterChoice: string, odds: number) {
    console.log('This is the evennt', event);
    event = {
      EventId: event.id,
      TournamentId: event.TournamentId,
      EeventName: `${event.homeTeam} vs ${event.awayTeam}`,
      EeventDate: event.EeventDate,
      sportName: 'Soccer',
      tournamentName: event.leaugeName,
      betType: event.BetType,
      betTypeId: 1,
      sportId: 5
    }
    return this._betService.addToBetSlip(event, punterChoice, odds);
  }

  getSoccer() {
    this._sport.getSoccer().subscribe(
      data => {
        console.log(data);
        this.soccerBets = data;
        // console.log('.....Soccer Bets ', this.soccerBets);
      }
    );
  }

  getCupon() {
    this._sport.getCupons().subscribe((data: any) => {
      this.soccerCupons = data;
      this.getSpecificOdds(data);
      console.log("Cupons ..", this.soccerCupons);
    });
  }


  getEventForTournament() {
    this.eventService.getEventByTournament(3).subscribe((data: any) => {
      this.events = data;
      this.assignEvents(this.events);
      console.log('Events for tournament', this.events);
    });
  }

  
  assignEvents(eventData: any) {
    for (let i = 0; i < eventData.length; i++) {
      this.cuponAssociation={
        event:eventData[i],
        soccerCupon:[]
      };
      this.cuponAssociations.push(this.cuponAssociation);
    }
  }


  getSpecificOdds(odds:any){
      for(let i=0;i<odds.length;i++){
        this.cuponAssociations.forEach(function (cupon){
          if(cupon.event.EventId==odds[i].EventId){
            cupon.soccerCupon.push(odds[i]);
          }
        });
      }
      console.log('Available cupon',this.cuponAssociations);
  }


}