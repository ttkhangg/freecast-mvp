import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  applicationId: string; // ID của đơn ứng tuyển (Ngữ cảnh chat)

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class JoinRoomDto {
  @IsNotEmpty()
  @IsUUID()
  applicationId: string;
}