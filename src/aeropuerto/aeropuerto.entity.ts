import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    aerolineas: AerolineaEntity[];
}