import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly foundationDate: string;

    @IsUrl()
    @IsNotEmpty()
    readonly webPage: string;
}
