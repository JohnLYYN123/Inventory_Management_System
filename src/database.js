const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paperData) => {
    try {
      // TODO: Implement paper creation
      //
      // paperData includes:
      // - title: string
      // - publishedIn: string
      // - year: number
      // - authors: array of author objects
      //   each author has:
      //   - name: string
      //   - email: string (optional)
      //   - affiliation: string (optional)
      //
      // Steps:
      // 1. For each author in paperData.authors:
      //    - First try to find an existing author with matching name, email, and affiliation
      //    - If not found, create a new author
      // 2. Create the paper and connect it with the authors
      // 3. Make sure to include authors in the response
      //
      // Hint: Use prisma.author.findFirst() to find existing authors
      // and prisma.paper.create() with { connect: [...] } to connect authors
      let authorId = [];
      for (let author of paperData.authors) {
        let existingAuthor = await prisma.author.findFirst({
          where: {
            name: author.name,
            email: author.email,
            affiliation: author.affiliation,
          },
        });
        if (!existingAuthor) {
          const newAuthor = await prisma.author.create({
            data: author,
          });
          authorId.push({ id: newAuthor.id });
        }
        else {
          authorId.push({ id: existingAuthor.id });
        }
      }
      
      let result = await prisma.paper.create({
        data: {
          title: paperData.title,
          publishedIn: paperData.publishedIn,
          year: paperData.year,
          authors: {
            connect: authorId,
          },
        },
        include: { authors: true },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllPapers: async (filters = {}) => {
    try {
      // TODO: Implement getting all papers with filters
      //
      // filters can include:
      // - year: number
      // - publishedIn: string (partial match)
      // - author: string (partial match)
      // - limit: number (default: 10)
      // - offset: number (default: 0)
      //
      // Use await prisma.paper.findMany()
      // Include authors in the response
      // Return { papers, total, limit, offset }
      let whereClause = {
        year: filters.year,
        publishedIn: {
          contains: filters.published_in,
          mode: "insensitive",
        },
      };
      let authorArray = [];
      if (filters.author) {
        authorArray = Array.isArray(filters.author) ? filters.author : [filters.author];
      }
      if (authorArray.length > 0) {
        whereClause.authors = {
          some: {
            OR: authorArray.map((authorName) => ({
              name: {
                contains: authorName,
                mode: "insensitive",
              },
            })),
          },
        };
      }
      const papers = await prisma.paper.findMany({
        where: whereClause,
        include: { authors: true },
        skip: filters.offset,
        take: filters.limit,
        orderBy: {
          id: "asc",
        },
      });
      return {papers, total: papers.length, limit: filters.limit, offset: filters.offset};
    } catch (error) {
      throw error;
    }
  },

  getPaperById: async (id) => {
    try {
      // TODO: Implement getting paper by ID
      //
      // Use await prisma.paper.findUnique()
      // Include authors in the response
      // Return null if not found
      const paperId = await prisma.paper.findUnique({
        where: {
          id: id,
        },
        include: { authors: true },
      });
      if (!paperId) {
        return null;
      }
      return paperId;
    } catch (error) {
      throw error;
    }
  },

  updatePaper: async (id, paperData) => {
    try {
      // TODO: Implement paper update
      //
      // paperData includes:
      // - title: string
      // - publishedIn: string
      // - year: number
      // - authors: array of author objects
      //   each author has:
      //   - name: string
      //   - email: string (optional)
      //   - affiliation: string (optional)
      //
      // Steps:
      // 1. For each author in paperData.authors:
      //    - First try to find an existing author with matching name, email, and affiliation
      //    - If not found, create a new author
      // 2. Update the paper with new field values
      // 3. Replace all author relationships with the new set of authors
      // 4. Make sure to include authors in the response
      //
      // Hint: Use prisma.author.findFirst() to find existing authors
      // and prisma.paper.update() with authors: { set: [], connect: [...] }
      // to replace author relationships
      const authorId = [];
      for (let author of paperData.authors) {
        let existingAuthor = await prisma.author.findFirst({
          where: {
            name: author.name,
            email: author.email,
            affiliation: author.affiliation,
          },
        });
        if (!existingAuthor) {
          const newAuthor = await prisma.author.create({
            data: author,
          });
          authorId.push({ id: newAuthor.id });
        } else {
          authorId.push({ id: existingAuthor.id });
        }
      }
      const updatePaper = await prisma.paper.update({
        where: {
          id: id,
        },
        data: {
          title: paperData.title,
          publishedIn: paperData.publishedIn,
          year: paperData.year,
          authors: {
            set: [],
            connect: authorId,
          },
        },
        include: { authors: true },
      });
      return updatePaper;
    } catch (error) {
      throw error;
    }
  },

  deletePaper: async (id) => {
    try {
      // TODO: Implement paper deletion
      //
      // Use await prisma.paper.delete()
      // Return nothing (undefined)
      await prisma.paper.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Author Operations
  createAuthor: async (authorData) => {
    try {
      // TODO: Implement author creation
      //
      // authorData includes:
      // - name: string
      // - email: string (optional)
      // - affiliation: string (optional)
      //
      // Use await prisma.author.create()
      // Return the created author
      const newAuthor = await prisma.author.create({
        data: {
          name: authorData.name,
          email: authorData.email,
          affiliation: authorData.affiliation,
        },
      });
      return newAuthor;
    } catch (error) {
      throw error;
    }
  },

  getAllAuthors: async (filters = {}) => {
    try {
      // TODO: Implement getting all authors with filters
      //
      // filters can include:
      // - name: string (partial match)
      // - affiliation: string (partial match)
      // - limit: number (default: 10)
      // - offset: number (default: 0)
      //
      // Use await prisma.author.findMany()
      // Include papers in the response
      // Return { authors, total, limit, offset }
      const getAuthers = await prisma.author.findMany({
        where: {
          name: {
            contains: filters.name,
            mode: "insensitive",
          },
          affiliation: {
            contains: filters.affiliation,
            mode: "insensitive",
          },
        },
        include: { papers: true },
        skip: filters.offset,
        take: filters.limit,
      });
      return { authors: getAuthers, total: getAuthers.length, limit: filters.limit, offset: filters.offset };
    } catch (error) {
      throw error;
    }
  },

  getAuthorById: async (id) => {
    try {
      // TODO: Implement getting author by ID
      //
      // Use await prisma.author.findUnique()
      // Include papers in the response
      // Return null if not found
      const authorId = await prisma.author.findUnique({
        where: {
          id: id,
        },
        include: { papers: true },
      });
      if (!authorId) {
        return null;
      } else {
        return authorId;
      }
    } catch (error) {
      throw error;
    }
  },

  updateAuthor: async (id, authorData) => {
    try {
      // TODO: Implement author update
      //
      // Use await prisma.author.update()
      // Return updated author with papers
      const authorExisting = await prisma.author.findUnique({
        where: {
          id: id,
        },
        include: { papers: true },
      });
      if (!authorExisting) {
        return null;
      }
      const updateAuthor = await prisma.author.update({
        where: {
          id: id,
        },
        data: {
          name: authorData.name,
          email: authorData.email,
          affiliation: authorData.affiliation,
        },
        include: { papers: true },
      });
      return updateAuthor
    } catch (error) {
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    try {
      // TODO: Implement author deletion
      //
      // First check if author is sole author of any papers
      // If yes, throw error
      // If no, delete author
      // Use await prisma.author.delete()
      return await prisma.author.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  getPapersByAuthorId: async (id) => {
    try {
      const paper = await prisma.paper.findMany({
        where: {
          authors: {
            some: {
              id: id,
            },
          },
        },
        include: { authors: true },
      });
      return paper;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  ...dbOperations,
};
