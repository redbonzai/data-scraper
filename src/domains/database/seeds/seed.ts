import { DataSource } from 'typeorm';
import { ContactInfo } from '../entities/contact-info.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'local',
  database: process.env.POSTGRES_DB || 'local',
  entities: [ContactInfo],
  synchronize: false, // Ensure this is false in production
  migrations: ['dist/migrations/*.js'],
});

async function seedDatabase() {
  await dataSource.initialize();
  console.log('📌 Connected to the database');

  const contactInfoRepository = dataSource.getRepository(ContactInfo);

  const sampleContacts = [
    {
      website: 'https://example1.com',
      phone: '123-456-7890',
      email: 'info@example1.com',
      address: '123 Main St, City, Country',
    },
    {
      website: 'https://example2.com',
      phone: '',
      email: 'contact@example2.com',
      address: '456 Elm St, City, Country',
    },
    {
      website: 'https://example3.com',
      phone: '987-654-3210',
      email: '',
      address: '789 Oak St, City, Country',
    },
    {
      website: 'https://example4.com',
      phone: '555-666-7777',
      email: 'hello@example4.com',
      address: '',
    },
    {
      website: 'https://example5.com',
      phone: '',
      email: '',
      address: '101 Pine St, City, Country',
    },
  ];

  await contactInfoRepository.clear(); // Clears existing records
  await contactInfoRepository.insert(sampleContacts);

  console.log('✅ Database seeded with sample contact information');

  await dataSource.destroy();
}

seedDatabase().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
