import { Entry } from "src/entry/entities/entry.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ default: '' })
    description: string

    @OneToMany(() => Entry, (entry) => entry.category, { onDelete: 'CASCADE' })
    entries: Entry[]
}