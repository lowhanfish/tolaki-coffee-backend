export interface TokenType {
    at : string;
    rt : string;
}


export type AccessTokenPayload = {
    sub : string;
    email : string;
    type : 'access'
}
export type RefreshTokenPayload = {
    sub : string;
    email : string;
    type : 'refresh'
}