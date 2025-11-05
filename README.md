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
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 🛠️ Tech Stack

- Node.js & TypeScript
- Apollo Server Express
- MongoDB & Mongoose
- GraphQL
- JSON Web Tokens (JWT)
- Docker & Docker Compose
- Jest for Testing
- Rate Limiting
- CORS Support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Docker and Docker Compose
- Node.js (v18 or higher) - *Only needed for local development*
- Git

## 🚀 Getting Started

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YassineElHassani/CodeFolio.git
   cd CodeFolio
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://db:27017/codefolio
   JWT_SECRET=your_secure_secret_key_here
   NODE_ENV=development
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```
   This will:
   - Build the Docker images
   - Start MongoDB container
   - Start the API server
   - Set up the network between containers

4. **Initialize the database**
   ```bash
   # Run the seed script to create initial data
   npm run seed
   ```
   This creates an admin user with:
   - Username: `admin`
   - Password: `admin123`

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file with:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/codefolio
   JWT_SECRET=your_secure_secret_key_here
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running locally or use Docker:
   ```bash
   docker-compose up -d db
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database**
   ```bash
   npm run seed
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

## 📝 API Documentation

### Authentication

All mutation operations (except login) require authentication. Add the JWT token to your request headers:
```
Authorization: Bearer your_token_here
```

### Available Endpoints

The GraphQL API is available at: `http://localhost:4000/graphql`

#### Key Operations:

1. **Authentication**
   - Login: `mutation { login(username: String!, password: String!) }`
   - Logout: `mutation { logout }`

2. **Portfolio**
   - Get Full Portfolio: `query { getPortfolio }`
   - Get Profile: `query { getProfile }`
   - Update Profile: `mutation { updateProfile(input: ProfileInput!) }`

3. **Projects**
   - Get Projects: `query { getProjects }`
   - Create Project: `mutation { createProject(input: ProjectInput!) }`
   - Update Project: `mutation { updateProject(id: ID!, input: ProjectInput!) }`
   - Delete Project: `mutation { deleteProject(id: ID!) }`

4. **Skills**
   - Get Skills: `query { getSkills }`
   - Create Skill: `mutation { createSkill(input: SkillInput!) }`
   - Update Skill: `mutation { updateSkill(id: ID!, input: SkillInput!) }`
   - Delete Skill: `mutation { deleteSkill(id: ID!) }`

5. **Experiences**
   - Get Experiences: `query { getExperiences }`
   - Create Experience: `mutation { createExperience(input: ExperienceInput!) }`
   - Update Experience: `mutation { updateExperience(id: ID!, input: ExperienceInput!) }`
   - Delete Experience: `mutation { deleteExperience(id: ID!) }`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For test coverage:
```bash
npm run test:coverage
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
- `npm run seed` - Seed the database

## 🛟 Troubleshooting

1. **Docker Issues**
   - If containers won't start, try:
     ```bash
     docker-compose down
     docker-compose up -d
     ```
   - To view logs:
     ```bash
     docker-compose logs -f api
     ```

2. **Database Issues**
   - Reset the database:
     ```bash
     docker-compose down -v
     docker-compose up -d
     npm run seed
     ```

3. **Authentication Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration
   - Verify token format in Authorization header

## 📚 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run seed`: Seed the database
- `npm run test:coverage`: Generate test coverage report

## 🔒 Security Features

- JWT Authentication
- Rate Limiting
- Input Validation
- CORS Configuration
- Secure Password Hashing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
