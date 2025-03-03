import { Entry } from "src/entry/entity/entry.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => Entry, (entry) => entry.category)
    entries: Entry[]
}
