export interface TokenType {
    at : string;
    rt : string;
}


export type AccessTokenPayload = {
    sub : string;
    email : string;
    type : 'access'
}