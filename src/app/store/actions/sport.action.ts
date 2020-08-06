import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Sport} from '../../iSports';

//section 2

export const GET_SPORTS='[SPORTS] Get'
export const GET_SPORTS_SUCCESS='[SPORTS] Get Success'

//Section2

export const GET_SPORT='[SPORTS] Get'
export const GET_SPORT_SUCCESS='[SPORTS] Get Success'

export enum ActionTypes{
    GET_SPORT='[SPORTS] Get',
    GET_SPORT_SUCCESS='[SPORTS] Get Success'
}


// SECTION 3

export class GetSport implements Action{
    readonly type =ActionTypes.GET_SPORT
    constructor(){}

}
export class GetSportSuccess implements Action{
    readonly type=ActionTypes.GET_SPORT_SUCCESS;
    constructor (public payload:Sport[]){}
}

//SECTION 4

export type ActionUnion=GetSport|GetSportSuccess;