import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProdutoEntity } from "./Produto";
import { UsuarioEntity } from "./Usuario";
import { VendaEntity } from "./Venda";


@Entity({ name: "VendaProduto" })
export class VendaProdutoEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @ManyToOne(() => VendaEntity, (venda) => venda.Id,{ onDelete: 'CASCADE' })
    venda!: VendaEntity | null;

    @ManyToOne(() => ProdutoEntity, (produto) => produto.Id)
    produto!: ProdutoEntity

    @Column({ nullable: false })
    valorVenda?: number;

    @Column({ nullable: false })
    quantidade?: number


}