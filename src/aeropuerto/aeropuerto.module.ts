import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import {AeropuertoEntity} from "./aeropuerto.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  providers: [AeropuertoService]
})
export class AeropuertoModule {}
