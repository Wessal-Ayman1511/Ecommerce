import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";



@Injectable()
export class RequiredthumbnailPipe implements PipeTransform{

    transform(value: any, metadata: ArgumentMetadata) {

        if(!value || !value.thumbnail)
            throw new BadRequestException("Thumbnail must be Provided")

        return value
        
    }

}