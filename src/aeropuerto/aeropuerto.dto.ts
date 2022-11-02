import {  IsNotEmpty, IsString  } from "class-validator";

export class AeropuertoDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;
}
