export interface SubmitBet{
Betslip:IBetSLip;
BetTbls:IBetTbl[];
}

export interface IBetSLip{
    BetSlipId:number;
    StakeAmount:number;
    Odds:number;
    Payout:number;
    UserAccount:string;
}

export interface IBetTbl{
    BetId:number;
    BetSlipId:number;
    TicketNumber:string;
    EventId:number;
    BetTypeId:string;
    Stake:number;
    Payout:number;
    Date:Date;
    Status:string;
    SportId:string;
    TournamentId:string;
    MarketId:string;
    Odds:number;

}