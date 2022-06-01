// eslint-disable-next-line
require("dotenv").config()
import express from "express"
import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = `
  type File {
    id: String!
    name: String!
    directoryId: String!
    createdAt: String!
    updatedAt: String!
    versions: [FileVersion]!
  }

  type FileVersion {
    id: String!
    name: String!
    mimeType: String!
    size: Int!
    fileId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Directory {
    id: String!
    name: String!
    parentId: String
    createdAt: String!
    updatedAt: String!
    files: [File]!
    directories: [Directory]!
  }

  type Query {
    getAllFiles: [File]!
    getAllFileVersions: [FileVersion]!
    getAllDirectories: [Directory]!
  }
`

const resolvers = {
  Query: {
    getAllFiles: () => {
      return prisma.file.findMany()
    },
    getAllFileVersions: () => {
      return prisma.fileVersion.findMany()
    },
    getAllDirectories: () => {
      return prisma.directory.findMany()
    },
  }
}

const schema = makeExecutableSchema({
  resolvers,
  typeDefs
})

const app = express()
const port = 4000

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, () => {
  console.log(`Application running on port ${port}.`)
})
