import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Profile {
    id: ID!
    name: String!
    title: String
    bio: String
    avatarUrl: String
    social: [Social]
  }

  scalar JSON

  type Social {
    platform: String!
    icon: String
    url: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String
    skills: [String]
    url: String
    slug: String
    image: String
  }

  type Skill {
    id: ID!
    name: String!
    level: String
    icon: String
  }

  type Experience {
    id: ID!
    company: String!
    role: String!
    startDate: String
    endDate: String
    details: String
  }

  type Query {
    getPortfolio: Portfolio
    getProfile: Profile
    getProjects: [Project]
    getSkills: [Skill]
    getExperiences: [Experience]
  }

  type Portfolio {
    profile: Profile
    projects: [Project]
    skills: [Skill]
    experiences: [Experience]
  }

  type AuthPayload {
    token: String!
  }

  input ProfileInput {
    name: String
    title: String
    bio: String
    avatarUrl: String
    social: [SocialInput]
  }

  input SocialInput {
    platform: String!
    icon: String
    url: String!
  }

  input ProjectInput {
    title: String!
    description: String
    skills: [String]
    url: String
    image: String
  }

  input SkillInput {
    name: String!
    level: String
    icon: String
  }

  input ExperienceInput {
    company: String!
    role: String!
    startDate: String
    endDate: String
    details: String
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    logout: Boolean!
    updateProfile(input: ProfileInput!): Profile!
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    createSkill(input: SkillInput!): Skill!
    updateSkill(id: ID!, input: SkillInput!): Skill!
    deleteSkill(id: ID!): Boolean!
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: ID!, input: ExperienceInput!): Experience!
    deleteExperience(id: ID!): Boolean!
  }

  """
  Pagination input for list queries
  """
  input PaginationInput {
    page: Int = 1
    limit: Int = 10
  }

  """
  Paginated response wrapper
  """
  type PaginatedResponse {
    items: [JSON]!
    total: Int!
    page: Int!
    pages: Int!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createProject(input: ProjectInput!): Project
    createSkill(input: SkillInput!): Skill
    createExperience(input: ExperienceInput!): Experience
    updateProfile(input: ProfileInput!): Profile
  }
`;

export default typeDefs;
