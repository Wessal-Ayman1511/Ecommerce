import { v2 as Cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY } from 'src/common/constants';


export const CloudinaryProvider = {
  provide: CLOUDINARY,
  
  useFactory: (configService: ConfigService) => {
    Cloudinary.config({
      cloud_name: configService.get('CLOUD_NAME'),
      api_key: configService.get('API_KEY'),
      api_secret: configService.get('API_SECRET'),
    });
    return Cloudinary
  },
  inject: [ConfigService]
};
