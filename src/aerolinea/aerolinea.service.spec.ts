import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for(let i = 0; i < 5; i++){
      const aerolinea: AerolineaEntity = await repository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(1).toDateString(),
        webPage: faker.internet.url()})
      aerolineasList.push(aerolinea);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.name).toEqual(storedAerolinea.name)
    expect(aerolinea.description).toEqual(storedAerolinea.description)
    expect(aerolinea.foundationDate).toEqual(storedAerolinea.foundationDate)
    expect(aerolinea.webPage).toEqual(storedAerolinea.webPage)
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(1).toISOString(),
      webPage: faker.internet.url(),
      aeropuertos: []
    }

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(newAerolinea.name)
    expect(storedAerolinea.description).toEqual(newAerolinea.description)
    expect(storedAerolinea.foundationDate).toEqual(newAerolinea.foundationDate)
    expect(storedAerolinea.webPage).toEqual(newAerolinea.webPage)
  });

  it('create should return a new aerolinea error date', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.future(1).toISOString(),
      webPage: faker.internet.url(),
      aeropuertos: []
    }

    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "The aerolinea foundation date should be in the past")
  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.name = "New name";
    aerolinea.foundationDate = faker.date.past(2).toDateString();
    const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(aerolinea.name)
    expect(storedAerolinea.foundationDate).toEqual(aerolinea.foundationDate)
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, name: "New name", description: "New address"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });

  it('update should throw an exception for an invalid aerolinea date', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, name: "New name", foundationDate: faker.date.future(10).toDateString()
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "The aerolinea foundation date should be in the past")
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });

});