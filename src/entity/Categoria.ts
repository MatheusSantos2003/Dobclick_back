import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: "Categoria" })
export class CategoriaEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    descricao?: string;


}