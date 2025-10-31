# CodeFolio 🚀

A modern, GraphQL-powered portfolio backend built with TypeScript, Apollo Server, and MongoDB. Perfect for developers looking to showcase their projects, skills, and experiences through a robust API.

## 🌟 Features

- **GraphQL API**: Modern, flexible API built with Apollo Server
- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB Integration**: Robust data persistence with Mongoose
- **JWT Authentication**: Secure authentication system
- **CRUD Operations**: Complete management for:
  - Portfolio Profile
  - Projects
  - Skills
  - Professional Experience
- **Input Validation**: Built-in validation for all mutations
- **Comprehensive Testing**: Full test coverage using Jest

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Apollo Server Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Jest for Testing
- GraphQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YassineElHassani/CodeFolio.git
   cd CodeFolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/codefolio
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 API Structure

### Types

```graphql
type Profile {
  id: ID!
  name: String!
  title: String
  bio: String
  avatarUrl: String
  social: [Social]
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
```

### Queries

```graphql
type Query {
  getPortfolio: Portfolio
  getProfile: Profile
  getProjects: [Project]
  getSkills: [Skill]
  getExperiences: [Experience]
}
```

### Mutations

```graphql
type Mutation {
  login(username: String!, password: String!): AuthPayload
  logout: Boolean
  
  createProject(input: ProjectInput!): Project
  updateProject(id: ID!, input: ProjectInput!): Project
  deleteProject(id: ID!): Boolean
  
  createSkill(input: SkillInput!): Skill
  updateSkill(id: ID!, input: SkillInput!): Skill
  deleteSkill(id: ID!): Boolean
  
  createExperience(input: ExperienceInput!): Experience
  updateExperience(id: ID!, input: ExperienceInput!): Experience
  deleteExperience(id: ID!): Boolean
  
  updateProfile(input: ProfileInput!): Profile
}
```

## 🧪 Testing

The project includes comprehensive tests for all functionality. To run the tests:

```bash
npm test
```

Test coverage includes:
- Authentication
- Profile Management
- Project Management
- Skill Management
- Experience Management

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## 🔧 Development

### Project Structure

```
src/
├── __tests__/        # Test files
├── models/           # Mongoose models
├── utils/           # Utility functions
├── index.ts         # Entry point
├── resolvers.ts     # GraphQL resolvers
└── schema.ts        # GraphQL schema
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
