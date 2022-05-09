import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: "Categoria" })
export default class CategoriaEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    descricao?:string;


}