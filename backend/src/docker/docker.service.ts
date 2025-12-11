import * as Dockerode from 'dockerode';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DockerService {
  private readonly docker: Dockerode;
  private readonly logger = new Logger(DockerService.name);

  constructor() {
    this.docker = new Dockerode({ socketPath: '/var/run/docker.sock' }); // Nos conectamos al socket de Docker
  }

  async pullImageIfNotExists(imageName: string): Promise<void> {
    try {
      await this.docker.getImage(imageName).inspect();
      this.logger.log(`Image ${imageName} already exists locally.`);
    } catch (error) {
      this.logger.log(`Pulling image ${imageName}...`);
      await new Promise((resolve, reject) => {
        this.docker.pull(imageName, (err, stream) => {
          if (err) {
            this.logger.error(`Error pulling image ${imageName}: ${err.message}`);
            return reject(err);
          }
          this.docker.modem.followProgress(
            stream,
            (pullErr, output) => {
              if (pullErr) {
                this.logger.error(`Error during pull progress for image ${imageName}: ${pullErr.message}`);
                return reject(pullErr);
              }
              this.logger.log(`Successfully pulled image ${imageName}.`);
              resolve(output);
            },
            (event) => {
              if (event.status) {
                this.logger.log(event.status + (event.progress ? `: ${event.progress}` : ''));
              }
            },
          );
        });
      });
      this.logger.log(`Image ${imageName} pulled successfully`);
    }
  }

  async createContainer(imageName: string, containerName: string): Promise<Dockerode.Container> {
    await this.pullImageIfNotExists(imageName); //Comprobar si la imagen existe, si no, descargarla
    return await this.docker.createContainer({
      Image: imageName,
      name: containerName,
      Tty: true,
    });
  }

  async startContainer(containerName: string): Promise<void> {
    const container = this.docker.getContainer(containerName);
    await container.start();
    this.logger.log(`Container ${containerName} started`);
  }

  async stopContainer(containerName: string): Promise<void> {
    const container = this.docker.getContainer(containerName);
    await container.stop();
    this.logger.log(`Container ${containerName} stopped`);
  }

  async inspectContainer(containerName: string): Promise<Dockerode.ContainerInspectInfo> {
    const container = this.docker.getContainer(containerName);
    return await container.inspect();
  }

  async removeContainer(containerName: string): Promise<void> {
    const container = this.docker.getContainer(containerName);
    await container.remove({ force: true });
    this.logger.log(`Container ${containerName} removed`);
  }

  //Solo mostrar aquellos contenedores en activo -> que están dispoibles para usarse
  async listActiveContainers(): Promise<Dockerode.ContainerInfo[]> {
    const containers = await this.docker.listContainers({ all: false });
    return containers;
  }
}