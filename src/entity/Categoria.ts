import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProdutoEntity } from "./Produto";


@Entity({ name: "Categoria" })
export class CategoriaEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    descricao?:string;


}