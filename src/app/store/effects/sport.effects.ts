import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { SportsService } from '../../sports.service';
import { ActionTypes } from '../actions/sport.action';
import * as Action from '../actions/sport.action';
import { Sport } from '../../iSports';

@Injectable()
export class SportEffects{

    @Effect()
    loadSports$= this.actions$.pipe(
        ofType(ActionTypes.GET_SPORT),
        switchMap((action:Action.GetSport)=>
        this.sportService.getSports().pipe(
            map((sports:Sport[])=>new Action.GetSportSuccess(sports))
        )   
        )
    );
    constructor(
        private actions$: Actions,
        private sportService: SportsService
      ) {}

}
