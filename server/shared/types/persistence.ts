/**
 * Opaque handle for a DB session or transaction.
 * Ports accept this. Only `*.repository.prisma.ts` casts it to Prisma's client.
 */
export type PersistenceContext = object;
