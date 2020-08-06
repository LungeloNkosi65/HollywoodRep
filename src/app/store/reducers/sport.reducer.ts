import {Action} from '@ngrx/store';
import {Sport} from '../../iSports';
import * as SportActions from '../actions/sport.action';

//Section 1
 export const initialState:Sport={
    SportId:0,
    Name:"default",
    Logo:"default",
 }

 //Section 2
export function reducer(state:Sport[]=[initialState],action:SportActions.ActionUnion){
    //section 3
    switch(action.type){
        case SportActions.GET_SPORT_SUCCESS:
            console.log("Payload at reducer before returning and joining with state:", action.payload);
            return  action.payload;
        default:
            return state
    }
}