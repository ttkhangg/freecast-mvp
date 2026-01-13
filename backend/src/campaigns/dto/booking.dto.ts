import { IsString, IsOptional } from 'class-validator';

export class ApproveApplicationDto {
  @IsString() @IsOptional() shippingCode?: string;
  @IsString() @IsOptional() carrier?: string;
}

export class SubmitContentDto {
  @IsString() link: string;
  @IsString() @IsOptional() note?: string;
}
