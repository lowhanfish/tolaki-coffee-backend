export class ResponsePartnerDto {
  id: string;
  partner: string;
  area: number;
  altitude_from: number;
  altitude_to: number;
  companyProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export class ResponseAllPartnerDto {
  total: number;
  skip: number;
  limit: number;
  data: ResponsePartnerDto[];
}
