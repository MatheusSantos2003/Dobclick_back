import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProdutoEntity } from "./Produto";


@Entity({ name: "Estoque" })
export class EstoqueEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

   @OneToOne(() => ProdutoEntity)
   @JoinColumn()
   produto?: ProdutoEntity;


}