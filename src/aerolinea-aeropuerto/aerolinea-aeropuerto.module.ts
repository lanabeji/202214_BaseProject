
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Module({
  providers: [AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
})
export class AerolineaAeropuertoModule {}