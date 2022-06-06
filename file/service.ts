import { File, Prisma, PrismaClient } from '@prisma/client'
import { getBucket } from "../bucket/bucket"
import { generateId } from '../utils/generator'

const fileInputFields = Prisma.validator<Prisma.FileArgs>()({
    select: { name: true, directoryId: true }
})

export type CreateFileInput = Prisma.FileGetPayload<typeof fileInputFields> & {
    key?: string, mimType: string, size: number
}

export async function createFileRecord(client: PrismaClient, file: CreateFileInput): Promise<{ file: File, url: string }> {
    const { name, directoryId, mimType, size, key: keyInput } = file
    const key = keyInput ?? (await generateId())
    const data = {
        name, directoryId, versions: {
            create: {
                name, key, mimType, size
            }
        }
    }
    const fileData = await client.file.create({ data, include: { versions: true } })
    const bucket = getBucket()
    const url = await bucket.getSignedUrl('put', key)

    return { file: fileData, url }
}