import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports/:aeropuertoId')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports')
    async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string){
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaId);
    }

    @Put(':aerolineaId/airports')
    async associateAeropuertosAerolinea(@Body() aeropuertosDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string){
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
        return await this.aerolineaAeropuertoService.updateAeropuertosAerolinea(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/airports/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.deleteAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }
}