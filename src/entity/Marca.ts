import { Column, Entity,PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: "Marca" })
export class MarcaEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({nullable: false})
    descricao?: string;


}