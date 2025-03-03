import { PartialType } from '@nestjs/mapped-types';
import { CreateEntryDto } from "./create-entity.dto";

export class UpdateEntryDto extends PartialType(CreateEntryDto) {}