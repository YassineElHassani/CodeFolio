import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Profile from './models/Profile';
import Project from './models/Project';
import Skill from './models/Skill';
import Experience from './models/Experience';
import User from './models/User';
import { IProject } from './models/Project';
import { blacklistToken } from './utils/tokenBlacklist';
import { validateInput, required, minLength, isUrl } from './utils/validation';
import { formatDoc } from './utils/format';

const resolvers = {
  Query: {
    // Get all portfolio data
    getPortfolio: async () => {
      const profile = await Profile.findOne().lean();
      const projects = await Project.find().sort({ createdAt: -1 }).lean();
      const skills = await Skill.find().sort({ name: 1 }).lean();
      const experiences = await Experience.find().sort({ startDate: -1 }).lean();
      return {
        profile: profile ? formatDoc(profile) : null,
        projects: projects.map(formatDoc),
        skills: skills.map(formatDoc),
        experiences: experiences.map(formatDoc)
      };
    },

    // Get profile
    getProfile: async () => {
      const profile = await Profile.findOne().lean();
      return profile ? formatDoc(profile) : null;
    },

    // Get projects
    getProjects: async () => {
      const projects = await Project.find().sort({ createdAt: -1 }).lean();
      return projects.map(formatDoc);
    },

    // Get skills
    getSkills: async () => {
      const skills = await Skill.find().sort({ name: 1 }).lean();
      return skills.map(formatDoc);
    },

    // Get experience
    getExperiences: async () => {
      const experiences = await Experience.find().sort({ startDate: -1 }).lean();
      return experiences.map(exp => ({
        ...formatDoc(exp),
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : null,
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : null
      }));
    }
  },
  Mutation: {
    // Login
    login: async (_: any, { username, password }: any) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('Invalid credentials');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn }
      );
      return { token };
    },

    // Logout
    logout: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) return true; // Already logged out
      const authHeader = ctx.req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        await blacklistToken(token, 7 * 24 * 60 * 60); // Blacklist for token's max lifetime
      }
      return true;
    },

    // Create project
    createProject: async (_: any, { input }: { input: Partial<IProject> }, ctx: any) => {
      validateInput(input, {
        title: [required(), minLength(3)],
        url: [isUrl()],
      });
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      // Accept image field in input (image URL)
      const project = await Project.create(input as any);
      return formatDoc(project.toObject());
    },

    // Create skill
    createSkill: async (_: any, { input }: any, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      // Accept icon field (url or icon identifier)
      const skill = await Skill.create(input);
      return formatDoc(skill.toObject());
    },

    // Create experience
    createExperience: async (_: any, { input }: any, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      return Experience.create(input);
    },

    // Update profile
    updateProfile: async (_: any, { input }: any, ctx: any) => {
      if (!ctx.user?.isAdmin) throw new Error('Unauthorized');
      
      try {
        const profile = await Profile.findOneAndUpdate(
          {}, // empty filter to update the first document or create new
          input,
          { 
            new: true,      // return the modified document
            upsert: true,   // create if it doesn't exist
            runValidators: true // run model validators
          }
        );
        
        if (!profile) throw new Error('Profile update failed');
        return profile;
      } catch (error: any) {
        console.error('Profile update error:', error);
        throw new Error(error.message || 'Profile update failed');
      }
    },

    // Update project
    updateProject: async (_: any, { id, input }: { id: string; input: Partial<IProject> }, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const project = await Project.findByIdAndUpdate(id, input, { new: true }).lean();
      if (!project) throw new Error('Project not found');
      return {
        ...project,
        id: project._id?.toString()
      };
    },

    // Delete project
    deleteProject: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const result = await Project.findByIdAndDelete(id);
      return !!result;
    },

    // Update skill
    updateSkill: async (_: any, { id, input }: any, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const skill = await Skill.findByIdAndUpdate(id, input, { new: true }).lean();
      if (!skill) throw new Error('Skill not found');
      return formatDoc(skill);
    },

    // Delete skill
    deleteSkill: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const result = await Skill.findByIdAndDelete(id);
      return !!result;
    },

    // Update experience
    updateExperience: async (_: any, { id, input }: any, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const experience = await Experience.findByIdAndUpdate(id, input, { new: true });
      if (!experience) throw new Error('Experience not found');
      return experience;
    },

    // Delete experience
    deleteExperience: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user || !ctx.user.isAdmin) throw new Error('Unauthorized');
      const result = await Experience.findByIdAndDelete(id);
      return !!result;
    }
  }
};

export default resolvers;
