import { Controller, Post, Body } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { ImportDto } from './dto/create-import.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('import-attributes')
  importAttributes(@Body() importAttributesDto: ImportDto) {
    return true;
  }
  @Post('import-products')
  importProducts(@Body() importProductsDto: ImportDto) {
    return true;
  }
  @Post('import-variation-options')
  importVariationOptions(@Body() importVariationOptionsDto: ImportDto) {
    return true;
  }
}
