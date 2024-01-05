import { v2 as cloudinary } from "cloudinary";



export const upload_Image_Cloudinary = async (imgData) => {
    const result = await cloudinary.uploader.upload(imgData, {
        folder: 'Company_Logo'
    })

    return result
}