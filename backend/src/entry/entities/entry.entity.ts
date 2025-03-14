import { Category } from "src/category/entity/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    amount: number

    @ManyToOne(() => Category, (category) => category.entries, { onDelete: 'CASCADE' })
    category: Category;
}