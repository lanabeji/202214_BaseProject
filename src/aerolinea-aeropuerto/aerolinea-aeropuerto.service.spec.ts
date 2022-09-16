import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        name: faker.lorem.word(),
        code: faker.address.countryCode("alpha-3"),
        country: faker.address.country(),
        city: faker.address.city()})
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(1).toISOString(),
      webPage: faker.internet.url(),
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save(
        {
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          foundationDate: faker.date.past(1).toISOString(),
          webPage: faker.internet.url()
        });

    const result: AerolineaEntity = await service.addAeropuertoAerolinea(newAerolinea.id, newAeropuerto.id);

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].name).toBe(newAeropuerto.name)
    expect(result.aeropuertos[0].code).toBe(newAeropuerto.code)
    expect(result.aeropuertos[0].country).toBe(newAeropuerto.country)
    expect(result.aeropuertos[0].city).toBe(newAeropuerto.city)
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(1).toISOString(),
      webPage: faker.internet.url()
    })

    await expect(() => service.addAeropuertoAerolinea(newAerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('addAeropuertoAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    await expect(() => service.addAeropuertoAerolinea("0", newAeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.name).toBe(aeropuerto.name);
    expect(storedAeropuerto.code).toBe(aeropuerto.code);
    expect(storedAeropuerto.country).toBe(aeropuerto.country);
    expect(storedAeropuerto.city).toBe(aeropuerto.city);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea");
  });

  it('findAeropuertosByAerolineaId should return aeropuertos by aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('associateAeropuertosAerolinea should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    const updatedAerolinea: AerolineaEntity = await service.updateAeropuertosAerolinea(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);

    expect(updatedAerolinea.aeropuertos[0].name).toBe(newAeropuerto.name);
    expect(updatedAerolinea.aeropuertos[0].code).toBe(newAeropuerto.code);
    expect(updatedAerolinea.aeropuertos[0].country).toBe(newAeropuerto.country);
    expect(updatedAerolinea.aeropuertos[0].city).toBe(newAeropuerto.city);
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    await expect(()=> service.updateAeropuertosAerolinea("0", [newAeropuerto])).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";

    await expect(()=> service.updateAeropuertosAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('deleteAeropuertoToAerolinea should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();

  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAeropuertoAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save(
        {
          name: faker.lorem.word(),
          code: faker.address.countryCode("alpha-3"),
          country: faker.address.country(),
          city: faker.address.city()
        }
    );

    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea");
  });

});