import {applyDecorators, UseInterceptors} from "@nestjs/common"
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {extname} from 'path'
import {existsSync, mkdirSync} from 'fs'
import {randomUUID} from 'crypto'

const createCustomStorage = (destinationPath = './uploads') => {
    return diskStorage({
        destination : (req, file, callback) => {
            if(!existsSync(destinationPath)){
                mkdirSync(destinationPath, {recursive:true})
            }
            callback(null, destinationPath)
        },
        filename : (req, file, callback) => {
            const uniqueSuffix = randomUUID()
            const ext = extname(file.originalname).toLowerCase()
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
        }
    })
}

export const UploadSingle = (fieldName = 'file', destination = './uploads') => {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage : createCustomStorage(destination)
            }),
        ),
    );
}

export const UploadMultiple = (fieldName = 'files', maxCount = 10, destination = './uploads') => {
    return applyDecorators(
        UseInterceptors(
            FilesInterceptor(fieldName, maxCount, {
                storage : createCustomStorage(destination)
            })
        )
    )
}