import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "src/status/status.entity";
import { Difficulty } from "src/difficulty/difficulty.entity";
import { OperatingSystem } from "src/operating-systems/os.entity";
import { Category } from "src/categories/category.entity";
import { Role } from "src/role/role.entity";
import { Image } from "src/images/image.entity";
import { Container } from "src/containers/container.entity";
import { Lab } from "src/labs/lab.entity";

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @InjectRepository(Difficulty)
    private difficultyRepository: Repository<Difficulty>,
    @InjectRepository(OperatingSystem)
    private osRepository: Repository<OperatingSystem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    @InjectRepository(Lab)
    private labRepository: Repository<Lab>,
  ) {}

  async seed() {
    this.logger.log("🌱 Iniciando seeding de la base de datos...");

    try {
      await this.seedStatuses();
      await this.seedDifficulties();
      await this.seedOperatingSystems();
      await this.seedCategories();
      await this.seedRoles();
      await this.seedImages();
      await this.seedLabs();
      await this.seedContainers();
      await this.seedFlagSubmissions();

      this.logger.log("✅ Seeding completado exitosamente");
      return {
        success: true,
        message: "Base de datos inicializada correctamente",
      };
    } catch (error) {
      this.logger.error("❌ Error durante el seeding:", error);
      throw error;
    }
  }

  private async seedStatuses() {
    const statuses = [
      { id: 1, name: "Inactivo" },
      { id: 2, name: "Activo" },
    ];

    for (const status of statuses) {
      const exists = await this.statusRepository.findOne({
        where: { id: status.id },
      });
      if (!exists) {
        await this.statusRepository.save(status);
        this.logger.log(`   ✓ Status creado: ${status.name}`);
      }
    }
  }

  private async seedDifficulties() {
    const difficulties = [
      { id: 1, name: "Fácil" },
      { id: 2, name: "Intermedio" },
      { id: 3, name: "Difícil" },
      { id: 4, name: "Experto" },
    ];

    for (const difficulty of difficulties) {
      const exists = await this.difficultyRepository.findOne({
        where: { id: difficulty.id },
      });
      if (!exists) {
        await this.difficultyRepository.save(difficulty);
        this.logger.log(`   ✓ Dificultad creada: ${difficulty.name}`);
      }
    }
  }

  private async seedOperatingSystems() {
    const systems = [
      { id: 1, name: "Linux" },
      { id: 2, name: "Windows" },
    ];

    for (const os of systems) {
      const exists = await this.osRepository.findOne({ where: { id: os.id } });
      if (!exists) {
        await this.osRepository.save(os);
        this.logger.log(`   ✓ Sistema operativo creado: ${os.name}`);
      }
    }
  }

  private async seedCategories() {
    const categories = [
      { id: 1, name: "Web", description: "Vulnerabilidades web" },
      { id: 2, name: "Network", description: "Seguridad de redes" },
      { id: 3, name: "Cryptography", description: "Criptografía" },
      { id: 4, name: "Binary", description: "Explotación binaria" },
      { id: 5, name: "Forensics", description: "Análisis forense" },
    ];

    for (const category of categories) {
      const exists = await this.categoryRepository.findOne({
        where: { id: category.id },
      });
      if (!exists) {
        await this.categoryRepository.save(category);
        this.logger.log(`   ✓ Categoría creada: ${category.name}`);
      }
    }
  }

  private async seedRoles() {
    const roles = [
      { id: 1, name: "admin" },
      { id: 2, name: "student" },
      { id: 3, name: "teacher" },
    ];

    for (const role of roles) {
      const exists = await this.roleRepository.findOne({
        where: { id: role.id },
      });
      if (!exists) {
        await this.roleRepository.save(role);
        this.logger.log(`   ✓ Rol creado: ${role.name}`);
      }
    }
  }

  private async seedImages() {
    const images = [
      {
        name: "kali-linux",
        tag: "latest",
        operatingSystemId: { id: 1 } as any,
      },
      { name: "ubuntu", tag: "22.04", operatingSystemId: { id: 1 } as any },
      { name: "debian", tag: "11", operatingSystemId: { id: 1 } as any },
      {
        name: "windows-server",
        tag: "2022",
        operatingSystemId: { id: 2 } as any,
      },
    ];

    for (const image of images) {
      const exists = await this.imageRepository.findOne({
        where: { name: image.name, tag: image.tag },
      });
      if (!exists) {
        const newImage = this.imageRepository.create(image);
        await this.imageRepository.save(newImage);
        this.logger.log(`   ✓ Imagen creada: ${image.name}:${image.tag}`);
      }
    }
  }

  private async seedLabs() {
    const labs = [
      {
        name: "SQL Injection Básico",
        description:
          "Aprende los fundamentos de SQL injection mediante un sitio web vulnerable",
        points: 100,
        estimatedTime: 30,
        flag: ["flag{sql_injection_basic}", "flag{sql_injection_advanced}"],
        tags: ["SQLi", "Web", "OWASP"],
        category: { id: 1 } as any,
        difficulty: { id: 1 } as any,
        operatingSystem: { id: 1 } as any,
        status: { id: 1 } as any,
      },
      {
        name: "XSS Cross-Site Scripting",
        description: "Explora vulnerabilidades XSS en aplicaciones web",
        points: 150,
        estimatedTime: 45,
        flag: ["flag{xss_basic}", "flag{xss_stored}"],
        tags: ["XSS", "Web", "JavaScript"],
        category: { id: 1 } as any,
        difficulty: { id: 2 } as any,
        operatingSystem: { id: 1 } as any,
        status: { id: 1 } as any,
      },
      {
        name: "Buffer Overflow",
        description:
          "Aprende a explotar vulnerabilidades de desbordamiento de buffer",
        points: 300,
        estimatedTime: 90,
        flag: ["flag{buffer_overflow_exploit}", "flag{ret2libc}"],
        tags: ["Binary", "Exploitation", "C"],
        category: { id: 4 } as any,
        difficulty: { id: 3 } as any,
        operatingSystem: { id: 1 } as any,
        status: { id: 1 } as any,
      },
      {
        name: "Análisis de Tráfico de Red",
        description:
          "Captura y analiza tráfico de red para encontrar información sensible",
        points: 200,
        estimatedTime: 60,
        flag: ["flag{network_analysis_1}", "flag{pcap_challenge}"],
        tags: ["Network", "Wireshark", "PCAP"],
        category: { id: 2 } as any,
        difficulty: { id: 2 } as any,
        operatingSystem: { id: 1 } as any,
        status: { id: 1 } as any,
      },
      {
        name: "Criptografía RSA",
        description: "Rompe cifrados RSA débiles mediante análisis matemático",
        points: 250,
        estimatedTime: 75,
        flag: ["flag{rsa_crack_1}", "flag{math_is_fun}"],
        tags: ["Crypto", "RSA", "Math"],
        category: { id: 3 } as any,
        difficulty: { id: 3 } as any,
        operatingSystem: { id: 1 } as any,
        status: { id: 1 } as any,
      },
    ];

    for (const lab of labs) {
      const exists = await this.labRepository.findOne({
        where: { name: lab.name },
      });
      if (!exists) {
        const newLab = this.labRepository.create(lab);
        await this.labRepository.save(newLab);
        this.logger.log(`   ✓ Lab creado: ${lab.name}`);
      }
    }
  }

  private async seedContainers() {
    // Solo crear contenedores de ejemplo si hay labs e imágenes
    const labCount = await this.labRepository.count();
    const imageCount = await this.imageRepository.count();

    if (labCount === 0 || imageCount === 0) {
      this.logger.log(
        "   ⚠ Saltando creación de contenedores (faltan labs o imágenes)",
      );
      return;
    }

    const labs = await this.labRepository.find({ take: 3 });
    const images = await this.imageRepository.find({ take: 2 });

    const containers = [
      {
        name: `container-${labs[0]?.name.toLowerCase().replace(/\s+/g, "-")}`,
        image: images[0],
        lab: labs[0],
        status: { id: 1 },
      },
      {
        name: `container-${labs[1]?.name.toLowerCase().replace(/\s+/g, "-")}`,
        image: images[1],
        lab: labs[1],
        status: { id: 1 },
      },
    ];

    for (const container of containers) {
      if (container.lab && container.image) {
        const exists = await this.containerRepository.findOne({
          where: { name: container.name },
        });
        if (!exists) {
          await this.containerRepository.save(container);
          this.logger.log(`   ✓ Contenedor creado: ${container.name}`);
        }
      }
    }
  }
  private async seedFlagSubmissions() {
    const users = await this.userRepository.find({ take: 2 }); // Obtener 2 usuarios de ejemplo
    const labs = await this.labRepository.find({ take: 2 }); // Obtener 2 labs de ejemplo

    if (users.length === 0 || labs.length === 0) {
      this.logger.log('   ⚠ Saltando creación de Flag Submissions (faltan usuarios o labs)');
      return;
    }

    const flagSubmissions = [
      {
        user: users[0],
        lab: labs[0],
        // challenge: { id: labs[0].id },
        name: 'flag{example1}',
        created: new Date(),
        isCorrect: true,
      },
      {
        user: users[1],
        lab: labs[0],
        // challenge: { id: labs[1].id },
        name: 'flag{example2}',
        created: new Date(),
        isCorrect: false,
      },
    ];

    for (const flagSubmission of flagSubmissions) {
      const exists = await this.flagSubmissionRepository.findOne({
        where: {
          userId: { id: flagSubmission.user.id },
          name: flagSubmission.name,
          labId: { uuid: flagSubmission.lab.uuid },
          // challenge: { uuid: flagSubmission.challenge.uuid },
        },
      });

      if (!exists) {
        const newFlagSubmission = this.flagSubmissionRepository.create({
          userId: flagSubmission.user,
          labId: flagSubmission.lab,
          name: flagSubmission.name,
          created: flagSubmission.created,
          isCorrect: flagSubmission.isCorrect,
        });
        await this.flagSubmissionRepository.save(newFlagSubmission);
        this.logger.log(`   ✓ Flag Submission creada: ${flagSubmission.name}`);
      }
    }
  }
}
