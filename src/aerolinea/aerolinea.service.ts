import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const currentDate = new Date();
        if(new Date(aerolinea.foundationDate) >= currentDate){
            throw new BusinessLogicException("The aerolinea foundation date should be in the past", BusinessError.BAD_REQUEST);
        }
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        const currentDate = new Date();

        if(new Date(aerolinea.foundationDate) >= currentDate){
            throw new BusinessLogicException("The aerolinea foundation date should be in the past", BusinessError.BAD_REQUEST);
        }
        if (!persistedAerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        aerolinea.id = id;

        return await this.aerolineaRepository.save(aerolinea);
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        await this.aerolineaRepository.remove(aerolinea);
    }
}