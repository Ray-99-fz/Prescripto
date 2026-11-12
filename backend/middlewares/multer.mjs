import multer from 'multer'

const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname)
        // callback(null, file.name)
    }
})

const upload = multer({storage})

export default upload