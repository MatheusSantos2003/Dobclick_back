import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProdutoEntity } from "./Produto";
import { UsuarioEntity } from "./Usuario";



@Entity({ name: "Compra" })
export class CompraEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    dataCompra?: Date;

    @Column({ nullable: false })
    pagamentoEfetuado?: boolean;

    @Column({ nullable: false })
    formaPagamento?: number;

    @Column({ nullable: false })
    valorTotal?: number;

    @Column({ nullable: false })
    valorCompra?: number;

    @Column({ nullable: false })
    fornecedor?: string;

    @Column({ nullable: false })
    fornecedorContato?: string;

    @Column({ nullable: false })
    quantidade?: number;

    @ManyToOne(() => ProdutoEntity, (produto) => produto.Id)
    produto!: ProdutoEntity

    
    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.Id)
    usuario!: UsuarioEntity;

}