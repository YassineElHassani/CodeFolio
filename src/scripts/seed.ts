import dotenv from 'dotenv';
import { connectDb } from '../utils/connectDb';
import User from '../models/User';
import Profile from '../models/Profile';
import Project from '../models/Project';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDb(process.env.MONGO_URI!);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    });

    // Create profile
    const profile = await Profile.create({
      name: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with experience in modern web technologies',
      avatarUrl: 'https://example.com/avatar.jpg',
      social: [
        {
          platform: 'GitHub',
          icon: 'github',
          url: 'https://github.com/johndoe'
        },
        {
          platform: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://linkedin.com/in/johndoe'
        }
      ]
    });

    // Create skills
    const skills = await Skill.create([
      {
        name: 'React',
        level: 'Expert',
        icon: 'react'
      },
      {
        name: 'Node.js',
        level: 'Advanced',
        icon: 'nodejs'
      },
      {
        name: 'GraphQL',
        level: 'Intermediate',
        icon: 'graphql'
      }
    ]);

    // Create projects
    const projects = await Project.create([
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with MERN stack',
        skills: ['React', 'Node.js', 'MongoDB'],
        url: 'https://project1.com',
        image: 'https://example.com/project1.jpg'
      },
      {
        title: 'Task Management App',
        description: 'A real-time task management application',
        skills: ['React', 'GraphQL', 'Node.js'],
        url: 'https://project2.com',
        image: 'https://example.com/project2.jpg'
      }
    ]);

    // Create experiences
    const experiences = await Experience.create([
      {
        company: 'Tech Corp',
        role: 'Senior Developer',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        details: 'Led development of various full-stack applications'
      },
      {
        company: 'StartUp Inc',
        role: 'Full Stack Developer',
        startDate: new Date('2018-01-01'),
        endDate: new Date('2019-12-31'),
        details: 'Developed and maintained multiple web applications'
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created admin user with username: 'admin' and password: 'admin123'`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();