import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Controller('entry')
export class EntryController {

    constructor(private readonly entryService: EntryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.entryService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id') id: number) {
        return this.entryService.findById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createEntryDto: CreateEntryDto) {
        return this.entryService.create(createEntryDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() updateEntryDto: UpdateEntryDto) {
        return this.entryService.update(id, updateEntryDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: number, @Req() req: Request) {
        return this.entryService.delete(id);
    }

}
