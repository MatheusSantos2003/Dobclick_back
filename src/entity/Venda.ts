import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UsuarioEntity } from "./Usuario";


@Entity({ name: "Venda" })
export class VendaEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    datavenda?: Date;

    @Column({ nullable: false })
    pagamentoEfetuado?: boolean;

    @Column({ nullable: false })
    formaPagamento?: number;

    @Column({ nullable: false })
    valorTotal?: number;

    @Column({ nullable: true })
    valorTotalDisplay?: string;

    @Column({nullable:false})
    cliente?: string;

    @Column({nullable:false})
    clienteContato?: string;

    @Column({nullable:false})
    produtoDisplay?:string;

    @Column({nullable:false})
    quantidadeDisplay?:string;

    @Column({nullable:false})
    dataVendaDisplay?:string;


    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.Id)
    usuario!: UsuarioEntity;


}