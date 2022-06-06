import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClienteEntity } from "./Cliente";
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


    @ManyToOne(()=> ClienteEntity,(cliente) => cliente.Id)
    cliente!: ClienteEntity;


    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.Id)
    usuario!: UsuarioEntity;


}