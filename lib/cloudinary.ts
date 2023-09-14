import {v2 as cloudinary} from 'cloudinary';

/**
 * Why did we import v2 as cloudinary if we are not going to use it?
 */

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

export default cloudinary;

/**
 * The code above allows us to access the credentials of our env by using the proccess.env code
 * "secure" is recommended here because when we upload images to cloudinary, there will be two kinds of url. One will be with https and the other will be with http.
 * Using "secure" as true, the url with https will be generated.
 * If we try to render images with just http, NextJS will give us a warning because we set secure as true.
 */