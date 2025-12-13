import { BadRequestException, Injectable } from '@nestjs/common';
import { Container } from './container.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lab } from 'src/labs/lab.entity';
import { Status } from 'src/status/status.entity';
import { User } from 'src/users/user.entity';
import { Image } from 'src/images/image.entity';
import { DockerService } from 'src/docker/docker.service';
import { ContainerDto } from './container.dto';

@Injectable()
export class ContainerService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dockerService: DockerService,
  ) { }

  async getContainers() {
    return await this.containerRepository.find({
      relations: ['image', 'lab', 'status', 'user'],
    });
  }

  async createContainer(containerData: ContainerDto): Promise<Container> {
    //Buscamos la imagen en la BD
    const image = await this.imageRepository.findOne({ where: { uuid: containerData.imageId }, relations: ['operatingSystem'] });
    if (!image) {
      throw new BadRequestException('Image not found');
    }

    //Buscamos las entidades relacionadas
    const status = await this.statusRepository.findOne({ where: { id: 1 } }); // Default -> inactive
    if (!status) {
      throw new BadRequestException('Status not found');
    }

    let lab: Lab | null = null;
    let user: User | null = null;

    if (containerData.labId) {
      lab = await this.labRepository.findOne({ where: { uuid: containerData.labId } });
      if (!lab) {
        throw new BadRequestException('Lab not found');
      }
    }

    if (containerData.userId) {
      user = await this.userRepository.findOne({ where: { id: containerData.userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    //Construimos la imagen del docker
    const dockerImageName = `${image.name}:${image.version || 'latest'}`;

    //Creamos el contenedor en Docker
    try {
      // await this.dockerService.createContainer(dockerImageName, containerData.name);

      // Creamos la entidad Container en la base de datos
      const newContainer: Partial<Container> = {
        name: containerData.name,
        image: image,
        status: status,
        created: new Date(),
      };

      if (lab) newContainer.lab = lab;
      if (user) newContainer.user = user;

      // create puede retornar una entidad o un arreglo; forzamos el tipo para evitar ambigüedades
      const createdEntity = this.containerRepository.create(newContainer as Partial<Container>) as Container;
      const savedContainer = await this.containerRepository.save(createdEntity);
      return savedContainer;
    } catch (error) {
      throw new BadRequestException('Failed to create docker container: ' + (error?.message || String(error)));
    }
  }
}
