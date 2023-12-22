import { extname } from 'path'
import { faker } from '@faker-js/faker'

export const imageFileFilter = (req, file, callback) => {
  console.log(file.size, "DD")
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0]
  const fileExtName = extname(file.originalname)
  callback(null, `${name}-${faker.string.uuid()}${fileExtName}`)
}
