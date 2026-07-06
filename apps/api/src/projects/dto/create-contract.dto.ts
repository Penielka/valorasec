import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({ example: 'LiquidityPool', description: 'Contract name' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'CABC123...', description: 'Soroban contract address' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address!: string;

  @ApiProperty({ example: 'testnet', description: 'Stellar network' })
  @IsString()
  network!: string;
}
